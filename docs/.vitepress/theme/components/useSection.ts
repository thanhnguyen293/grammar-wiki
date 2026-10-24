import { computed } from 'vue'
import { useData } from 'vitepress'
import { chapters } from '../../chapters'

/** Finds the chapter and section of the current page from its file path, e.g.
    `tenses/present-simple.md` or its Vietnamese twin `vi/tenses/present-simple.md`. */
export function useSection() {
  const { page } = useData()
  return computed(() => {
    const [dir, file] = page.value.relativePath.replace(/^vi\//, '').split('/')
    const chapter = chapters.find((c) => c.dir === dir)
    const slug = file?.replace(/\.md$/, '')
    const section = chapter?.sections.find((s) => s.slug === slug)
    return { chapter, section }
  })
}
