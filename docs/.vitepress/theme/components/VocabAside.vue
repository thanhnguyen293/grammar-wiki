<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useData } from 'vitepress'
import { coreTopics, learnedKey, vocabTopics } from '../../vocabTopics'
import { useLocale } from './i18n'
import { loadTopic, useLearned, useToday, type Word } from './useVocab'

// Fills the right-hand column of vocabulary pages, where lessons show "On this page". It shows
// only what the sidebar does not: how far the learner is, and which words are on today's list.
// Styled like the outline so both kinds of page share one frame.
const { page } = useData()
const { tr, link } = useLocale()
const { learned } = useLearned()
const today = useToday()

const path = computed(() => page.value.relativePath.replace(/^vi\//, ''))
const isVocab = computed(() => path.value.startsWith('vocabulary/'))
const file = computed(() => path.value.replace(/^vocabulary\//, '').replace(/\.md$/, ''))
const topic = computed(() => vocabTopics.find((t) => t.path === file.value))

const words = ref<Word[]>([])
watch(
  topic,
  async (t) => {
    words.value = t ? await loadTopic(t.slug) : []
  },
  { immediate: true },
)

// Core words are stored under the bare word (learnedKey), so the overall count needs no topic
// files.
const CORE_TOTAL = coreTopics.reduce((n, t) => n + t.target, 0)
const coreDone = computed(() => [...learned.value].filter((k) => !k.includes(':')).length)
const topicDone = computed(() => {
  const t = topic.value
  return t ? words.value.filter((w) => learned.value.has(learnedKey(t.slug, w.w))).length : 0
})
const progress = computed(() =>
  topic.value
    ? { done: topicDone.value, total: words.value.length || topic.value.target, label: tr('từ đã thuộc') }
    : { done: coreDone.value, total: CORE_TOTAL, label: tr('từ thông dụng đã thuộc') },
)
const pct = computed(() => (progress.value.total ? Math.min(100, (progress.value.done / progress.value.total) * 100) : 0))

// Today's words straight from their stored "slug|word" refs; the today page lists them itself.
const SHOWN = 12
const todayWords = computed(() =>
  today.refs.value.map((r) => {
    const [slug, w] = r.split('|')
    return { w, done: learned.value.has(learnedKey(slug, w)) }
  }),
)
</script>

<template>
  <div v-if="isVocab" class="vaside">
    <section class="vaside-block">
      <h2 class="vaside-title">{{ tr('Tiến độ') }}</h2>
      <p class="vaside-num">
        <b>{{ progress.done }}</b> / {{ progress.total }} <span>{{ progress.label }}</span>
      </p>
      <span class="vprog-bar"><i :style="{ width: pct + '%' }" /></span>
      <p v-if="topic && !topic.track" class="vaside-sub">
        {{ tr('Tổng: {a}/{b} từ thông dụng', { a: coreDone, b: CORE_TOTAL }) }}
      </p>
    </section>

    <section v-if="file !== 'today'" class="vaside-block">
      <h2 class="vaside-title">{{ tr('Hôm nay học') }} · {{ todayWords.length }}</h2>
      <p v-if="!todayWords.length" class="vaside-sub">{{ tr('Chưa có từ nào. Bấm + Hôm nay cạnh một từ để thêm.') }}</p>
      <template v-else>
        <ul class="vaside-words">
          <li v-for="x in todayWords.slice(0, SHOWN)" :key="x.w" :class="{ done: x.done }">{{ x.w }}</li>
          <li v-if="todayWords.length > SHOWN" class="more">+{{ todayWords.length - SHOWN }}</li>
        </ul>
        <a class="vaside-go" :href="link('/vocabulary/today')">{{ tr('Học danh sách hôm nay →') }}</a>
      </template>
    </section>
  </div>
</template>
