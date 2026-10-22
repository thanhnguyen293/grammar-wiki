<script setup lang="ts">
import { useSidebar } from 'vitepress/theme'
import { useLocale } from './i18n'

// Phones only: opens the sidebar from the top bar. The default theme keeps the sidebar's open
// state inside its layout and only its own "Mục lục" bar can open it, so that bar is hidden on
// phones and this button presses its menu button.
const { hasSidebar } = useSidebar()
const { tr } = useLocale()
const open = () => document.querySelector<HTMLButtonElement>('.VPLocalNav .menu')?.click()
</script>

<template>
  <button v-if="hasSidebar" type="button" class="sb-menu-btn" :aria-label="tr('Mục lục')" :title="tr('Mục lục')" @click="open">
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M4 6h16M4 12h10M4 18h16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" />
    </svg>
  </button>
</template>
