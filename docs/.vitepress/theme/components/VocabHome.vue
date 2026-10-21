<script setup lang="ts">
import { useLocale } from './i18n'
import { computed, onMounted, ref } from 'vue'
import { coreTopics, extraTopics, learnedKey, vocabTopics } from '../../vocabTopics'
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
  <div class="vocab">
    <div class="vprog">
      <span>{{ tr('Đã thuộc {a} / {b} từ thông dụng', { a: totalDone, b: total || '…' }) }}</span>
      <div class="vprog-bar"><i :style="{ width: total ? (totalDone / total) * 100 + '%' : '0' }" /></div>
    </div>

    <a class="vtoday-link" :href="link('/tu-vung/hom-nay')">
      <span><b>{{ tr('Hôm nay học') }}</b> · {{ tr('{n} từ đã chọn', { n: today.refs.value.length }) }}</span>
      <span>{{ tr('Mở danh sách →') }}</span>
    </a>
    <a class="vtoday-link" :href="link('/tu-vung/on-tap')">
      <span><b>{{ tr('Kiểm tra từ đã học') }}</b> · {{ tr('nhìn nghĩa tiếng Việt, gõ từ tiếng Anh') }}</span>
      <span>{{ tr('Bắt đầu →') }}</span>
    </a>
    <a class="vtoday-link" :href="link('/tu-vung/phan-tich')">
      <span><b>{{ tr('Học từ bài viết') }}</b> · {{ tr('dán một bài tiếng Anh, lọc ra từ và cụm từ để học') }}</span>
      <span>{{ tr('Mở →') }}</span>
    </a>

    <input id="vocab-search" v-model="query" class="vsearch" type="search" :placeholder="tr('Tra từ tiếng Anh hoặc nghĩa tiếng Việt (vd: family, gia dinh)')" :aria-label="tr('Tra từ')" />

    <ol v-if="results.length" class="vresults">
      <li v-for="r in results" :key="r.slug + r.w.w">
        <span class="vword">{{ r.w.w }}</span>
        <SpeakButton :text="r.w.w" />
        <span class="vipa">{{ r.w.ipa }}</span>
        <span class="vpos">{{ pos[r.w.pos] }}</span>
        <span class="vres-vi">{{ r.w.vi }}</span>
        <a :href="link(`/tu-vung/${r.slug}`)" class="vres-topic">{{ topicTitle(r.slug) }}</a>
      </li>
    </ol>
    <p v-else-if="query.trim().length >= 2 && total" class="vempty">{{ tr('Không tìm thấy từ nào khớp "{q}".', { q: query }) }}</p>

    <h2>{{ tr('3000 từ thông dụng') }}</h2>
    <div class="row-list">
      <a v-for="(t, i) in coreTopics" :key="t.slug" class="row vtopic" :href="link(`/tu-vung/${t.slug}`)">
        <span class="row-no">{{ i + 1 }}</span>
        <span class="row-title">{{ isEn ? t.en : t.title }}<small>{{ isEn ? t.title : t.en }}</small></span>
        <span class="row-ch">{{ done(t.slug) }}/{{ count(t.slug) || t.target }}</span>
      </a>
    </div>

    <h2>{{ tr('Mở rộng') }}</h2>
    <div class="row-list">
      <a v-for="t in extraTopics" :key="t.slug" class="row vtopic" :href="link(`/tu-vung/${t.slug}`)">
        <span class="row-no">{{ t.track === 'it' ? 'IT' : tr('Cụm') }}</span>
        <span class="row-title">{{ isEn ? t.en : t.title }}<small>{{ isEn ? t.title : t.en }}</small></span>
        <span class="row-ch">{{ done(t.slug) }}/{{ count(t.slug) || t.target }}</span>
      </a>
    </div>
  </div>
</template>
