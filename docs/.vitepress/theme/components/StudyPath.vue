<script setup lang="ts">
import { computed } from 'vue'
import { chapters, type Level, sectionLink, sectionNo } from '../../chapters'
import { useLocale } from './i18n'

const props = defineProps<{ level: Level }>()
const { link, isEn, tr } = useLocale()

// Round 1 starts with word classes and the core tenses before sentences, so the order
// here follows the study plan rather than the book's chapter numbers.
const ORDER: Record<Level, number[]> = {
  v1: [1, 2, 8, 4, 7],
  v2: [5, 3, 6, 2, 1, 4, 7, 9],
  tc: [1, 2, 9],
}

// One stage per chapter, so the chapter name is shown once instead of on every row.
const stages = computed(() =>
  ORDER[props.level]
    .map((no) => {
      const c = chapters.find((x) => x.no === no)!
      const lessons = c.sections
        .filter((s) => s.level === props.level)
        .map((s) => ({ href: link(sectionLink(c, s)), no: sectionNo(c, s), title: isEn.value ? s.titleEn : s.title }))
      return { key: c.dir, href: link(`/${c.dir}/`), title: isEn.value ? c.en : c.title, lessons }
    })
    .filter((st) => st.lessons.length > 0),
)
</script>

<template>
  <ol :class="['sp', level]">
    <li v-for="(st, i) in stages" :key="st.key" class="sp-stage">
      <span class="sp-node" aria-hidden="true">{{ i + 1 }}</span>
      <div class="sp-body">
        <div class="sp-head">
          <span class="sp-step">{{ tr('Chặng {n}', { n: i + 1 }) }}</span>
          <a class="sp-ch" :href="st.href">{{ st.title }}</a>
          <span class="sp-count">
            {{ st.lessons.length === 1 ? tr('1 bài') : tr('{n} bài', { n: st.lessons.length }) }}
          </span>
        </div>
        <ul class="sp-lessons">
          <li v-for="l in st.lessons" :key="l.href">
            <a class="sp-lesson" :href="l.href">
              <span class="row-no">{{ l.no }}</span>
              <span class="sp-title">{{ l.title }}</span>
              <span class="sp-arrow" aria-hidden="true">→</span>
            </a>
          </li>
        </ul>
      </div>
    </li>
  </ol>
</template>
