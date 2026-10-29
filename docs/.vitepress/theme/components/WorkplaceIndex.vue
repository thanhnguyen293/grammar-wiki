<script setup lang="ts">
import { workplaceLessons, workplaceLink, workplaceNo } from '../../workplace'
import { useLocale } from './i18n'

const { link, isEn } = useLocale()
</script>

<template>
  <div class="row-list">
    <a v-for="l in workplaceLessons" :key="l.slug" class="row" :href="link(workplaceLink(l))">
      <span class="row-no">{{ workplaceNo(l) }}</span>
      <span class="row-title">{{ isEn ? l.titleEn : l.title }}</span>
    </a>
  </div>
</template>
