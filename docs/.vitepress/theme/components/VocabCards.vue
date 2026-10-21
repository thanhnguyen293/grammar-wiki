<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import SpeakButton from './SpeakButton.vue'
import { itemKey, POS_LABEL, useToday, type Item } from './useVocab'

const props = defineProps<{ items: Item[]; learned: Set<string> }>()
const emit = defineEmits<{ toggle: [key: string] }>()
const today = useToday()

// The deck is a snapshot: marking a card as learned must not pull it out from under the learner.
const deck = ref<Item[]>([])
const index = ref(0)
const flipped = ref(false)

function reset(list: Item[]) {
  deck.value = [...list]
  index.value = 0
  flipped.value = false
}
watch(() => props.items, reset, { immediate: true })

const card = computed(() => deck.value[index.value])
const word = computed(() => card.value?.word)

function go(step: number) {
  if (!deck.value.length) return
  index.value = (index.value + step + deck.value.length) % deck.value.length
  flipped.value = false
}
function shuffle() {
  const a = [...deck.value]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  reset(a)
}
function markAndNext() {
  if (!card.value) return
  const k = itemKey(card.value)
  if (!props.learned.has(k)) emit('toggle', k)
  go(1)
}

function onKey(e: KeyboardEvent) {
  if ((e.target as HTMLElement)?.closest('input, textarea, select')) return
  if (e.key === ' ') {
    e.preventDefault()
    flipped.value = !flipped.value
  } else if (e.key === 'ArrowRight') go(1)
  else if (e.key === 'ArrowLeft') go(-1)
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div v-if="card && word" class="cards">
    <div class="cards-top">
      <span class="cards-count">Thẻ {{ index + 1 }} / {{ deck.length }}</span>
      <span class="cards-tools">
        <button
          type="button"
          class="vtoday"
          :aria-pressed="today.has(card.slug, word.w)"
          @click="today.toggle(card.slug, word.w)"
        >
          {{ today.has(card.slug, word.w) ? '✓ Hôm nay' : '+ Hôm nay' }}
        </button>
        <button type="button" class="vbtn" @click="shuffle">Trộn thẻ</button>
      </span>
    </div>

    <div
      class="card"
      :class="{ flipped, learned: learned.has(itemKey(card)) }"
      role="button"
      tabindex="0"
      :aria-label="flipped ? 'Úp thẻ' : 'Lật thẻ xem nghĩa'"
      @click="flipped = !flipped"
      @keydown.enter.prevent="flipped = !flipped"
    >
      <div class="card-word">
        {{ word.w }}
        <SpeakButton :text="word.w" />
      </div>
      <div class="card-meta">{{ word.ipa }} · {{ POS_LABEL[word.pos] }} · {{ word.lv }}</div>
      <template v-if="flipped">
        <div class="card-vi">{{ word.vi }}</div>
        <div class="card-ex">
          <span>{{ word.ex }}</span>
          <SpeakButton :text="word.ex" label="Nghe câu ví dụ" />
        </div>
        <div class="card-exvi">{{ word.exVi }}</div>
      </template>
      <div v-else class="card-hint">Nhớ nghĩa trong đầu, rồi chạm để lật thẻ</div>
    </div>

    <div class="cards-actions">
      <button type="button" class="vbtn" @click="go(-1)">← Trước</button>
      <button type="button" class="vbtn" @click="flipped = !flipped">{{ flipped ? 'Úp thẻ' : 'Lật thẻ' }}</button>
      <button v-if="!learned.has(itemKey(card))" type="button" class="vbtn primary" @click="markAndNext">Đã thuộc, tiếp</button>
      <button v-else type="button" class="vbtn done" @click="emit('toggle', itemKey(card))">✓ Đã thuộc</button>
      <button type="button" class="vbtn" @click="go(1)">Tiếp →</button>
    </div>
    <p class="cards-keys">Phím tắt: Space lật thẻ · ← → chuyển thẻ</p>
  </div>
  <p v-else class="vempty">Không còn thẻ nào trong bộ lọc này.</p>
</template>
