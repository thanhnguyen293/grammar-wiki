// Account sync: sign in with Google (Firebase Auth) and keep the learner's progress in one
// Firestore document per user, merged with this browser's data in both directions.
//
// The browser stays the working copy: every store keeps reading and writing localStorage as
// before. This module watches those stores, remembers when each entry changed (so removals can
// be synced too), and pushes/pulls the merged state. Firebase is only downloaded once the
// learner signs in, or on later visits after they have.
import { ref, watch } from 'vue'
import { firebaseConfig } from '../../firebase.config'
import { canonical, emptyState, mergeState, parseState, type Stamp, type SyncState } from './syncState'
import { localData, replaceLocalData, type LocalData } from './useVocab'

export type SyncStatus = 'off' | 'signing-in' | 'syncing' | 'synced' | 'error'
export interface SyncUser {
  name: string
  email: string
  photo: string | null
}

const user = ref<SyncUser | null>(null)
const status = ref<SyncStatus>('off')
const lastSynced = ref<number | null>(null)
const errorCode = ref('')

const META_KEY = 'stnp.sync.meta'
const ENABLED_KEY = 'stnp.sync.enabled'
const PUSH_DELAY = 1500

/* ---------- Change tracking ---------- */

/** When each entry last changed on this device. Signed stamps as in SyncState. */
interface Meta {
  learned: Record<string, Stamp>
  unknown: Record<string, Stamp>
  days: Record<string, number>
  mine: Record<string, Stamp>
}
const emptyMeta = (): Meta => ({ learned: {}, unknown: {}, days: {}, mine: {} })

function readMeta(): Meta {
  try {
    return { ...emptyMeta(), ...JSON.parse(localStorage.getItem(META_KEY) ?? '{}') }
  } catch {
    return emptyMeta()
  }
}
function saveMeta(m: Meta) {
  try {
    localStorage.setItem(META_KEY, JSON.stringify(m))
  } catch {
    // Storage blocked: changes are still synced while the page is open.
  }
}

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v))

/** Records what changed between two snapshots of the local stores. Returns whether anything did. */
function recordChanges(meta: Meta, prev: LocalData, next: LocalData): boolean {
  const now = Date.now()
  let changed = false
  const diffSet = (stamps: Record<string, Stamp>, a: string[], b: string[], onTime: (k: string) => number) => {
    const before = new Set(a)
    const after = new Set(b)
    for (const k of after) if (!before.has(k)) ((stamps[k] = onTime(k)), (changed = true))
    for (const k of before) if (!after.has(k)) ((stamps[k] = -now), (changed = true))
  }
  diffSet(meta.learned, prev.learned, next.learned, (k) => next.learnedAt[k] ?? now)
  diffSet(meta.unknown, prev.unknown, next.unknown, () => now)
  for (const d of new Set([...Object.keys(prev.days), ...Object.keys(next.days)])) {
    if (canonical(prev.days[d] ?? []) !== canonical(next.days[d] ?? [])) ((meta.days[d] = now), (changed = true))
  }
  const prevMine = new Map(prev.mine.map((w) => [w.w, canonical(w)]))
  const nextMine = new Map(next.mine.map((w) => [w.w, canonical(w)]))
  for (const [w, c] of nextMine) if (prevMine.get(w) !== c) ((meta.mine[w] = now), (changed = true))
  for (const w of prevMine.keys()) if (!nextMine.has(w)) ((meta.mine[w] = -now), (changed = true))
  if (canonical(prev.quiz) !== canonical(next.quiz)) changed = true
  return changed
}

/** Turns the local stores plus their change times into a mergeable state. Entries with no
    recorded time (data from before sync existed) get time 1, so any real change beats them. */
function buildState(d: LocalData, meta: Meta): SyncState {
  const s = emptyState()
  const stamped = (stamps: Record<string, Stamp>, keys: string[], fallback: (k: string) => number) => {
    const out: Record<string, Stamp> = {}
    for (const k of keys) out[k] = stamps[k] > 0 ? stamps[k] : fallback(k)
    for (const [k, v] of Object.entries(stamps)) if (v < 0 && !(k in out)) out[k] = v
    return out
  }
  s.learned = stamped(meta.learned, d.learned, (k) => d.learnedAt[k] ?? 1)
  s.unknown = stamped(meta.unknown, d.unknown, () => 1)
  for (const [day, refs] of Object.entries(d.days)) s.days[day] = { refs, at: meta.days[day] ?? 1 }
  for (const [day, at] of Object.entries(meta.days)) if (!(day in s.days)) s.days[day] = { refs: [], at }
  for (const w of d.mine) s.mine[w.w] = { word: w, at: meta.mine[w.w] > 0 ? meta.mine[w.w] : 1 }
  for (const [w, v] of Object.entries(meta.mine)) if (v < 0 && !(w in s.mine)) s.mine[w] = { word: null, at: -v }
  s.quiz = d.quiz
  return s
}

function stateToLocal(s: SyncState): LocalData {
  const on = (m: Record<string, Stamp>) => Object.keys(m).filter((k) => m[k] > 0)
  return {
    learned: on(s.learned),
    learnedAt: Object.fromEntries(Object.entries(s.learned).filter(([, v]) => v > 1)),
    unknown: on(s.unknown),
    days: Object.fromEntries(Object.entries(s.days).filter(([, v]) => v.refs.length).map(([d, v]) => [d, v.refs])),
    mine: Object.values(s.mine).flatMap((m) => (m.word ? [m.word] : [])),
    quiz: s.quiz,
  }
}

function stateToMeta(s: SyncState): Meta {
  return {
    learned: { ...s.learned },
    unknown: { ...s.unknown },
    days: Object.fromEntries(Object.entries(s.days).map(([d, v]) => [d, v.at])),
    mine: Object.fromEntries(Object.entries(s.mine).map(([w, v]) => [w, v.word ? v.at : -v.at])),
  }
}

/* ---------- Firebase ---------- */

type Firebase = {
  auth: import('firebase/auth').Auth
  authMod: typeof import('firebase/auth')
  db: import('firebase/firestore').Firestore
  fsMod: typeof import('firebase/firestore')
}
let fb: Promise<Firebase> | null = null
let uid: string | null = null
let unsubscribe: (() => void) | null = null
let remote: SyncState | null = null
let pushTimer: ReturnType<typeof setTimeout> | undefined
let meta: Meta = emptyMeta()
let prev: LocalData | null = null
let data: ReturnType<typeof localData> | null = null

function loadFirebase(): Promise<Firebase> {
  fb ??= (async () => {
    const [{ initializeApp }, authMod, fsMod] = await Promise.all([
      import('firebase/app'),
      import('firebase/auth'),
      import('firebase/firestore'),
    ])
    const app = initializeApp(firebaseConfig!)
    const auth = authMod.getAuth(app)
    const db = fsMod.getFirestore(app)
    authMod.onAuthStateChanged(auth, (u) => (u ? start(u) : stop()))
    return { auth, authMod, db, fsMod }
  })()
  return fb
}

function apply(state: SyncState) {
  replaceLocalData(stateToLocal(state))
  meta = stateToMeta(state)
  saveMeta(meta)
  // The watcher compares against this, so applying remote data is not seen as a local change.
  prev = clone(data!.value)
}

async function push(state: SyncState) {
  if (!uid) return
  const { db, fsMod } = await loadFirebase()
  status.value = 'syncing'
  try {
    await fsMod.setDoc(fsMod.doc(db, 'users', uid), {
      v: 1,
      data: JSON.stringify(state),
      updatedAt: fsMod.serverTimestamp(),
    })
    remote = state
    status.value = 'synced'
    lastSynced.value = Date.now()
  } catch (e) {
    fail(e)
  }
}

function fail(e: unknown) {
  status.value = 'error'
  errorCode.value = (e as { code?: string })?.code ?? String(e)
}

/** Merges this device with the account and writes back whichever side is behind. */
function reconcile() {
  if (!uid || !data) return
  const local = buildState(data.value, meta)
  const merged = remote ? mergeState(local, remote) : local
  if (canonical(merged) !== canonical(local)) apply(merged)
  if (!remote || canonical(merged) !== canonical(remote)) push(merged)
  else {
    status.value = 'synced'
    lastSynced.value = Date.now()
  }
}

async function start(u: import('firebase/auth').User) {
  uid = u.uid
  user.value = { name: u.displayName ?? u.email ?? '', email: u.email ?? '', photo: u.photoURL }
  status.value = 'syncing'
  try {
    localStorage.setItem(ENABLED_KEY, '1')
  } catch {
    // Without storage the learner just signs in again next visit.
  }
  const { db, fsMod } = await loadFirebase()
  unsubscribe?.()
  unsubscribe = fsMod.onSnapshot(
    fsMod.doc(db, 'users', u.uid),
    (snap) => {
      // Our own write echoing back before the server confirmed it.
      if (snap.metadata.hasPendingWrites) return
      remote = snap.exists() ? parseState(snap.data().data) : emptyState()
      reconcile()
    },
    fail,
  )
}

function stop() {
  unsubscribe?.()
  unsubscribe = null
  uid = null
  remote = null
  user.value = null
  status.value = 'off'
}

/* ---------- Public API ---------- */

let initialised = false
/** Starts change tracking; call once on the client. Reconnects if the learner signed in before. */
export function initSync() {
  if (initialised || typeof window === 'undefined' || !firebaseConfig) return
  initialised = true
  meta = readMeta()
  data = localData()
  prev = clone(data.value)
  watch(
    data,
    (next) => {
      if (!prev) return
      const changed = recordChanges(meta, prev, next)
      prev = clone(next)
      if (!changed) return
      saveMeta(meta)
      if (uid) {
        clearTimeout(pushTimer)
        pushTimer = setTimeout(reconcile, PUSH_DELAY)
      }
    },
    { deep: true },
  )
  let enabled = false
  try {
    enabled = localStorage.getItem(ENABLED_KEY) === '1'
  } catch {
    // Treated as signed out.
  }
  if (enabled) loadFirebase().catch(fail)
}

export function useSync() {
  async function signIn() {
    status.value = 'signing-in'
    errorCode.value = ''
    try {
      const { auth, authMod } = await loadFirebase()
      const provider = new authMod.GoogleAuthProvider()
      try {
        await authMod.signInWithPopup(auth, provider)
      } catch (e) {
        const code = (e as { code?: string }).code
        if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment') {
          await authMod.signInWithRedirect(auth, provider)
        } else if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
          status.value = user.value ? 'synced' : 'off'
        } else throw e
      }
    } catch (e) {
      fail(e)
    }
  }
  async function signOut() {
    try {
      localStorage.removeItem(ENABLED_KEY)
    } catch {
      // Nothing to clear.
    }
    const { auth } = await loadFirebase()
    await auth.signOut()
  }
  function syncNow() {
    clearTimeout(pushTimer)
    reconcile()
  }
  return { available: !!firebaseConfig, user, status, lastSynced, errorCode, signIn, signOut, syncNow }
}
