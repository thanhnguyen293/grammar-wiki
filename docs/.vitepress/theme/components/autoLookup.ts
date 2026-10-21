// Suggestions for words that are not in the wiki's dictionary, from free public services:
// dictionaryapi.dev (IPA, part of speech, definition), Wiktionary as a fallback for the
// definition, and MyMemory for a Vietnamese translation. Everything here is a suggestion the
// learner checks before saving; any service may be down or out of quota.
import type { Pos } from './useVocab'

export interface Suggestion {
  ipa?: string
  pos?: Pos
  definition?: string
}

const POS_MAP: Record<string, Pos> = {
  noun: 'n',
  verb: 'v',
  adjective: 'adj',
  adverb: 'adv',
  pronoun: 'pron',
  preposition: 'prep',
  conjunction: 'conj',
  interjection: 'int',
  determiner: 'det',
  article: 'det',
  numeral: 'num',
  phrase: 'phr',
}

async function getJson(url: string): Promise<any | undefined> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 7000)
  try {
    const res = await fetch(url, { signal: ctrl.signal })
    return res.ok ? await res.json() : undefined
  } catch {
    return undefined
  } finally {
    clearTimeout(timer)
  }
}

const stripHtml = (s: string) =>
  s
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()

export async function lookupEnglish(word: string): Promise<Suggestion | undefined> {
  const w = encodeURIComponent(word.trim().toLowerCase())
  const [entries, wiki, wikiIpa] = await Promise.all([
    getJson(`https://api.dictionaryapi.dev/api/v2/entries/en/${w}`),
    getJson(`https://en.wiktionary.org/api/rest_v1/page/definition/${w}`),
    wiktionaryIpa(w),
  ])
  // Wiktionary lists parts of speech in a sensible order (deploy: verb first) and has American
  // IPA; dictionaryapi.dev has cleaner definitions but mostly British IPA and a random order.
  const sense = wiki?.en?.[0]
  const api = Array.isArray(entries) ? entries[0] : undefined
  const pos: Pos | undefined =
    POS_MAP[sense?.partOfSpeech?.toLowerCase()] ?? POS_MAP[api?.meanings?.[0]?.partOfSpeech?.toLowerCase()]
  const apiIpa: string | undefined = api?.phonetic ?? api?.phonetics?.find((p: any) => p.text)?.text
  const ipa = wikiIpa ?? (apiIpa ? `/${apiIpa.replace(/^\/|\/$/g, '').replace(/ɹ/g, 'r')}/` : undefined)

  const apiMeaning =
    api?.meanings?.find((m: any) => POS_MAP[m.partOfSpeech?.toLowerCase()] === pos) ?? api?.meanings?.[0]
  // Wiktionary often lists a rare sense first ("capable of being climbed"), so offer up to two.
  const wikiDefs: string[] = (sense?.definitions ?? []).map((d: any) => stripHtml(d.definition ?? '')).filter(Boolean)
  const definition: string | undefined = apiMeaning?.definitions?.[0]?.definition ?? (wikiDefs.slice(0, 2).join(' / ') || undefined)

  return ipa || pos || definition ? { ipa, pos, definition } : undefined
}

/** American IPA from the word's Wiktionary page (the English section comes first). */
async function wiktionaryIpa(w: string): Promise<string | undefined> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 7000)
  try {
    const res = await fetch(`https://en.wiktionary.org/api/rest_v1/page/html/${w}`, { signal: ctrl.signal })
    if (!res.ok) return undefined
    const html = await res.text()
    const found = [...html.matchAll(/class="IPA[^"]*"[^>]*>(\/[^<]+\/)</g)].map((m) => ({ ipa: m[1], at: m.index! }))
    if (!found.length) return undefined
    // Each IPA follows an accent label; pick one whose nearest preceding label is American.
    const nearestLabel = (at: number) => {
      const before = html.slice(Math.max(0, at - 4000), at)
      const us = Math.max(before.lastIndexOf('General American'), before.lastIndexOf('>US<'))
      const uk = Math.max(before.lastIndexOf('Received Pronunciation'), before.lastIndexOf('>UK<'))
      return us > uk ? 'us' : uk > us ? 'uk' : ''
    }
    const us = found.find((f) => nearestLabel(f.at) === 'us')
    // Match the wiki's own transcription style, which writes /r/ rather than /ɹ/.
    return (us ?? found[0]).ipa.replace(/ɹ/g, 'r')
  } catch {
    return undefined
  } finally {
    clearTimeout(timer)
  }
}

/** Vietnamese translation; for a single word, up to three distinct suggestions joined by commas. */
export async function translateToVi(text: string, maxOptions = 1): Promise<string | undefined> {
  const q = encodeURIComponent(text.trim().slice(0, 450))
  const res = await getJson(`https://api.mymemory.translated.net/get?q=${q}&langpair=en%7Cvi`)
  if (!res || res.quotaFinished || res.responseStatus !== 200) return undefined
  const options: string[] = [res.responseData?.translatedText, ...(res.matches ?? []).map((m: any) => m.translation)]
    .filter((t): t is string => typeof t === 'string' && !!t.trim() && !/[A-Z]{4,}/.test(t))
    .map((t) => t.trim())
    // Translation memories sometimes echo the English word back; that is not a meaning.
    .filter((t) => t.toLowerCase() !== text.trim().toLowerCase())
  const seen = new Set<string>()
  const unique = options.filter((t) => {
    const k = t.toLowerCase()
    return !seen.has(k) && !!seen.add(k)
  })
  if (!unique.length) return undefined
  return maxOptions === 1 ? unique[0] : unique.slice(0, maxOptions).map((t) => t.toLowerCase()).join(', ')
}
