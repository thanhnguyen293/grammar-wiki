<script setup lang="ts">
import { useLocale } from './i18n'
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import SpeakButton from './SpeakButton.vue'
import { itemKey, useToday, type Item } from './useVocab'

const props = defineProps<{ items: Item[]; learned: Set<string> }>()
const emit = defineEmits<{ toggle: [key: string]; exit: [] }>()
const today = useToday()
const { tr, pos } = useLocale()

// The deck is a snapshot of the words when the cards opened. A card marked "Đã thuộc" leaves the
// deck for this round; "Chưa nhớ" cards stay and come round again. An empty deck means done.
const deck = ref<Item[]>([])
/** All cards of this round, to start it over from the finish screen. */
const round = ref<Item[]>([])
const learnedInRound = ref(0)
const index = ref(0)
const flipped = ref(false)
// How the deck moved, so the next card comes in from the right side. A swiped card has already
// flown off, so it leaves without a second animation.
const dir = ref<'next' | 'prev' | 'swipe'>('next')

function reset(list: Item[]) {
  deck.value = [...list]
  index.value = 0
  flipped.value = false
}
function startRound(list: Item[]) {
  round.value = [...list]
  learnedInRound.value = 0
  reset(list)
}
watch(() => props.items, startRound, { immediate: true })
const finished = computed(() => !deck.value.length && round.value.length > 0)

const card = computed(() => deck.value[index.value])
const word = computed(() => card.value?.word)
const isLearned = computed(() => !!card.value && props.learned.has(itemKey(card.value)))

function go(step: number, how: typeof dir.value = step > 0 ? 'next' : 'prev') {
  if (!deck.value.length) return
  dir.value = how
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
/** "Đã thuộc": mark as learned and take the card out of this round. */
function know(how: typeof dir.value = 'next') {
  if (!card.value) return
  if (!isLearned.value) emit('toggle', itemKey(card.value))
  learnedInRound.value++
  dir.value = how
  flipped.value = false
  deck.value = deck.value.filter((_, i) => i !== index.value)
  // The next card slides into the same place; wrap around at the end of the deck.
  if (index.value >= deck.value.length) index.value = 0
}
/** "Chưa nhớ": keep (or put back) the word among the ones to learn, and move on. */
function notYet(how: typeof dir.value = 'next') {
  if (!card.value) return
  if (isLearned.value) emit('toggle', itemKey(card.value))
  go(1, how)
}

/* ---------- Swipe: right = know, left = not yet, tap = flip ---------- */

const drag = reactive({ id: -1, x0: 0, y0: 0, t0: 0, dx: 0, decided: false, horizontal: false, fly: 0 })
const SWIPE_DIST = 0.28 // of the card width
const SWIPE_SPEED = 0.6 // px per ms
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

function onDown(e: PointerEvent) {
  if (e.button !== 0 || drag.fly || (e.target as HTMLElement).closest('button')) return
  Object.assign(drag, { id: e.pointerId, x0: e.clientX, y0: e.clientY, t0: performance.now(), dx: 0, decided: false, horizontal: false })
}
function onMove(e: PointerEvent) {
  if (e.pointerId !== drag.id) return
  const dx = e.clientX - drag.x0
  const dy = e.clientY - drag.y0
  if (!drag.decided && Math.hypot(dx, dy) > 8) {
    drag.decided = true
    // Mostly sideways: it's a swipe. Mostly up or down: let the page scroll.
    drag.horizontal = Math.abs(dx) > Math.abs(dy) * 1.2
    if (drag.horizontal) (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  if (drag.horizontal) drag.dx = dx
}
function onUp(e: PointerEvent) {
  if (e.pointerId !== drag.id) return
  drag.id = -1
  if (!drag.decided) {
    flipped.value = !flipped.value
    return
  }
  if (!drag.horizontal) return
  const width = (e.currentTarget as HTMLElement).offsetWidth
  const speed = Math.abs(drag.dx) / Math.max(1, performance.now() - drag.t0)
  if (Math.abs(drag.dx) > width * SWIPE_DIST || (speed > SWIPE_SPEED && Math.abs(drag.dx) > 40)) commit(drag.dx > 0 ? 1 : -1)
  else drag.dx = 0
}
function onCancel() {
  drag.id = -1
  drag.dx = 0
}
/** Throws the card off-screen, then records the answer. Buttons and keys use the same path. */
function commit(side: 1 | -1) {
  if (drag.fly) return
  const done = () => {
    drag.fly = 0
    drag.dx = 0
    if (side > 0) know('swipe')
    else notYet('swipe')
  }
  if (reduceMotion()) return done()
  drag.fly = side
  setTimeout(done, 200)
}

const cardStyle = computed(() => {
  if (drag.fly) return { transform: `translateX(${drag.fly * 120}%) rotate(${drag.fly * 16}deg)`, transition: 'transform 0.2s ease-in' }
  if (drag.dx) return { transform: `translateX(${drag.dx}px) rotate(${drag.dx / 24}deg)`, transition: drag.id === -1 ? undefined : 'none' }
  return undefined
})
// The stamp fades in as the card moves towards that side.
const lean = computed(() => (drag.fly ? drag.fly * 200 : drag.dx))
const yesOpacity = computed(() => Math.min(1, Math.max(0, lean.value / 110)))
const noOpacity = computed(() => Math.min(1, Math.max(0, -lean.value / 110)))

function onKey(e: KeyboardEvent) {
  if (!card.value || (e.target as HTMLElement)?.closest('input, textarea, select, [contenteditable]')) return
  if (e.key === ' ') {
    e.preventDefault()
    flipped.value = !flipped.value
  } else if (e.key === 'ArrowRight') commit(1)
  else if (e.key === 'ArrowLeft') commit(-1)
  else if (e.key === 'Backspace') go(-1)
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div v-if="card && word" class="cards">
    <div class="cards-top">
      <button type="button" class="icon-btn" :aria-label="tr('Thẻ trước')" :title="tr('Thẻ trước')" @click="go(-1)">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <span class="cards-count">
        {{ tr('Còn {n} thẻ', { n: deck.length }) }}
        <small v-if="learnedInRound">· {{ tr('đã thuộc {n}', { n: learnedInRound }) }}</small>
      </span>
      <span class="cards-tools">
        <button
          type="button"
          class="vtoday"
          :aria-pressed="today.has(card.slug, word.w)"
          @click="today.toggle(card.slug, word.w)"
        >
          {{ tr(today.has(card.slug, word.w) ? '✓ Hôm nay' : '+ Hôm nay') }}
        </button>
        <button type="button" class="icon-btn" :aria-label="tr('Trộn thẻ')" :title="tr('Trộn thẻ')" @click="shuffle">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"
              fill="none"
              stroke="currentColor"
              stroke-width="1.9"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </span>
    </div>

    <Transition :name="`card-${dir}`" mode="out-in">
      <div
        :key="itemKey(card)"
        class="card"
        :class="{ flipped, learned: isLearned, dragging: drag.id !== -1 && drag.horizontal }"
        :style="cardStyle"
        role="button"
        tabindex="0"
        :aria-label="tr(flipped ? 'Úp thẻ' : 'Lật thẻ xem nghĩa')"
        @pointerdown="onDown"
        @pointermove="onMove"
        @pointerup="onUp"
        @pointercancel="onCancel"
        @keydown.enter.prevent="flipped = !flipped"
      >
        <span class="swipe-stamp yes" :style="{ opacity: yesOpacity }" aria-hidden="true">{{ tr('Đã thuộc') }}</span>
        <span class="swipe-stamp no" :style="{ opacity: noOpacity }" aria-hidden="true">{{ tr('Chưa nhớ') }}</span>
        <div class="card-word">
          {{ word.w }}
          <SpeakButton :text="word.w" />
        </div>
        <div class="card-meta">{{ [word.ipa, pos[word.pos]].filter(Boolean).join(' · ') }}</div>
        <!-- Both sides are always rendered in the same grid cell, so the card is as tall as its
             taller side and does not change size when it is flipped. -->
        <div class="card-body">
          <div class="card-face" :class="{ shown: !flipped }" :aria-hidden="flipped" />
          <div class="card-face" :class="{ shown: flipped }" :aria-hidden="!flipped">
            <div class="card-vi">{{ word.vi }}</div>
            <div class="card-ex">
              <span>{{ word.ex }}</span>
              <SpeakButton :text="word.ex" :label="tr('Nghe câu ví dụ')" />
            </div>
            <div v-if="word.exVi" class="card-exvi">{{ word.exVi }}</div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- The three answers, in thumb reach. On phones the row sticks to the bottom of the screen. -->
    <div class="cards-actions">
      <button type="button" class="act no" @click="commit(-1)">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
        </svg>
        <span>{{ tr('Chưa nhớ') }}</span>
      </button>
      <button type="button" class="act flip" :aria-pressed="flipped" @click="flipped = !flipped">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M20 12a8 8 0 1 1-2.34-5.66M20 4v5h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>{{ tr(flipped ? 'Úp thẻ' : 'Lật thẻ') }}</span>
      </button>
      <button type="button" class="act yes" :class="{ on: isLearned }" @click="commit(1)">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M5 12.5 10 17 19 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>{{ tr('Đã thuộc') }}</span>
      </button>
    </div>
    <p class="cards-keys">{{ tr('Phím tắt: Space lật thẻ · → đã thuộc · ← chưa nhớ · Backspace thẻ trước') }}</p>
    <p class="cards-swipe-hint">{{ tr('Chạm để lật · Vuốt phải: đã thuộc · Vuốt trái: chưa nhớ') }}</p>
  </div>
  <div v-else-if="finished" class="cards-done" role="status">
    <svg viewBox="0 0 48 48" width="56" height="56" aria-hidden="true">
      <circle cx="24" cy="24" r="21" />
      <path d="M14.5 24.5 21 31l12.5-13" />
    </svg>
    <p class="cards-done-title">{{ tr('Hoàn thành!') }}</p>
    <p class="cards-done-text">
      {{ tr('Bạn đã thuộc cả {n} từ của lượt này.', { n: round.length }) }}
    </p>
    <div class="cards-done-actions">
      <button type="button" class="vbtn primary" @click="startRound(round)">{{ tr('Ôn lại các thẻ này') }}</button>
      <button type="button" class="vbtn" @click="emit('exit')">{{ tr('Về danh sách') }}</button>
    </div>
  </div>
  <p v-else class="vempty">{{ tr('Không còn thẻ nào trong bộ lọc này.') }}</p>
</template>
