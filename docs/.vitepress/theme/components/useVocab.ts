import { computed, ref } from 'vue'
import { coreTopics, learnedKey, MINE, vocabTopics } from '../../vocabTopics'

export type Pos = 'n' | 'v' | 'adj' | 'adv' | 'pron' | 'prep' | 'conj' | 'det' | 'num' | 'modal' | 'int' | 'phr'
export type Cefr = 'A1' | 'A2' | 'B1' | 'B2'

export interface Word {
  w: string
  ipa: string
  pos: Pos
  vi: string
  ex: string
  exVi: string
  /** Empty for words the learner added themselves. */
  lv: Cefr | ''
}

export const POS_LABEL: Record<Pos, string> = {
  n: 'danh từ',
  v: 'động từ',
  adj: 'tính từ',
  adv: 'trạng từ',
  pron: 'đại từ',
  prep: 'giới từ',
  conj: 'liên từ',
  det: 'từ hạn định',
  num: 'số từ',
  modal: 'động từ khiếm khuyết',
  int: 'thán từ',
  phr: 'cụm từ',
}

// Each topic file becomes its own chunk, so a topic page only downloads its own words.
const loaders = import.meta.glob<Word[]>('../../../data/vocab/*.json', { import: 'default' })

export async function loadTopic(slug: string): Promise<Word[]> {
  if (slug === MINE.slug) return useMine().words.value
  const load = loaders[`../../../data/vocab/${slug}.json`]
  return load ? load() : []
}

function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    // Storage can be blocked (private mode); data then lasts for this visit only.
    return fallback
  }
}
function writeStore(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // See readStore.
  }
}

/** A set of word keys kept in this browser, shared by every component that uses it. */
function keySet(storageKey: string, list = ref<string[]>([])) {
  let loaded = false
  return () => {
    if (!loaded && typeof window !== 'undefined') {
      loaded = true
      list.value = readStore(storageKey, [])
    }
    const keys = computed(() => new Set(list.value))
    function set(key: string, on: boolean) {
      if (keys.value.has(key) === on) return
      list.value = on ? [...list.value, key] : list.value.filter((k) => k !== key)
      writeStore(storageKey, list.value)
    }
    const toggle = (key: string) => set(key, !keys.value.has(key))
    return { keys, set, toggle }
  }
}

const learnedList = ref<string[]>([])
const learnedSet = keySet('stnp.vocab.learned', learnedList)
// When each word was marked as learned (epoch ms), kept beside the plain key list so older
// data stays valid. Words marked before this existed simply have no time.
const LEARNED_AT_KEY = 'stnp.vocab.learnedAt'
const learnedAt = ref<Record<string, number>>({})
let learnedAtLoaded = false

/** "Đã thuộc / đã biết". Keys come from learnedKey(). */
export function useLearned() {
  if (!learnedAtLoaded && typeof window !== 'undefined') {
    learnedAtLoaded = true
    learnedAt.value = readStore(LEARNED_AT_KEY, {})
  }
  const { keys, set: setKey } = learnedSet()
  function set(key: string, on: boolean) {
    if (keys.value.has(key) === on) return
    setKey(key, on)
    const next = { ...learnedAt.value }
    if (on) next[key] = Date.now()
    else delete next[key]
    learnedAt.value = next
    writeStore(LEARNED_AT_KEY, next)
  }
  const toggle = (key: string) => set(key, !keys.value.has(key))
  return { learned: keys, learnedAt, set, toggle }
}

/** Words the learner said they don't know yet (from the article analyser). */
const unknownList = ref<string[]>([])
export const useUnknown = keySet('stnp.vocab.unknown', unknownList)

const MINE_KEY = 'stnp.vocab.mine'
const mineList = ref<Word[]>([])
let mineLoaded = false
/** "Từ của tôi": words outside the dictionary that the learner added with their own meaning. */
export function useMine() {
  if (!mineLoaded && typeof window !== 'undefined') {
    mineLoaded = true
    mineList.value = readStore(MINE_KEY, [])
  }
  function save(word: Word) {
    mineList.value = [...mineList.value.filter((x) => x.w !== word.w), word]
    writeStore(MINE_KEY, mineList.value)
  }
  function remove(w: string) {
    mineList.value = mineList.value.filter((x) => x.w !== w)
    writeStore(MINE_KEY, mineList.value)
  }
  return { words: mineList, save, remove }
}

let voice: SpeechSynthesisVoice | undefined

function pickVoice() {
  const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.replace('_', '-').startsWith('en-US'))
  return voices.find((v) => /Samantha|Google US English|Aria|Jenny/i.test(v.name)) ?? voices[0]
}

export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window

export function speak(text: string, rate = 0.9) {
  if (!canSpeak()) return
  voice ??= pickVoice()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = rate
  if (voice) u.voice = voice
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(u)
}

/** Lowercase and strip Vietnamese diacritics so "gia dinh" finds "gia đình". */
export const fold = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'd').toLowerCase()

/** A word together with the topic it comes from (the same headword can sit in a core and an IT topic). */
export interface Item {
  slug: string
  word: Word
}
export const itemKey = (i: Item) => learnedKey(i.slug, i.word.w)
const itemRef = (slug: string, w: string) => `${slug}|${w}`

/* "Hôm nay học": words the learner picked for a given day, kept per local date so yesterday's
   unfinished words can be carried over. Stored in this browser only. */
const TODAY_KEY = 'stnp.vocab.today'
const KEEP_DAYS = 60
const days = ref<Record<string, string[]>>({})
let daysLoaded = false

export function localDate(d = new Date()) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function saveDays() {
  // Drop old days so storage stays small.
  const dates = Object.keys(days.value).sort().reverse()
  for (const d of dates.slice(KEEP_DAYS)) delete days.value[d]
  try {
    window.localStorage.setItem(TODAY_KEY, JSON.stringify(days.value))
  } catch {
    // Storage blocked: the list lasts for this visit only.
  }
}

export function useToday() {
  if (!daysLoaded && typeof window !== 'undefined') {
    daysLoaded = true
    try {
      const raw = window.localStorage.getItem(TODAY_KEY)
      if (raw) days.value = JSON.parse(raw)
    } catch {
      // See saveDays.
    }
  }
  const today = localDate()
  const refs = computed(() => days.value[today] ?? [])
  const refSet = computed(() => new Set(refs.value))

  function set(list: string[]) {
    days.value = { ...days.value, [today]: list }
    if (!list.length) delete days.value[today]
    saveDays()
  }
  const has = (slug: string, w: string) => refSet.value.has(itemRef(slug, w))
  function toggle(slug: string, w: string) {
    const r = itemRef(slug, w)
    set(refSet.value.has(r) ? refs.value.filter((x) => x !== r) : [...refs.value, r])
  }
  function addRefs(list: string[]) {
    set([...refs.value, ...list.filter((r) => !refSet.value.has(r))])
  }
  const add = (items: Item[]) => addRefs(items.map((i) => itemRef(i.slug, i.word.w)))
  const clear = () => set([])

  /** The most recent earlier day that has a list, for carrying unfinished words over. */
  const previous = computed(() => {
    const d = Object.keys(days.value)
      .filter((x) => x < today && days.value[x]?.length)
      .sort()
      .pop()
    return d ? { date: d, refs: days.value[d] } : undefined
  })

  /** Unique words from the lists of earlier days, newest day first; `daysBack` null = every stored day. */
  function pastRefs(daysBack: number | null) {
    const from = daysBack === null ? '' : localDate(new Date(Date.now() - daysBack * 86_400_000))
    const dates = Object.keys(days.value)
      .filter((d) => d < today && d >= from)
      .sort()
      .reverse()
    return [...new Set(dates.flatMap((d) => days.value[d] ?? []))]
  }

  return { today, refs, has, toggle, add, addRefs, clear, previous, pastRefs }
}

/** Turns stored "slug|word" refs back into items, loading only the topics they need. */
export async function resolveRefs(refs: string[]): Promise<Item[]> {
  const slugs = [...new Set(refs.map((r) => r.split('|')[0]))]
  const topics = Object.fromEntries(await Promise.all(slugs.map(async (s) => [s, await loadTopic(s)] as const)))
  return refs.flatMap((r) => {
    const [slug, w] = r.split('|')
    const word = topics[slug]?.find((x) => x.w === w)
    return word ? [{ slug, word }] : []
  })
}

/** Turns "đã thuộc" keys (see learnedKey) back into items, in the order given. Core words are
    stored bare, so every topic is loaded to find which one a bare word belongs to. */
export async function resolveLearned(keys: string[]): Promise<Item[]> {
  const slugs = [...vocabTopics.map((t) => t.slug), MINE.slug]
  const data = Object.fromEntries(await Promise.all(slugs.map(async (s) => [s, await loadTopic(s)] as const)))
  const coreSlug = new Map<string, string>()
  for (const t of coreTopics) for (const w of data[t.slug] ?? []) if (!coreSlug.has(w.w)) coreSlug.set(w.w, t.slug)

  return keys.flatMap((key) => {
    const sep = key.indexOf(':')
    const prefixed = sep > 0 && key.slice(0, sep) in data
    const slug = prefixed ? key.slice(0, sep) : coreSlug.get(key)
    const w = prefixed ? key.slice(sep + 1) : key
    const word = slug ? data[slug]?.find((x) => x.w === w) : undefined
    return slug && word ? [{ slug, word }] : []
  })
}

/* Quiz activity per local date: how many answers were given and how many were right. Kept for
   the progress page's daily chart; only counts are stored, not the words. */
const QUIZ_LOG_KEY = 'stnp.vocab.quizLog'
export interface QuizDay {
  done: number
  ok: number
}
const quizLog = ref<Record<string, QuizDay>>({})
let quizLogLoaded = false

export function useQuizLog() {
  if (!quizLogLoaded && typeof window !== 'undefined') {
    quizLogLoaded = true
    quizLog.value = readStore(QUIZ_LOG_KEY, {})
  }
  function record(ok: boolean) {
    const d = localDate()
    const day = quizLog.value[d] ?? { done: 0, ok: 0 }
    quizLog.value = { ...quizLog.value, [d]: { done: day.done + 1, ok: day.ok + (ok ? 1 : 0) } }
    writeStore(QUIZ_LOG_KEY, quizLog.value)
  }
  /** "Từ của mình cũng đúng" turns a wrong answer from today into a right one. */
  function upgrade() {
    const d = localDate()
    const day = quizLog.value[d]
    if (!day || day.ok >= day.done) return
    quizLog.value = { ...quizLog.value, [d]: { ...day, ok: day.ok + 1 } }
    writeStore(QUIZ_LOG_KEY, quizLog.value)
  }
  return { log: quizLog, record, upgrade }
}

/* ---------- Access for account sync (sync.ts) ---------- */

export interface LocalData {
  learned: string[]
  learnedAt: Record<string, number>
  unknown: string[]
  days: Record<string, string[]>
  mine: Word[]
  quiz: Record<string, QuizDay>
}

/** Loads every store and returns their reactive contents. */
export function localData() {
  useLearned()
  useUnknown()
  useMine()
  useToday()
  useQuizLog()
  return computed<LocalData>(() => ({
    learned: learnedList.value,
    learnedAt: learnedAt.value,
    unknown: unknownList.value,
    days: days.value,
    mine: mineList.value,
    quiz: quizLog.value,
  }))
}

/** Replaces every store with data that came from the account, in memory and in this browser. */
export function replaceLocalData(d: LocalData) {
  learnedList.value = d.learned
  learnedAt.value = d.learnedAt
  unknownList.value = d.unknown
  days.value = d.days
  mineList.value = d.mine
  quizLog.value = d.quiz
  writeStore('stnp.vocab.learned', d.learned)
  writeStore(LEARNED_AT_KEY, d.learnedAt)
  writeStore('stnp.vocab.unknown', d.unknown)
  writeStore(TODAY_KEY, d.days)
  writeStore(MINE_KEY, d.mine)
  writeStore(QUIZ_LOG_KEY, d.quiz)
}
