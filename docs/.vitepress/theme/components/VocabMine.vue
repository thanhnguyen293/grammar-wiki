<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { MINE } from '../../vocabTopics'
import VocabStudy from './VocabStudy.vue'
import { useMine, type Item } from './useVocab'

const mine = useMine()
const items = computed<Item[]>(() => mine.words.value.map((word) => ({ slug: MINE.slug, word })))
</script>

<template>
  <div v-if="!items.length" class="vempty-state">
    <p>Chưa có từ nào.</p>
    <p>
      Khi <a :href="withBase('/tu-vung/phan-tich')">phân tích một bài viết</a>, những từ chưa có trong từ điển của wiki có nút
      <b>+ Thêm vào Từ của tôi</b>. Bạn tự nhập nghĩa, câu trong bài được giữ làm ví dụ.
    </p>
  </div>
  <VocabStudy v-else :items="items" removable @remove="(it) => mine.remove(it.word.w)" />
</template>
