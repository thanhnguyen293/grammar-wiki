<script setup lang="ts">
import { useLocale } from './i18n'
import { backDepth, standalone } from './useAppMode'

// Opened from the home screen, the site has no browser bar, so the top bar offers its own back
// button whenever there is an earlier page in this app session.
const { tr } = useLocale()
const goBack = () => history.back()
</script>

<template>
  <ClientOnly>
    <Teleport to=".VPNavBarTitle">
      <button
        v-if="standalone && backDepth > 0"
        type="button"
        class="app-back-btn"
        :aria-label="tr('Quay lại')"
        :title="tr('Quay lại')"
        @click="goBack"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </Teleport>
  </ClientOnly>
</template>
