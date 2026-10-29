<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { useLocale } from './i18n'
import { useToday } from './useVocab'

// Phones and tablets: the main sections stay one tap away at the bottom edge, which also gives
// the home-screen app a way around without browser controls.
type Tab = 'grammar' | 'vocab' | 'today' | 'review' | 'workplace' | 'progress'

const { page } = useData()
const { tr, link } = useLocale()
const today = useToday()

const active = computed<Tab>(() => {
  const p = page.value.relativePath.replace(/^vi\//, '')
  if (p === 'vocabulary/today.md') return 'today'
  if (p === 'vocabulary/review.md') return 'review'
  if (p.startsWith('vocabulary/')) return 'vocab'
  if (p.startsWith('workplace/')) return 'workplace'
  if (p === 'progress.md') return 'progress'
  return 'grammar'
})

const TABS: { id: Tab; label: string; path: string; icon: string }[] = [
  { id: 'grammar', label: 'Ngữ pháp', path: '/study-path', icon: 'M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z' },
  { id: 'vocab', label: 'Từ vựng', path: '/vocabulary/', icon: 'M3 18 8 6l5 12M5 14h6M15 18v-5a3 3 0 0 1 6 0v5M15 15h6' },
  {
    id: 'today',
    label: 'Hôm nay',
    path: '/vocabulary/today',
    icon: 'M8 2v4M16 2v4M3 9h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM9 15l2 2 4-4',
  },
  { id: 'review', label: 'Ôn tập', path: '/vocabulary/review', icon: 'M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' },
  {
    id: 'workplace',
    label: 'Giao tiếp',
    path: '/workplace/',
    icon: 'M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12zM8.5 12h.01M12 12h.01M15.5 12h.01',
  },
  { id: 'progress', label: 'Tiến độ', path: '/progress', icon: 'M4 20V10M10 20V4M16 20v-8M22 20H2' },
]
</script>

<template>
  <nav class="tabbar" :aria-label="tr('Mục chính')">
    <a
      v-for="t in TABS"
      :key="t.id"
      :href="link(t.path)"
      class="tab"
      :class="{ active: active === t.id }"
      :aria-current="active === t.id ? 'page' : undefined"
    >
      <span class="tab-icon">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path :d="t.icon" /></svg>
        <i v-if="t.id === 'today' && today.refs.value.length" class="tab-badge">{{ today.refs.value.length }}</i>
      </span>
      <span class="tab-label">{{ tr(t.label) }}</span>
    </a>
  </nav>
</template>
