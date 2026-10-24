<script setup lang="ts">
import { computed } from 'vue'
import { chapters, LEVEL_LABEL, LEVEL_LABEL_EN, lessonNo, sectionLink } from '../../chapters'
import { useLocale } from './i18n'

const props = defineProps<{ no: number }>()
const chapter = computed(() => chapters.find((c) => c.no === props.no)!)
const { link, isEn } = useLocale()
</script>

<template>
  <div class="row-list">
    <a v-for="s in chapter.sections" :key="s.slug" class="row" :href="link(sectionLink(chapter, s))">
      <span class="row-no">{{ lessonNo(chapter, s) }}</span>
      <span class="row-title">{{ isEn ? s.titleEn : s.title }}</span>
      <span :class="['lv', s.level]">{{ (isEn ? LEVEL_LABEL_EN : LEVEL_LABEL)[s.level] }}</span>
    </a>
  </div>
</template>
