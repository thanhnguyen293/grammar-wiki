<script setup lang="ts">
import { useLocale } from './i18n'
import { computed } from 'vue'
import { MINE } from '../../vocabTopics'
import VocabStudy from './VocabStudy.vue'
import { useMine, type Item } from './useVocab'

const mine = useMine()
const items = computed<Item[]>(() => mine.words.value.map((word) => ({ slug: MINE.slug, word })))
const { tr, link } = useLocale()
</script>

<template>
  <div v-if="!items.length" class="vempty-state">
    <p>{{ tr('Chưa có từ nào.') }}</p>
    <p>
      {{ tr('Khi') }} <a :href="link('/vocabulary/article')">{{ tr('phân tích một bài viết') }}</a>{{ tr(', những từ chưa có trong từ điển của wiki có nút') }}
      <b>{{ tr('+ Thêm vào Từ của tôi') }}</b>{{ tr('. Bạn tự nhập nghĩa, câu trong bài được giữ làm ví dụ.') }}
    </p>
  </div>
  <VocabStudy v-else :items="items" removable @remove="(it) => mine.remove(it.word.w)" />
</template>
