<script setup lang="ts">
import { useLocale } from './i18n'
import { computed, onMounted, ref } from 'vue'
import { coreTopics, extraTopics, learnedKey, topicLink, vocabTopics } from '../../vocabTopics'
import SpeakButton from './SpeakButton.vue'
import { fold, loadTopic, useLearned, useToday, type Word } from './useVocab'

const data = ref<Record<string, Word[]>>({})
const query = ref('')
const { learned } = useLearned()
const today = useToday()

onMounted(async () => {
  const entries = await Promise.all(vocabTopics.map(async (t) => [t.slug, await loadTopic(t.slug)] as const))
  data.value = Object.fromEntries(entries)
})

const count = (slug: string) => data.value[slug]?.length ?? 0
const done = (slug: string) => (data.value[slug] ?? []).filter((w) => learned.value.has(learnedKey(slug, w.w))).length
const pct = (slug: string) => (count(slug) ? (done(slug) / count(slug)) * 100 : 0)
// The overall bar counts the 3000 core words only; specialist topics show their own count.
const total = computed(() => coreTopics.reduce((n, t) => n + count(t.slug), 0))
const totalDone = computed(() => coreTopics.reduce((n, t) => n + done(t.slug), 0))

const results = computed(() => {
  const q = fold(query.value.trim())
  if (q.length < 2) return []
  const out: { w: Word; slug: string; title: string }[] = []
  for (const t of vocabTopics) {
    for (const w of data.value[t.slug] ?? []) {
      if (fold(w.w).includes(q) || fold(w.vi).includes(q)) out.push({ w, slug: t.slug, title: t.title })
    }
  }
  // Exact and prefix matches on the English word first.
  const rank = (w: Word) => (fold(w.w) === q ? 0 : fold(w.w).startsWith(q) ? 1 : 2)
  return out.sort((a, b) => rank(a.w) - rank(b.w)).slice(0, 40)
})
const { tr, link, pos, topicTitle, isEn } = useLocale()
</script>

<template>
  <div class="vocab vhome">
    <!-- Looking a word up comes first; today's list, the quiz and the article tool live in the
         sidebar and, on phones, the bottom tab bar. -->
    <div class="vsearch-wrap">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>
      <input id="vocab-search" v-model="query" class="vsearch" type="search" :placeholder="tr('Tra từ tiếng Anh hoặc nghĩa tiếng Việt (vd: family, gia dinh)')" :aria-label="tr('Tra từ')" />
    </div>

    <ol v-if="results.length" class="vresults">
      <li v-for="r in results" :key="r.slug + r.w.w">
        <span class="vword">{{ r.w.w }}</span>
        <SpeakButton :text="r.w.w" />
        <span class="vipa">{{ r.w.ipa }}</span>
        <span class="vpos">{{ pos[r.w.pos] }}</span>
        <span class="vres-vi">{{ r.w.vi }}</span>
        <a :href="link(topicLink(r.slug))" class="vres-topic">{{ topicTitle(r.slug) }}</a>
      </li>
    </ol>
    <p v-else-if="query.trim().length >= 2 && total" class="vempty">{{ tr('Không tìm thấy từ nào khớp "{q}".', { q: query }) }}</p>

    <div class="vhome-progress">
      <span class="vhome-num"><b>{{ totalDone }}</b> / {{ total || '…' }}</span>
      <span class="vhome-label">{{ tr('từ thông dụng đã thuộc') }}</span>
      <div class="vprog-bar"><i :style="{ width: total ? (totalDone / total) * 100 + '%' : '0' }" /></div>
    </div>

    <h2>{{ tr('3000 từ thông dụng') }}</h2>
    <div class="vtopics">
      <a v-for="(t, i) in coreTopics" :key="t.slug" class="vtopic-card" :href="link(topicLink(t.slug))">
        <span class="vtopic-no">{{ i + 1 }}</span>
        <span class="vtopic-title">{{ isEn ? t.en : t.title }}</span>
        <small>{{ isEn ? t.title : t.en }}</small>
        <span class="vtopic-prog">
          <span class="vprog-bar"><i :style="{ width: pct(t.slug) + '%' }" /></span>
          <span>{{ done(t.slug) }}/{{ count(t.slug) || t.target }}</span>
        </span>
      </a>
    </div>

    <h2>{{ tr('Mở rộng') }}</h2>
    <div class="vtopics">
      <a v-for="t in extraTopics" :key="t.slug" class="vtopic-card" :href="link(topicLink(t.slug))">
        <span class="vtopic-no">{{ t.track === 'it' ? 'IT' : tr('Cụm') }}</span>
        <span class="vtopic-title">{{ isEn ? t.en : t.title }}</span>
        <small>{{ isEn ? t.title : t.en }}</small>
        <span class="vtopic-prog">
          <span class="vprog-bar"><i :style="{ width: pct(t.slug) + '%' }" /></span>
          <span>{{ done(t.slug) }}/{{ count(t.slug) || t.target }}</span>
        </span>
      </a>
    </div>
  </div>
</template>
