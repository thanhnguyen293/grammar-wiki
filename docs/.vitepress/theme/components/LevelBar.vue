<script setup lang="ts">
import { chapterNo, LEVEL_LABEL, LEVEL_LABEL_EN, lessonNo } from '../../chapters'
import { useLocale } from './i18n'
import { useSection, useWorkplaceLesson } from './useSection'
import { workplace, workplaceNo } from '../../workplace'

const current = useSection()
const lesson = useWorkplaceLesson()
const { tr, link, isEn } = useLocale()
</script>

<template>
  <div v-if="current.chapter && current.section" class="level-bar">
    <a :href="link(`/${current.chapter.dir}/`)">
      {{ tr('Chương {n} · {t}', { n: chapterNo(current.chapter), t: isEn ? current.chapter.en : current.chapter.title }) }}
    </a>
    <span class="sep">/</span>
    <span>{{ tr('Mục {n}', { n: lessonNo(current.chapter, current.section) }) }}</span>
    <span :class="['lv', current.section.level]">
      {{ (isEn ? LEVEL_LABEL_EN : LEVEL_LABEL)[current.section.level] }}
    </span>
  </div>
  <div v-else-if="lesson" class="level-bar">
    <a :href="link('/workplace/')">{{ isEn ? workplace.en : workplace.title }}</a>
    <span class="sep">/</span>
    <span>{{ tr('Bài {n}', { n: workplaceNo(lesson) }) }}</span>
  </div>
</template>
