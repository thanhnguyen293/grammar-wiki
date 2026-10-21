<script setup lang="ts">
import { useLocale } from './i18n'
import { speak } from './useVocab'

defineProps<{ text: string; label?: string }>()
const { tr } = useLocale()
</script>

<template>
  <button type="button" class="speak" :aria-label="label ?? tr('Nghe: {w}', { w: text })" :title="label ?? tr('Nghe phát âm')" @click.stop="speak(text)">
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
      <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    </svg>
  </button>
</template>
