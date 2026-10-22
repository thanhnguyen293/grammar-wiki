// Pomodoro timer shown in the top bar. The state is stored as an end time rather than a ticking
// counter, so the timer stays correct across page changes, reloads and several open tabs.
import { computed, reactive, ref } from 'vue'
import { localDate } from './useVocab'

export type PomodoroMode = 'focus' | 'short' | 'long'

export interface PomodoroSettings {
  focus: number
  short: number
  long: number
  /** A long break after this many focus sessions. */
  longEvery: number
  /** Start the next session by itself when one ends. */
  autoStart: boolean
}

interface PomodoroState {
  mode: PomodoroMode
  running: boolean
  /** Epoch ms when the running session ends. */
  endsAt: number | null
  /** Ms left while paused. */
  remaining: number
  /** Focus sessions finished in the current cycle. */
  round: number
  settings: PomodoroSettings
  /** Focus sessions finished per local date. */
  done: Record<string, number>
}

const KEY = 'stnp.pomodoro'
const MIN = 60_000
const DEFAULTS: PomodoroSettings = { focus: 25, short: 5, long: 15, longEvery: 4, autoStart: false }

const minutes = (s: PomodoroSettings, m: PomodoroMode) => (m === 'focus' ? s.focus : m === 'short' ? s.short : s.long)

const state = reactive<PomodoroState>({
  mode: 'focus',
  running: false,
  endsAt: null,
  remaining: DEFAULTS.focus * MIN,
  round: 0,
  settings: { ...DEFAULTS },
  done: {},
})
const now = ref(Date.now())
let started = false

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Storage blocked: the timer still runs while the page is open.
  }
}
function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const s = JSON.parse(raw) as Partial<PomodoroState>
      Object.assign(state, s, { settings: { ...DEFAULTS, ...s.settings } })
    }
  } catch {
    // Keep defaults.
  }
}

const msLeft = () => (state.running && state.endsAt ? Math.max(0, state.endsAt - now.value) : state.remaining)

/* ---------- End of a session: sound, notification, next mode ---------- */

function chime() {
  try {
    const ctx = new AudioContext()
    ;[0, 0.35, 0.7].forEach((t, i) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.frequency.value = i === 2 ? 880 : 660
      g.gain.setValueAtTime(0.0001, ctx.currentTime + t)
      g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.3)
      o.connect(g).connect(ctx.destination)
      o.start(ctx.currentTime + t)
      o.stop(ctx.currentTime + t + 0.32)
    })
  } catch {
    // No audio: the notification and the title still show it.
  }
}

let notifyText: (mode: PomodoroMode) => { title: string; body: string } = () => ({ title: '', body: '' })

function finish() {
  // Another tab may have finished this session already.
  load()
  if (!state.running || !state.endsAt || state.endsAt > Date.now()) return
  const ended = state.mode
  if (ended === 'focus') {
    const d = localDate()
    state.done = { ...state.done, [d]: (state.done[d] ?? 0) + 1 }
    state.round += 1
  }
  const next: PomodoroMode =
    ended === 'focus' ? (state.round % state.settings.longEvery === 0 ? 'long' : 'short') : 'focus'
  if (next === 'focus' && ended === 'long') state.round = 0
  state.mode = next
  const len = minutes(state.settings, next) * MIN
  state.running = state.settings.autoStart
  state.endsAt = state.running ? Date.now() + len : null
  state.remaining = len
  save()
  chime()
  try {
    if ('Notification' in window && Notification.permission === 'granted') {
      const { title, body } = notifyText(ended)
      new Notification(title, { body, tag: 'pomodoro' })
    }
  } catch {
    // Notifications unavailable.
  }
}

/* ---------- Tab title ---------- */

const TITLE_PREFIX = /^\d+:\d\d · /
function updateTitle() {
  const base = document.title.replace(TITLE_PREFIX, '')
  const show = state.running || msLeft() < minutes(state.settings, state.mode) * MIN
  document.title = show ? `${format(msLeft())} · ${base}` : base
}

export function format(ms: number) {
  const s = Math.ceil(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

function tick() {
  now.value = Date.now()
  if (state.running && state.endsAt && state.endsAt <= now.value) finish()
  updateTitle()
}

/** Call once on the client: loads the saved timer and keeps it ticking. */
export function initPomodoro(text: typeof notifyText) {
  notifyText = text
  if (started || typeof window === 'undefined') return
  started = true
  load()
  tick()
  setInterval(tick, 1000)
  // Another tab started, paused or changed the timer.
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      load()
      tick()
    }
  })
}

export function usePomodoro() {
  const left = computed(() => msLeft())
  const total = computed(() => minutes(state.settings, state.mode) * MIN)
  const today = computed(() => state.done[localDate()] ?? 0)

  function start() {
    if (state.running) return
    state.running = true
    state.endsAt = Date.now() + state.remaining
    save()
    tick()
    // Ask once, on a click, so the browser allows the prompt.
    if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission()
  }
  function pause() {
    if (!state.running) return
    state.remaining = msLeft()
    state.running = false
    state.endsAt = null
    save()
    tick()
  }
  function reset() {
    state.running = false
    state.endsAt = null
    state.remaining = total.value
    save()
    tick()
  }
  function setMode(m: PomodoroMode) {
    state.mode = m
    reset()
  }
  /** Ends the current session now and moves on, as if its time had run out. */
  function skip() {
    if (!state.running) state.running = true
    state.endsAt = Date.now() - 1
    save()
    finish()
    tick()
  }
  function updateSettings(s: Partial<PomodoroSettings>) {
    state.settings = { ...state.settings, ...s }
    if (!state.running) state.remaining = total.value
    save()
    tick()
  }

  return { state, left, total, today, start, pause, reset, setMode, skip, updateSettings }
}
