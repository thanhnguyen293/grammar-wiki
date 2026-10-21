import { computed } from 'vue'
import { useData } from 'vitepress'
import { chapters } from '../../chapters'

/** Finds the chapter and section of the current page from its file path, e.g. `2-thi/hien-tai-don.md`. */
export function useSection() {
  const { page } = useData()
  return computed(() => {
    const [dir, file] = page.value.relativePath.split('/')
    const chapter = chapters.find((c) => c.dir === dir)
    const slug = file?.replace(/\.md$/, '')
    const section = chapter?.sections.find((s) => s.slug === slug)
    return { chapter, section }
  })
}
