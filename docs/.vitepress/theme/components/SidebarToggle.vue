<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSidebar } from 'vitepress/theme'
import { useLocale } from './i18n'

// The class lives on <html> so it survives page changes; config.mts sets it before the
// first paint from the same storage key, so a hidden sidebar does not flash in on load.
const KEY = 'sidebar-collapsed'
const CLASS = 'sidebar-collapsed'

const { hasSidebar } = useSidebar()
const { tr } = useLocale()
const collapsed = ref(false)

onMounted(() => {
  collapsed.value = document.documentElement.classList.contains(CLASS)
})

function toggle() {
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
  <button
    v-if="hasSidebar"
    type="button"
    class="sidebar-toggle"
    :aria-expanded="!collapsed"
    :aria-label="tr(collapsed ? 'Hiện mục lục' : 'Ẩn mục lục')"
    :title="tr(collapsed ? 'Hiện mục lục' : 'Ẩn mục lục')"
    @click="toggle"
  >
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <path d="M9.5 4.5v15" />
      <path v-if="collapsed" d="m13 10 2 2-2 2" />
      <path v-else d="m15 10-2 2 2 2" />
    </svg>
  </button>
</template>
