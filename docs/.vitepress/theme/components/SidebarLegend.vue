<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { LEVEL_LABEL, LEVEL_LABEL_EN, type Level } from '../../chapters'
import { useLocale } from './i18n'

// The grammar sidebar marks each lesson with a dot; this says what the dots mean. The
// vocabulary sidebar has no dots, so it gets no key.
const { page } = useData()
const { isEn } = useLocale()
const show = computed(() => !page.value.relativePath.replace(/^vi\//, '').startsWith('vocabulary/'))
const LEVELS: Level[] = ['v1', 'v2', 'tc']
</script>

<template>
  <div v-if="show" class="sb-legend">
    <span v-for="lv in LEVELS" :key="lv"><i :class="['sb-lv', lv]" />{{ (isEn ? LEVEL_LABEL_EN : LEVEL_LABEL)[lv] }}</span>
  </div>
</template>
