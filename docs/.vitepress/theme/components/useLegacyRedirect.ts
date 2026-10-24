import { onMounted } from 'vue'
import { useData, withBase } from 'vitepress'
import { legacyPaths } from '../../legacyPaths'

/** Sends links and bookmarks from before the move to English URLs to their new page. An old
    path lands on the "not found" page (GitHub Pages serves it for any unknown path), which then
    replaces itself with the new address, keeping the #section. */
export function useLegacyRedirect() {
  const { page } = useData()
  onMounted(() => {
    if (!page.value.isNotFound) return
    const base = withBase('/')
    let path = decodeURI(location.pathname)
    if (!path.startsWith(base)) return
    path = '/' + path.slice(base.length).replace(/\.html$/, '')
    // English used to live under /en/; it is the root now. Everything else was Vietnamese.
    const en = path === '/en' || path.startsWith('/en/')
    const old = en ? path.slice(3) || '/' : path
    const target = legacyPaths[old] ?? legacyPaths[old + '/'] ?? (en && old === '/' ? '/' : undefined)
    if (target) location.replace(withBase((en ? '' : '/vi') + target) + location.hash)
  })
}
