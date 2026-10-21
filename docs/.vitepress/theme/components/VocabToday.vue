<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { withBase } from 'vitepress'
import VocabStudy from './VocabStudy.vue'
import { itemKey, resolveRefs, useLearned, useToday, type Item } from './useVocab'

const DAILY = 5
const today = useToday()
const { learned } = useLearned()
const items = ref<Item[]>([])
const pending = ref<Item[]>([])
const loading = ref(true)
const confirmClear = ref(false)

const fmt = (d: string) => d.split('-').reverse().slice(0, 2).join('/')

async function refresh() {
  items.value = await resolveRefs(today.refs.value)
  const prev = today.previous.value
  pending.value = prev ? (await resolveRefs(prev.refs)).filter((i) => !learned.value.has(itemKey(i))) : []
  loading.value = false
}
onMounted(refresh)
watch(() => today.refs.value, refresh)

const carryable = computed(() => pending.value.filter((i) => !today.has(i.slug, i.word.w)))
function clearAll() {
  if (!confirmClear.value) {
    confirmClear.value = true
    return
  }
  today.clear()
  confirmClear.value = false
}
</script>

<template>
  <div class="vtoday-head">
    <p>
      <b>{{ fmt(today.today) }}</b> · {{ items.length }} từ
      <span class="vgoal" :class="{ ok: items.length >= DAILY }">mục tiêu {{ DAILY }} từ/ngày</span>
    </p>
    <button v-if="items.length" type="button" class="vbtn" @click="clearAll" @blur="confirmClear = false">
      {{ confirmClear ? 'Bấm lần nữa để xóa hết' : 'Xóa danh sách hôm nay' }}
    </button>
  </div>

  <p class="vreview-link">
    Muốn xem mình còn nhớ từ của những ngày trước? <a :href="withBase('/tu-vung/on-tap')">Kiểm tra từ đã học →</a>
  </p>

  <div v-if="!loading && carryable.length" class="custom-block tip">
    <p class="custom-block-title">CÒN TỪ HÔM TRƯỚC</p>
    <p>
      Ngày {{ fmt(today.previous.value!.date) }} còn {{ carryable.length }} từ chưa thuộc:
      {{ carryable.map((i) => i.word.w).join(', ') }}.
    </p>
    <button type="button" class="vbtn primary" @click="today.add(carryable)">Chuyển sang hôm nay</button>
  </div>

  <div v-if="!loading && !items.length" class="vempty-state">
    <p>Danh sách hôm nay đang trống.</p>
    <p>
      Mở một <a :href="withBase('/tu-vung/')">chủ đề</a>, bấm <b>+ Hôm nay</b> cạnh từ bạn muốn học, hoặc bấm
      <b>+ Thêm 5 từ tiếp theo vào hôm nay</b> ở đầu trang chủ đề.
    </p>
  </div>
  <VocabStudy v-else :items="items" :loading="loading" show-topic />
</template>
