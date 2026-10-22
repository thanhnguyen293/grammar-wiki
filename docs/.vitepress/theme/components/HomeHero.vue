<script setup lang="ts">
import { chapters } from '../../chapters'
import { coreTopics, extraTopics } from '../../vocabTopics'
import { useLocale } from './i18n'

const { tr, link } = useLocale()

// Counted from the data so the numbers stay right when lessons or topics are added.
const lessons = chapters.reduce((n, c) => n + c.sections.length, 0)
const words = coreTopics.reduce((n, t) => n + t.target, 0)
const phrases = extraTopics.filter((t) => t.track === 'phrase').reduce((n, t) => n + t.target, 0)
const stats = [
  { n: chapters.length, label: 'chương' },
  { n: lessons, label: 'bài ngữ pháp' },
  { n: words, label: 'từ thông dụng' },
  { n: phrases, label: 'cụm từ' },
]
</script>

<template>
  <div class="home-hero">
    <div class="home-cta">
      <a class="btn primary" :href="link('/lo-trinh')">{{ tr('Xem lộ trình học') }}</a>
      <a class="btn" :href="link('/tu-vung/')">{{ tr('Học từ vựng') }}</a>
    </div>
    <ul class="home-stats">
      <li v-for="s in stats" :key="s.label">
        <b>{{ s.n.toLocaleString('en-US') }}</b>
        <span>{{ tr(s.label) }}</span>
      </li>
    </ul>
  </div>
</template>
