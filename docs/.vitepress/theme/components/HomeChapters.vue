<script setup lang="ts">
import { chapterNo, chapters, LEVEL_LABEL, LEVEL_LABEL_EN, type Level } from '../../chapters'
import { useLocale } from './i18n'

const { tr, link, isEn } = useLocale()
const LEVELS: Level[] = ['v1', 'v2', 'tc']

const cards = chapters.map((c) => ({
  c,
  counts: LEVELS.map((lv) => ({ lv, n: c.sections.filter((s) => s.level === lv).length })).filter((x) => x.n),
}))
</script>

<template>
  <ul class="home-chapters">
    <li v-for="{ c, counts } in cards" :key="c.dir">
      <a class="ch-card" :href="link(`/${c.dir}/`)">
        <span class="ch-no">{{ chapterNo(c) }}</span>
        <span class="ch-title">{{ isEn ? c.en : c.title }}</span>
        <span class="ch-sub">{{ isEn ? c.title : c.en }}</span>
        <span class="ch-intro">{{ isEn ? c.introEn : c.intro }}</span>
        <span class="ch-foot">
          <span>{{ tr('{n} bài', { n: c.sections.length }) }}</span>
          <span class="ch-levels">
            <span v-for="x in counts" :key="x.lv" :title="(isEn ? LEVEL_LABEL_EN : LEVEL_LABEL)[x.lv]">
              <i :class="['sb-lv', x.lv]" />{{ x.n }}
            </span>
          </span>
        </span>
      </a>
    </li>
  </ul>
</template>
