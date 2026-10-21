<script setup lang="ts">
import { useLocale } from './i18n'
import { computed, onMounted, ref } from 'vue'
import VocabStudy from './VocabStudy.vue'
import { itemKey, loadTopic, useLearned, useToday, type Item } from './useVocab'

const props = defineProps<{ slug: string }>()

const DAILY = 5
const items = ref<Item[]>([])
const loading = ref(true)
const { learned } = useLearned()
const today = useToday()

onMounted(async () => {
  items.value = (await loadTopic(props.slug)).map((word) => ({ slug: props.slug, word }))
  loading.value = false
})

// Words are sorted by how common they are, so "next" means the first ones not yet learned or picked.
const nextBatch = computed(() =>
  items.value.filter((i) => !learned.value.has(itemKey(i)) && !today.has(i.slug, i.word.w)).slice(0, DAILY),
)
const { tr, link } = useLocale()
</script>

<template>
  <VocabStudy :items="items" :loading="loading">
    <div v-if="!loading" class="vtoday-bar">
      <button v-if="nextBatch.length" type="button" class="vbtn primary" @click="today.add(nextBatch)">
        {{ tr('+ Thêm {n} từ tiếp theo vào hôm nay', { n: nextBatch.length }) }}
      </button>
      <a :href="link('/tu-vung/hom-nay')">{{ tr('Hôm nay học: {n} từ →', { n: today.refs.value.length }) }}</a>
    </div>
  </VocabStudy>
</template>
