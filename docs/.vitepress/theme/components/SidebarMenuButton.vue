<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSidebar } from 'vitepress/theme'
import { useLocale } from './i18n'

// One button, just before the logo, for the sidebar on every screen size:
// - from 960px it hides or shows the sidebar column (remembered across visits);
// - below that it opens the sidebar drawer. The default theme keeps the drawer's open state
//   inside its layout, reachable only through its own "Mục lục" bar, so that bar is hidden
//   and this button presses its menu button.
const KEY = 'sidebar-collapsed'
const CLASS = 'sidebar-collapsed'

const { hasSidebar } = useSidebar()
const { tr } = useLocale()
const collapsed = ref(false)
onMounted(() => (collapsed.value = document.documentElement.classList.contains(CLASS)))

function onClick() {
  if (!matchMedia('(min-width: 960px)').matches) {
    document.querySelector<HTMLButtonElement>('.VPLocalNav .menu')?.click()
    return
  }
  collapsed.value = !collapsed.value
  document.documentElement.classList.toggle(CLASS, collapsed.value)
  try {
    localStorage.setItem(KEY, collapsed.value ? '1' : '0')
  } catch {
    // Private mode or blocked storage: the toggle still works for this visit.
  }
}
</script>

<template>
  <!-- Teleported into the bar's title block, beside (not inside) the logo link; the block only
       exists in the browser-rendered layout, hence ClientOnly. -->
  <ClientOnly>
    <Teleport to=".VPNavBarTitle">
      <button
        v-if="hasSidebar"
        type="button"
        class="sb-menu-btn"
        :aria-expanded="!collapsed"
        :aria-label="tr(collapsed ? 'Hiện mục lục' : 'Mục lục')"
        :title="tr(collapsed ? 'Hiện mục lục' : 'Mục lục')"
        @click="onClick"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
          <path d="M9.5 4.5v15" />
        </svg>
      </button>
    </Teleport>
  </ClientOnly>
</template>
