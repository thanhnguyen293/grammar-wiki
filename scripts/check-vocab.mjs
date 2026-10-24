// Validates docs/data/vocab/*.json against docs/.vitepress/vocabTopics.ts:
// schema, allowed values, word counts, and that no word appears in two topics.
// Also checks docs/data/relations.json: every word is a core word, and no group repeats.
// Usage: node scripts/check-vocab.mjs [slug ...]   (no slugs = check every topic)
import { readFileSync, existsSync } from 'node:fs'

const root = new URL('../docs/', import.meta.url)
const topicsSrc = readFileSync(new URL('.vitepress/vocabTopics.ts', root), 'utf8')
const topics = [...topicsSrc.matchAll(/slug: '([^']+)'.*?target: (\d+)(, track: '(\w+)')?/g)].map((m) => ({
  slug: m[1],
  target: +m[2],
  track: m[4],
}))
const only = process.argv.slice(2)

const POS = new Set(['n', 'v', 'adj', 'adv', 'pron', 'prep', 'conj', 'det', 'num', 'modal', 'int', 'phr'])
const LV = new Set(['A1', 'A2', 'B1', 'B2'])
const FIELDS = ['w', 'ipa', 'pos', 'vi', 'ex', 'exVi', 'lv']

// The agreed word list per topic, in order; data files must follow it word for word.
const planFile = new URL('../scripts/vocab-plan.json', import.meta.url)
const plan = existsSync(planFile) ? JSON.parse(readFileSync(planFile, 'utf8')) : {}

const errors = []
const seen = new Map()
let total = 0

for (const { slug, target, track } of topics) {
  const file = new URL(`data/vocab/${slug}.json`, root)
  if (!existsSync(file)) {
    if (!only.length || only.includes(slug)) errors.push(`${slug}: missing data file`)
    continue
  }
  let words
  try {
    words = JSON.parse(readFileSync(file, 'utf8'))
  } catch (e) {
    errors.push(`${slug}: invalid JSON (${e.message})`)
    continue
  }
  const check = !only.length || only.includes(slug)
  if (check && words.length !== target) errors.push(`${slug}: ${words.length} words, expected ${target}`)
  if (check && plan[slug]) {
    const i = plan[slug].findIndex((w, k) => words[k]?.w !== w)
    if (i !== -1) errors.push(`${slug}[${i}]: expected "${plan[slug][i]}" from vocab-plan.json, found "${words[i]?.w}"`)
  }
  words.forEach((x, i) => {
    const at = `${slug}[${i}] "${x?.w}"`
    // Specialist topics may reuse a core word with its specialist meaning, so they are
    // checked for duplicates only within their own track. Case matters: "May" (month) and "may" (modal) are different words.
    const key = `${track ?? 'core'}:${String(x?.w ?? '').trim()}`
    if (seen.has(key)) errors.push(`${at}: also in ${seen.get(key)}`)
    seen.set(key, slug)
    if (!check) return
    for (const f of FIELDS) if (typeof x[f] !== 'string' || !x[f].trim()) errors.push(`${at}: missing ${f}`)
    const extra = Object.keys(x).filter((k) => !FIELDS.includes(k))
    if (extra.length) errors.push(`${at}: unknown fields ${extra.join(', ')}`)
    if (x.pos && !POS.has(x.pos)) errors.push(`${at}: bad pos "${x.pos}"`)
    if (x.lv && !LV.has(x.lv)) errors.push(`${at}: bad lv "${x.lv}"`)
    if (x.ipa && !/^\/.+\/$/.test(x.ipa)) errors.push(`${at}: ipa must be wrapped in slashes`)
    if (x.ex && !/[.?!]$/.test(x.ex.trim())) errors.push(`${at}: example should end with . ? or !`)
  })
  if (!track) total += words.length
}

// Related words (scripts/suggest-relations.mjs). Only core words: specialist topics reuse
// core words with another meaning, so a headword there would be ambiguous.
const relFile = new URL('data/relations.json', root)
if (existsSync(relFile)) {
  let rel = {}
  try {
    rel = JSON.parse(readFileSync(relFile, 'utf8'))
  } catch (e) {
    errors.push(`relations.json: invalid JSON (${e.message})`)
  }
  const KINDS = ['family', 'synonym', 'antonym']
  for (const k of Object.keys(rel)) if (!KINDS.includes(k)) errors.push(`relations.json: unknown group kind "${k}"`)
  for (const kind of KINDS) {
    const sets = []
    const family = new Map()
    ;(rel[kind] ?? []).forEach((g, i) => {
      const at = `relations.json ${kind}[${i}]`
      if (!Array.isArray(g) || g.length < 2) return errors.push(`${at}: needs at least two words`)
      if (new Set(g).size !== g.length) errors.push(`${at}: repeats a word`)
      for (const w of g) if (!seen.has(`core:${w}`)) errors.push(`${at}: "${w}" is not a core word`)
      const set = new Set(g)
      // A group inside another group of the same kind says nothing new.
      const j = sets.findIndex((s) => [...set].every((w) => s.has(w)) || [...s].every((w) => set.has(w)))
      if (j !== -1) errors.push(`${at}: duplicates ${kind}[${j}]`)
      sets.push(set)
      // Families are disjoint: a word belongs to one family.
      if (kind === 'family')
        for (const w of g) {
          if (family.has(w)) errors.push(`${at}: "${w}" is also in family[${family.get(w)}]`)
          family.set(w, i)
        }
    })
  }
}

console.log(`${total} core words in ${topics.filter((t) => !t.track).length} topics`)
if (errors.length) {
  console.error(errors.join('\n'))
  console.error(`\n${errors.length} problem(s)`)
  process.exit(1)
}
console.log('OK')
