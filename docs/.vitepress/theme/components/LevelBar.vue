<script setup lang="ts">
import { LEVEL_LABEL, LEVEL_LABEL_EN, sectionNo } from '../../chapters'
import { useLocale } from './i18n'
import { useSection } from './useSection'

const current = useSection()
const { tr, link, isEn } = useLocale()
</script>

<template>
  <div v-if="current.chapter && current.section" class="level-bar">
    <a :href="link(`/${current.chapter.dir}/`)">
      {{ tr('Chương {n} · {t}', { n: current.chapter.no, t: isEn ? current.chapter.en : current.chapter.title }) }}
    </a>
    <span class="sep">/</span>
    <span>{{ tr('Mục {n}', { n: sectionNo(current.chapter, current.section) }) }}</span>
    <span :class="['lv', current.section.level]">
      {{ (isEn ? LEVEL_LABEL_EN : LEVEL_LABEL)[current.section.level] }}
    </span>
  </div>
</template>
