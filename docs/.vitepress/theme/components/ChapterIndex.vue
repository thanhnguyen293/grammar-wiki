<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { chapters, LEVEL_LABEL, sectionLink, sectionNo } from '../../chapters'

const props = defineProps<{ no: number }>()
const chapter = computed(() => chapters.find((c) => c.no === props.no)!)
</script>

<template>
  <div class="row-list">
    <a v-for="s in chapter.sections" :key="s.slug" class="row" :href="withBase(sectionLink(chapter, s))">
      <span class="row-no">{{ sectionNo(chapter, s) }}</span>
      <span class="row-title">{{ s.title }}</span>
      <span :class="['lv', s.level]">{{ LEVEL_LABEL[s.level] }}</span>
    </a>
  </div>
</template>
