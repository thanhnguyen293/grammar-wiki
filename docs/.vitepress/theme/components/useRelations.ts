import { shallowRef } from 'vue'
// Type-only: a static import of the data module would put the data in every page's bundle.
import type { RelationKind } from './relations.data'

export interface Related {
  w: string
  kind: RelationKind
}
interface RelationIndex {
  slug: Record<string, string>
  /** Related words of each word: families first, then synonyms, then antonyms. */
  related: Record<string, Related[]>
}

const index = shallowRef<RelationIndex>({ slug: {}, related: {} })
let started = false

/** Related words, loaded on first use: the data is its own chunk, so only word-list pages pay for it. */
export function useRelations() {
  if (!started && typeof window !== 'undefined') {
    started = true
    import('./relations.data').then(({ data }) => {
      const related: Record<string, Related[]> = {}
      for (const kind of Object.keys(data.groups) as RelationKind[])
        for (const g of data.groups[kind])
          for (const w of g) {
            const list = (related[w] ??= [])
            for (const o of g) if (o !== w && !list.some((r) => r.w === o)) list.push({ w: o, kind })
          }
      index.value = { slug: data.slug, related }
    })
  }
  return index
}
