<script setup lang="ts">
import { computed } from 'vue'
import { chapters, type Level, sectionLink, sectionNo } from '../../chapters'
import { useLocale } from './i18n'

const props = defineProps<{ level: Level }>()
const { link, isEn } = useLocale()

// Round 1 starts with word classes and the core tenses before sentences, so the order
// here follows the study plan rather than the book's chapter numbers.
const ORDER: Record<Level, number[]> = {
  v1: [1, 2, 8, 4, 7],
  v2: [5, 3, 6, 2, 1, 4, 7, 9],
  tc: [1, 2, 9],
}

const items = computed(() =>
  ORDER[props.level].flatMap((no) => {
    const c = chapters.find((x) => x.no === no)!
    return c.sections
      .filter((s) => s.level === props.level)
      .map((s) => ({ c, s, href: link(sectionLink(c, s)), no: sectionNo(c, s) }))
  }),
)
</script>

<template>
  <ol class="row-list path">
    <li v-for="it in items" :key="it.href">
      <a class="row" :href="it.href">
        <span class="row-no">{{ it.no }}</span>
        <span class="row-title">{{ isEn ? it.s.titleEn : it.s.title }}</span>
        <span class="row-ch">{{ isEn ? it.c.en : it.c.title }}</span>
      </a>
    </li>
  </ol>
</template>
