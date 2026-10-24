import { ref, watch } from 'vue'
import { useRoute } from 'vitepress'

/** True when the site runs as an app opened from the home screen (no browser bar, no back button). */
export const standalone = ref(false)
/** How many in-app pages the learner can go back through in this app session. */
export const backDepth = ref(0)

const DEPTH_KEY = 'stnp.backDepth'
let started = false

/** Call once on the client. Counts in-app page changes so the back button only shows when there
    is somewhere to go back to: a new page adds one, a browser "back" (popstate) takes one away. */
export function initAppMode() {
  if (started || typeof window === 'undefined') return
  started = true
  standalone.value =
    matchMedia('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true
  document.documentElement.classList.toggle('app-standalone', standalone.value)
  try {
    backDepth.value = Number(sessionStorage.getItem(DEPTH_KEY)) || 0
  } catch {
    // Starts at zero.
  }
  let popped = false
  window.addEventListener('popstate', () => (popped = true))
  const route = useRoute()
  watch(
    () => route.path,
    () => {
      backDepth.value = popped ? Math.max(0, backDepth.value - 1) : backDepth.value + 1
      popped = false
      try {
        sessionStorage.setItem(DEPTH_KEY, String(backDepth.value))
      } catch {
        // Kept in memory only.
      }
    },
  )
}
