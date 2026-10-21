<script setup lang="ts">
import { withBase } from 'vitepress'
import { LEVEL_LABEL, sectionNo } from '../../chapters'
import { useSection } from './useSection'

const current = useSection()
</script>

<template>
  <div v-if="current.chapter && current.section" class="level-bar">
    <a :href="withBase(`/${current.chapter.dir}/`)">Chương {{ current.chapter.no }} · {{ current.chapter.title }}</a>
    <span class="sep">/</span>
    <span>Mục {{ sectionNo(current.chapter, current.section) }}</span>
    <span :class="['lv', current.section.level]">{{ LEVEL_LABEL[current.section.level] }}</span>
  </div>
</template>
