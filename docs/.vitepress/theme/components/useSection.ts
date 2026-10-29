import { computed } from 'vue'
import { useData } from 'vitepress'
import { chapters } from '../../chapters'
import { WORKPLACE_DIR, workplaceLessons } from '../../workplace'

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

/** The workplace lesson of the current page, if it is one. */
export function useWorkplaceLesson() {
  const { page } = useData()
  return computed(() => {
    const [dir, file] = page.value.relativePath.replace(/^vi\//, '').split('/')
    if (dir !== WORKPLACE_DIR) return undefined
    return workplaceLessons.find((l) => `${l.slug}.md` === file)
  })
}
