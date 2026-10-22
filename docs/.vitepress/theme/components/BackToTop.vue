<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useLocale } from './i18n'

const { tr } = useLocale()
const shown = ref(false)
const onScroll = () => (shown.value = window.scrollY > 600)
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
const top = () =>
  window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
</script>

<template>
  <Transition name="btt">
    <button v-if="shown" type="button" class="back-to-top" :aria-label="tr('Lên đầu trang')" :title="tr('Lên đầu trang')" @click="top">
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </Transition>
</template>
