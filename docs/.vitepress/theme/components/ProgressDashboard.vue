<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { coreTopics, extraTopics, learnedKey, topicLink, vocabTopics } from '../../vocabTopics'
import ActivityHeatmap from './ActivityHeatmap.vue'
import { useLocale } from './i18n'
import { activityScore, useActivity } from './useActivity'
import { loadTopic, resolveLearned, useLearned, type Item, type Word } from './useVocab'

const { tr, link, isEn, topicTitle } = useLocale()
const { learned, learnedAt } = useLearned()
const { days, streak, lastDays } = useActivity()

const data = ref<Record<string, Word[]>>({})
const recent = ref<Item[]>([])
const mounted = ref(false)

onMounted(async () => {
  mounted.value = true
  const entries = await Promise.all(vocabTopics.map(async (t) => [t.slug, await loadTopic(t.slug)] as const))
  data.value = Object.fromEntries(entries)
  const latest = Object.entries(learnedAt.value)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([k]) => k)
  recent.value = await resolveLearned(latest)
})

const count = (slug: string) => data.value[slug]?.length ?? 0
const done = (slug: string) => (data.value[slug] ?? []).filter((w) => learned.value.has(learnedKey(slug, w.w))).length
const pct = (slug: string) => (count(slug) ? Math.round((done(slug) / count(slug)) * 100) : 0)

const coreTotal = computed(() => coreTopics.reduce((n, t) => n + (count(t.slug) || t.target), 0))
const coreDone = computed(() => coreTopics.reduce((n, t) => n + done(t.slug), 0))
const extraDone = computed(() => extraTopics.reduce((n, t) => n + done(t.slug), 0))

const week = computed(() => (mounted.value ? lastDays(7) : { learned: 0, done: 0, ok: 0 }))
const month = computed(() => (mounted.value ? lastDays(30) : { learned: 0, done: 0, ok: 0 }))
const accuracy = computed(() => (month.value.done ? Math.round((month.value.ok / month.value.done) * 100) : null))
const activeInYear = computed(() => Object.values(days.value).filter((d) => activityScore(d) > 0).length)

const when = (key: string) => {
  const t = learnedAt.value[key]
  return t ? new Date(t).toLocaleDateString(isEn.value ? 'en-GB' : 'vi-VN', { day: 'numeric', month: 'numeric' }) : ''
}
</script>

<template>
  <div class="dash">
    <div class="dash-tiles">
      <div class="dash-tile">
        <span class="dash-label">{{ tr('Từ thông dụng đã thuộc') }}</span>
        <span class="dash-num"><b>{{ coreDone }}</b> / {{ coreTotal }}</span>
        <span class="dash-sub">{{ tr('+ {n} từ chuyên ngành & cụm từ', { n: extraDone }) }}</span>
        <span class="vprog-bar"><i :style="{ width: (coreDone / coreTotal) * 100 + '%' }" /></span>
      </div>
      <div class="dash-tile">
        <span class="dash-label">{{ tr('Chuỗi ngày học') }}</span>
        <span class="dash-num"><b>{{ streak.current }}</b> {{ tr('ngày') }}</span>
        <span class="dash-sub">{{ tr('Dài nhất: {n} ngày', { n: streak.longest }) }}</span>
      </div>
      <div class="dash-tile">
        <span class="dash-label">{{ tr('Từ thuộc trong 7 ngày') }}</span>
        <span class="dash-num"><b>{{ week.learned }}</b> {{ tr('từ') }}</span>
        <span class="dash-sub">{{ tr('{n} câu kiểm tra', { n: week.done }) }}</span>
      </div>
      <div class="dash-tile">
        <span class="dash-label">{{ tr('Kiểm tra đúng (30 ngày)') }}</span>
        <span class="dash-num"><b>{{ accuracy ?? 0 }}</b> %</span>
        <span class="dash-sub">{{ tr('{a} / {b} câu', { a: month.ok, b: month.done }) }}</span>
      </div>
    </div>

    <section class="dash-card">
      <header class="dash-head">
        <h2>{{ tr('Hoạt động hằng ngày') }}</h2>
        <span class="vnote">{{ tr('{n} ngày có học trong 12 tháng qua', { n: activeInYear }) }}</span>
      </header>
      <ActivityHeatmap v-if="mounted" :days="days" />
      <p class="vnote">{{ tr('Mỗi ô là một ngày. Ô càng đậm, ngày đó bạn càng thuộc nhiều từ và làm nhiều câu kiểm tra.') }}</p>
    </section>

    <div class="dash-cols">
      <section class="dash-card">
        <header class="dash-head">
          <h2>{{ tr('Theo chủ đề') }}</h2>
          <a :href="link('/vocabulary/')" class="vnote">{{ tr('Tất cả chủ đề →') }}</a>
        </header>
        <ol class="dash-topics">
          <li v-for="t in [...coreTopics, ...extraTopics]" :key="t.slug">
            <a :href="link(topicLink(t.slug))">{{ isEn ? t.en : t.title }}</a>
            <span class="vprog-bar"><i :style="{ width: pct(t.slug) + '%' }" /></span>
            <span class="dash-pct">{{ done(t.slug) }}/{{ count(t.slug) || t.target }}</span>
          </li>
        </ol>
      </section>

      <section class="dash-card">
        <header class="dash-head">
          <h2>{{ tr('Vừa thuộc') }}</h2>
          <a :href="link('/vocabulary/review')" class="vnote">{{ tr('Kiểm tra lại →') }}</a>
        </header>
        <ul v-if="recent.length" class="dash-recent">
          <li v-for="i in recent" :key="i.slug + i.word.w">
            <span class="vword">{{ i.word.w }}</span>
            <span class="dash-vi">{{ i.word.vi }}</span>
            <a class="dash-meta" :href="link(topicLink(i.slug))">{{ topicTitle(i.slug) }}</a>
            <span class="dash-meta">{{ when(learnedKey(i.slug, i.word.w)) }}</span>
          </li>
        </ul>
        <p v-else class="vnote">{{ tr('Từ bạn đánh dấu "Đã thuộc" sẽ hiện ở đây, kèm ngày thuộc.') }}</p>
      </section>
    </div>
  </div>
</template>
