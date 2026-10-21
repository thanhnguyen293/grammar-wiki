import { computed, ref } from 'vue'
import { learnedKey } from '../../vocabTopics'

export type Pos = 'n' | 'v' | 'adj' | 'adv' | 'pron' | 'prep' | 'conj' | 'det' | 'num' | 'modal' | 'int' | 'phr'
export type Cefr = 'A1' | 'A2' | 'B1' | 'B2'

export interface Word {
  w: string
  ipa: string
  pos: Pos
  vi: string
  ex: string
  exVi: string
  lv: Cefr
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
const loaders = import.meta.glob<Word[]>('../../../tu-vung/data/*.json', { import: 'default' })

export async function loadTopic(slug: string): Promise<Word[]> {
  const load = loaders[`../../../tu-vung/data/${slug}.json`]
  return load ? load() : []
}

/* Learned words: one list for the whole site, kept in this browser only. Words are
   unique across topics (scripts/check-vocab.mjs enforces it), so the word is the key. */
const STORAGE_KEY = 'stnp.vocab.learned'
const learnedList = ref<string[]>([])
let loaded = false

export function useLearned() {
  if (!loaded && typeof window !== 'undefined') {
    loaded = true
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) learnedList.value = JSON.parse(raw)
    } catch {
      // Storage can be blocked (private mode); progress then lasts for this visit only.
    }
  }
  const learned = computed(() => new Set(learnedList.value))
  function toggle(word: string) {
    const next = new Set(learnedList.value)
    if (next.has(word)) next.delete(word)
    else next.add(word)
    learnedList.value = [...next]
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(learnedList.value))
    } catch {
      // See above.
    }
  }
  return { learned, toggle }
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
