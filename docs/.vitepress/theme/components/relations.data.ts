// Build-time copy of docs/data/relations.json plus the topic of each word in it, so a page
// can link to related words in other topics without downloading every topic file.
import { readFileSync } from 'node:fs'
import { basename } from 'node:path'
import { coreTopics } from '../../vocabTopics'

export type RelationKind = 'family' | 'synonym' | 'antonym'
export interface RelationData {
  /** Topic of every word in a group. */
  slug: Record<string, string>
  groups: Record<RelationKind, string[][]>
}

declare const data: RelationData
export { data }

export default {
  watch: ['../../../data/relations.json', '../../../data/vocab/*.json'],
  load(files: string[]): RelationData {
    const core = new Set(coreTopics.map((t) => t.slug))
    const topicOf = new Map<string, string>()
    let groups: Partial<Record<RelationKind, string[][]>> = {}
    for (const file of files) {
      const json = JSON.parse(readFileSync(file, 'utf8'))
      if (basename(file) === 'relations.json') groups = json
      else if (core.has(basename(file, '.json'))) for (const x of json as { w: string }[]) topicOf.set(x.w, basename(file, '.json'))
    }
    const out: RelationData = { slug: {}, groups: { family: [], synonym: [], antonym: [] } }
    for (const kind of ['family', 'synonym', 'antonym'] as const)
      for (const g of groups[kind] ?? []) {
        // scripts/check-vocab.mjs reports unknown words; drop them rather than break the build.
        const words = g.filter((w) => topicOf.has(w))
        if (words.length < 2) continue
        out.groups[kind].push(words)
        for (const w of words) out.slug[w] = topicOf.get(w) ?? ''
      }
    return out
  },
}
