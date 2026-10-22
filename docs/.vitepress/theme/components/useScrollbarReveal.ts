import { onMounted, onBeforeUnmount } from 'vue'

const HIDE_AFTER = 900

/** Marks a scrolled container with `is-scrolling` while it moves, so CSS can show its
    scrollbar only then. One capturing listener covers every container, including the
    sidebar that VitePress re-renders on navigation. */
export function useScrollbarReveal() {
  const timers = new WeakMap<Element, number>()

  function onScroll(e: Event) {
    const el = e.target
    if (!(el instanceof Element)) return
    el.classList.add('is-scrolling')
    window.clearTimeout(timers.get(el))
    timers.set(el, window.setTimeout(() => el.classList.remove('is-scrolling'), HIDE_AFTER))
  }

  onMounted(() => document.addEventListener('scroll', onScroll, { capture: true, passive: true }))
  onBeforeUnmount(() => document.removeEventListener('scroll', onScroll, { capture: true }))
}
