// Finds the words and phrases of a pasted text in the wiki's dictionary. Pure functions, no Vue,
// so the logic can be checked on its own.
import type { Item } from './useVocab'

export type EntryKind = 'phrase' | 'word' | 'unknown' | 'name'

export interface Token {
  text: string
  start: number
  end: number
  sentence: number
  /** Possible dictionary forms, most likely first ("went" → went, go). */
  bases: string[]
  entry?: string
}

export interface Entry {
  key: string
  kind: EntryKind
  /** Headword: the dictionary form of the word, or the phrase. */
  head: string
  items: Item[]
  /** Forms as written in the text, e.g. "went", "goes". */
  forms: string[]
  count: number
  sentence: number
  tokens: number[]
}

export interface Analysis {
  tokens: Token[]
  sentences: string[]
  /** Where each sentence sits in the original text. */
  spans: { start: number; end: number }[]
  entries: Entry[]
}

export interface Dict {
  words: Map<string, Item[]>
  /** Phrases keyed by their first word. */
  phrases: Map<string, { parts: string[]; items: Item[] }[]>
}

// base:form,form,… — irregular forms that suffix rules cannot recover.
const IRREGULAR = `be:am,is,are,was,were,been|have:has,had|do:does,did,done|go:goes,went,gone|say:said|get:got,gotten|make:made|know:knew,known|think:thought|take:took,taken|see:saw,seen|come:came|give:gave,given|find:found|tell:told|become:became|leave:left|feel:felt|bring:brought|begin:began,begun|keep:kept|hold:held|write:wrote,written|stand:stood|hear:heard|mean:meant|meet:met|run:ran|pay:paid|sit:sat|speak:spoke,spoken|lie:lay,lain|lead:led|grow:grew,grown|lose:lost|fall:fell,fallen|send:sent|build:built|understand:understood|draw:drew,drawn|break:broke,broken|spend:spent|rise:rose,risen|drive:drove,driven|buy:bought|wear:wore,worn|choose:chose,chosen|seek:sought|throw:threw,thrown|catch:caught|deal:dealt|win:won|forget:forgot,forgotten|sell:sold|fight:fought|teach:taught|eat:ate,eaten|sing:sang,sung|drink:drank,drunk|swim:swam,swum|fly:flew,flown|sleep:slept|shoot:shot|hide:hid,hidden|shake:shook,shaken|steal:stole,stolen|ride:rode,ridden|bite:bit,bitten|feed:fed|hang:hung|light:lit|lend:lent|bend:bent|dig:dug|forgive:forgave,forgiven|freeze:froze,frozen|blow:blew,blown|bear:bore,born|beat:beaten|wake:woke,woken|tear:tore,torn|ring:rang,rung|sink:sank,sunk|stick:stuck|strike:struck|swing:swung|show:shown|withdraw:withdrew,withdrawn|arise:arose,arisen|overcome:overcame|mistake:mistook,mistaken|burn:burnt|dream:dreamt|learn:learnt|smell:smelt|spell:spelt|spill:spilt|leap:leapt|man:men|woman:women|child:children|person:people|foot:feet|tooth:teeth|mouse:mice|goose:geese|good:better,best|well:better,best|bad:worse,worst|many:more,most|much:more,most|little:less,least|far:farther,farthest,further,furthest`

const IRREGULAR_BASES = new Map<string, string[]>()
for (const group of IRREGULAR.split('|')) {
  const [base, forms] = group.split(':')
  for (const f of forms.split(',')) IRREGULAR_BASES.set(f, [...(IRREGULAR_BASES.get(f) ?? []), base])
}

const CONTRACTION_BASE: Record<string, string> = { "can't": 'can', "won't": 'will', "shan't": 'shall', "ain't": 'be' }
/** Contractions keep only their main word: don't → do, I'm → I, you're → you, John's → John. */
function mainWord(raw: string) {
  const word = raw.replace(/’/g, "'")
  const lower = word.toLowerCase()
  if (CONTRACTION_BASE[lower]) return CONTRACTION_BASE[lower]
  if (lower.endsWith("n't")) return word.slice(0, -3)
  return word.includes("'") ? word.slice(0, word.indexOf("'")) : word
}

const VOWEL = /[aeiou]/
const doubled = (s: string) => s.length > 2 && s.at(-1) === s.at(-2) && !VOWEL.test(s.at(-1)!)

/** Candidate dictionary forms for a lowercase word, most likely first. */
export function baseForms(word: string): string[] {
  const w = word.toLowerCase()
  const out = [w, ...(IRREGULAR_BASES.get(w) ?? [])]
  const add = (s: string) => s.length > 1 && out.push(s)
  const cut = (n: number) => w.slice(0, w.length - n)

  if (w.endsWith('ies') || w.endsWith('ied')) add(cut(3) + 'y')
  if (w.endsWith('ier')) add(cut(3) + 'y')
  if (w.endsWith('iest')) add(cut(4) + 'y')
  if (w.endsWith('ves')) {
    add(cut(3) + 'f')
    add(cut(3) + 'fe')
  }
  if (w.endsWith('es')) add(cut(2))
  if (w.endsWith('s') && !w.endsWith('ss')) add(cut(1))
  if (w.endsWith('ed')) {
    add(cut(2))
    add(cut(1))
    if (doubled(cut(2))) add(cut(3))
  }
  if (w.endsWith('ying')) add(cut(4) + 'ie')
  if (w.endsWith('ing')) {
    add(cut(3))
    add(cut(3) + 'e')
    if (doubled(cut(3))) add(cut(4))
  }
  for (const [suf, len] of [['est', 3], ['er', 2]] as const) {
    if (w.endsWith(suf)) {
      add(cut(len))
      add(cut(len - 1))
      if (doubled(cut(len))) add(cut(len + 1))
    }
  }
  if (w.endsWith('ily')) add(cut(3) + 'y')
  if (w.endsWith('ally')) add(cut(4))
  if (w.endsWith('ly')) add(cut(2))
  return [...new Set(out)]
}

export function buildDict(items: Item[]): Dict {
  const words = new Map<string, Item[]>()
  const phrases = new Map<string, { parts: string[]; items: Item[] }[]>()
  const byPhrase = new Map<string, { parts: string[]; items: Item[] }>()
  for (const it of items) {
    const key = it.word.w.toLowerCase()
    if (key.includes(' ')) {
      const entry = byPhrase.get(key) ?? { parts: key.split(' ').map((p) => mainWord(p).toLowerCase()), items: [] }
      entry.items.push(it)
      if (!byPhrase.has(key)) {
        byPhrase.set(key, entry)
        phrases.set(entry.parts[0], [...(phrases.get(entry.parts[0]) ?? []), entry])
      }
    } else {
      words.set(key, [...(words.get(key) ?? []), it])
    }
  }
  // Try longer phrases first so "look forward to" wins over "look forward".
  for (const list of phrases.values()) list.sort((a, b) => b.parts.length - a.parts.length)
  return { words, phrases }
}

const WORD_RE = /[A-Za-z]+(?:['’][A-Za-z]+)*(?:-[A-Za-z]+)*/g
// Particles that can be separated from their verb: "turn the light off".
const PARTICLES = new Set(['up', 'down', 'out', 'off', 'on', 'in', 'over', 'away', 'back', 'around', 'round', 'through', 'about', 'along', 'apart', 'aside', 'together', 'forward'])
const MAX_GAP = 3
const POSSESSIVES = new Set(['my', 'your', 'his', 'her', 'its', 'our', 'their'])

function splitSentences(text: string): { start: number; end: number }[] {
  const spans: { start: number; end: number }[] = []
  const re = /[^.!?\n]+(?:[.!?]+["')\]]*|$)|\n/g
  for (const m of text.matchAll(re)) {
    if (m[0].trim()) spans.push({ start: m.index!, end: m.index! + m[0].length })
  }
  return spans
}

function tokenize(text: string): { tokens: Token[]; sentences: string[]; spans: { start: number; end: number }[] } {
  const spans = splitSentences(text)
  const sentences = spans.map((s) => text.slice(s.start, s.end).trim())
  const tokens: Token[] = []
  let si = 0
  for (const m of text.matchAll(WORD_RE)) {
    const start = m.index!
    while (si < spans.length - 1 && start >= spans[si].end) si++
    const word = mainWord(m[0])
    if (!word) continue
    tokens.push({ text: m[0], start, end: start + m[0].length, sentence: si, bases: baseForms(word) })
  }
  return { tokens, sentences, spans }
}

const isCapitalised = (s: string) => /^[A-Z]/.test(s)

/** Best guess at the dictionary form of a word the wiki doesn't know: drop a plural -s. */
const CODE_LIKE = /[a-z][A-Z]|_/

function guessBase(w: string) {
  return w.length > 3 && w.endsWith('s') && !/(ss|us|is)$/.test(w) ? (w.endsWith('ies') ? w.slice(0, -3) + 'y' : w.slice(0, -1)) : w
}

export function analyze(text: string, dict: Dict): Analysis {
  const { tokens, sentences, spans } = tokenize(text)
  const entries = new Map<string, Entry>()

  function record(key: string, kind: EntryKind, head: string, items: Item[], idx: number[]) {
    const form = idx.map((i) => tokens[i].text).join(' ')
    const e = entries.get(key)
    if (e) {
      e.count++
      e.tokens.push(...idx)
      if (!e.forms.includes(form)) e.forms.push(form)
    } else {
      entries.set(key, { key, kind, head, items, forms: [form], count: 1, sentence: tokens[idx[0]].sentence, tokens: [...idx] })
    }
    for (const i of idx) tokens[i].entry = key
  }

  const matches = (t: Token | undefined, part: string, sentence: number) =>
    !!t && !t.entry && t.sentence === sentence && t.bases.includes(part)

  // 1. Phrases, longest first, left to right.
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    if (t.entry) continue
    const candidates = t.bases.flatMap((b) => dict.phrases.get(b) ?? [])
    for (const p of candidates) {
      if (!p.parts[0] || !t.bases.includes(p.parts[0])) continue
      let idx: number[] | null = [i]
      let at = i
      for (let k = 1; k < p.parts.length; k++) {
        at++
        // Allow one possessive in between: "do my homework" matches "do homework".
        if (!matches(tokens[at], p.parts[k], t.sentence) && POSSESSIVES.has(tokens[at]?.bases[0] ?? '')) at++
        if (matches(tokens[at], p.parts[k], t.sentence)) idx.push(at)
        else {
          idx = null
          break
        }
      }
      if (!idx && p.parts.length === 2 && PARTICLES.has(p.parts[1])) {
        for (let g = 2; g <= MAX_GAP + 1; g++) {
          const u = tokens[i + g]
          if (!u || u.sentence !== t.sentence) break
          if (matches(u, p.parts[1], t.sentence) && u.bases[0] === p.parts[1]) {
            idx = [i, i + g]
            break
          }
        }
      }
      if (idx) {
        record(`p:${p.parts.join(' ')}`, 'phrase', p.parts.join(' '), p.items, idx)
        break
      }
    }
  }

  // 2. Single words. A capitalised word the dictionary doesn't know is treated as a name,
  // unless the same word also appears in lowercase somewhere in the text.
  const lowercaseSeen = new Set(tokens.filter((t) => !isCapitalised(t.text)).map((t) => t.bases[0]))
  const findBase = (bases: string[]) => bases.find((b) => dict.words.has(b))
  function recordWord(bases: string[], i: number) {
    const base = findBase(bases)
    if (base) record(`w:${base}`, 'word', base, dict.words.get(base)!, [i])
    else {
      const guess = guessBase(bases[0])
      record(`u:${guess}`, 'unknown', guess, [], [i])
    }
  }
  tokens.forEach((t, i) => {
    if (t.entry || (t.bases[0].length < 2 && t.bases[0] !== 'a' && t.bases[0] !== 'i')) return
    // Code identifiers (setState, userRepositoryProvider) are not vocabulary.
    if (CODE_LIKE.test(t.text)) return
    if (findBase(t.bases)) recordWord(t.bases, i)
    else if (isCapitalised(t.text) && !lowercaseSeen.has(t.bases[0])) record(`n:${t.text}`, 'name', t.text, [], [i])
    // Hyphenated words the dictionary doesn't know as a whole: look at each part (not-so-sneaky).
    else if (t.text.includes('-')) for (const part of t.text.split('-')) part.length > 1 && recordWord(baseForms(part), i)
    else recordWord(t.bases, i)
  })

  return { tokens, sentences, spans, entries: [...entries.values()].sort((a, b) => a.tokens[0] - b.tokens[0]) }
}
