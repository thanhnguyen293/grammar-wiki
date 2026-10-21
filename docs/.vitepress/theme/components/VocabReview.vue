<script setup lang="ts">
import { useLocale } from './i18n'
import { computed, nextTick, onMounted, ref } from 'vue'
import SpeakButton from './SpeakButton.vue'
import { itemKey, resolveRefs, speak, useToday, type Item } from './useVocab'

type Range = 1 | 7 | 30 | null
interface Result {
  item: Item
  answer: string
  ok: boolean
}

const RANGES: { value: Range; label: string }[] = [
  { value: 1, label: 'Hôm qua' },
  { value: 7, label: '7 ngày qua' },
  { value: 30, label: '30 ngày qua' },
  { value: null, label: 'Tất cả' },
]

const today = useToday()
const mounted = ref(false)
onMounted(() => (mounted.value = true))

const range = ref<Range>(7)
const counts = computed(() =>
  mounted.value ? Object.fromEntries(RANGES.map((r) => [String(r.value), today.pastRefs(r.value).length])) : {},
)
const available = computed(() => counts.value[String(range.value)] ?? 0)

const phase = ref<'setup' | 'quiz' | 'done'>('setup')
const queue = ref<Item[]>([])
const index = ref(0)
const input = ref('')
const hint = ref(false)
const checked = ref<Result | null>(null)
const results = ref<Result[]>([])
const field = ref<HTMLInputElement>()

const current = computed(() => queue.value[index.value])

function shuffle<T>(list: T[]) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

async function start(items?: Item[]) {
  const list = items ?? (await resolveRefs(today.pastRefs(range.value)))
  queue.value = shuffle(list)
  index.value = 0
  results.value = []
  phase.value = queue.value.length ? 'quiz' : 'setup'
  resetQuestion()
}

function resetQuestion() {
  input.value = ''
  hint.value = false
  checked.value = null
  nextTick(() => field.value?.focus())
}

/* Answers are compared loosely: case, extra spaces, curly apostrophes and British/American
   spelling (colour/color, centre/center, realise/realize) do not count as mistakes. */
const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/[.!?,]+$/, '')
    .replace(/\s+/g, ' ')
    .trim()
const variant = (s: string) =>
  s.replace(/our\b/g, 'or').replace(/tre\b/g, 'ter').replace(/ise\b/g, 'ize').replace(/yse\b/g, 'yze')
const same = (a: string, b: string) => norm(a) === norm(b) || variant(norm(a)) === variant(norm(b))

function check() {
  if (!current.value || checked.value) return
  const ok = same(input.value, current.value.word.w)
  checked.value = { item: current.value, answer: input.value.trim(), ok }
  results.value.push(checked.value)
  speak(current.value.word.w)
}
function giveUp() {
  if (!current.value || checked.value) return
  checked.value = { item: current.value, answer: '', ok: false }
  results.value.push(checked.value)
  speak(current.value.word.w)
}
/** For synonyms the list doesn't know about (big vs large): the learner overrides the mark. */
function acceptMine() {
  if (checked.value) checked.value.ok = true
}
function next() {
  if (index.value + 1 >= queue.value.length) {
    phase.value = 'done'
    return
  }
  index.value++
  resetQuestion()
}
function onEnter() {
  if (checked.value) next()
  else if (input.value.trim()) check()
}

// A pattern like "_ _ _ _   _ _ _" tells the learner how many letters (and words) to type.
const pattern = computed(() => {
  const w = current.value?.word.w ?? ''
  return w
    .split(' ')
    .map((part, i) =>
      [...part].map((ch, k) => (/[a-z]/i.test(ch) ? (hint.value && i === 0 && k === 0 ? ch : '_') : ch)).join(' '),
    )
    .join('   ')
})

// IT meanings and translations often keep the English term ("nhánh (branch trong Git)"),
// which would give the answer away, so it is blanked out in the question.
const mask = (text: string) => {
  const w = current.value?.word.w
  if (!w) return text
  const re = new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
  return text.replace(re, '___')
}

const score = computed(() => results.value.filter((r) => r.ok).length)
const wrong = computed(() => results.value.filter((r) => !r.ok))
const wrongInToday = computed(() => wrong.value.every((r) => today.has(r.item.slug, r.item.word.w)))
const { tr, link, pos } = useLocale()
</script>

<template>
  <div class="vocab review">
    <!-- Setup -->
    <template v-if="phase === 'setup'">
      <div class="vseg" role="group" :aria-label="tr('Chọn khoảng thời gian')">
        <button
          v-for="r in RANGES"
          :key="String(r.value)"
          type="button"
          :aria-pressed="range === r.value"
          @click="range = r.value"
        >
          {{ tr(r.label) }} ({{ counts[String(r.value)] ?? 0 }})
        </button>
      </div>
      <p v-if="available" class="vnote">
        {{ tr('{n} từ trong danh sách "Hôm nay học" của các ngày trước. Mỗi câu hiện nghĩa tiếng Việt, bạn gõ từ tiếng Anh.', { n: available }) }}
      </p>
      <div v-else class="vempty-state">
        <p>{{ tr('Chưa có từ nào để ôn trong khoảng này.') }}</p>
        <p>
          {{ tr('Bài ôn tập lấy từ danh sách') }} <a :href="link('/tu-vung/hom-nay')">{{ tr('Hôm nay học') }}</a>
          {{ tr('của những ngày trước. Hãy chọn từ để học hôm nay, ngày mai quay lại đây để kiểm tra.') }}
        </p>
      </div>
      <div>
        <button type="button" class="vbtn primary" :disabled="!available" @click="start()">
          {{ tr('Bắt đầu kiểm tra') }}
        </button>
      </div>
    </template>

    <!-- Quiz -->
    <template v-else-if="phase === 'quiz' && current">
      <div class="cards-top">
        <span class="cards-count">{{ tr('Câu {a} / {b} · Đúng {c}', { a: index + 1, b: queue.length, c: score }) }}</span>
        <button type="button" class="vbtn" @click="phase = 'done'">{{ tr('Kết thúc') }}</button>
      </div>
      <div class="vprog-bar"><i :style="{ width: (index / queue.length) * 100 + '%' }" /></div>

      <div class="quiz">
        <p class="quiz-label">{{ tr('Từ tiếng Anh nào có nghĩa là') }}</p>
        <p class="quiz-vi">{{ mask(current.word.vi) }}</p>
        <p class="quiz-meta">{{ pos[current.word.pos] }}</p>
        <p class="quiz-ex">"{{ mask(current.word.exVi) }}"</p>
        <p class="quiz-pattern" aria-hidden="true">{{ pattern }}</p>

        <form class="quiz-form" @submit.prevent="onEnter">
          <input
            id="quiz-answer"
            ref="field"
            v-model="input"
            class="vsearch"
            :class="{ ok: checked?.ok, bad: checked && !checked.ok }"
            type="text"
            autocomplete="off"
            autocapitalize="off"
            spellcheck="false"
            :placeholder="tr('Gõ từ tiếng Anh rồi nhấn Enter')"
            :aria-label="tr('Câu trả lời')"
            :readonly="!!checked"
          />
          <div v-if="!checked" class="quiz-actions">
            <button type="submit" class="vbtn primary" :disabled="!input.trim()">{{ tr('Kiểm tra') }}</button>
            <button type="button" class="vbtn" :disabled="hint" @click="hint = true">{{ tr('Gợi ý chữ đầu') }}</button>
            <button type="button" class="vbtn" @click="giveUp">{{ tr('Mình chưa nhớ') }}</button>
          </div>
        </form>

        <div v-if="checked" class="quiz-result" :class="checked.ok ? 'ok' : 'bad'">
          <p class="quiz-verdict">{{ tr(checked.ok ? 'Chính xác!' : checked.answer ? 'Chưa đúng' : 'Đáp án') }}</p>
          <p class="quiz-answer">
            <span class="vword">{{ current.word.w }}</span>
            <SpeakButton :text="current.word.w" />
            <span class="vipa">{{ current.word.ipa }}</span>
          </p>
          <p v-if="!checked.ok && checked.answer" class="quiz-yours">{{ tr('Bạn gõ:') }} <s>{{ checked.answer }}</s></p>
          <p class="vex">
            <span>{{ current.word.ex }}</span>
            <SpeakButton :text="current.word.ex" :label="tr('Nghe câu ví dụ')" />
          </p>
          <div class="quiz-actions">
            <button type="button" class="vbtn primary" @click="next">
              {{ tr(index + 1 >= queue.length ? 'Xem kết quả' : 'Câu tiếp (Enter)') }}
            </button>
            <button v-if="!checked.ok && checked.answer" type="button" class="vbtn" @click="acceptMine">
              {{ tr('Từ của mình cũng đúng') }}
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- Results -->
    <template v-else>
      <div class="quiz-score">
        <p class="quiz-vi">{{ tr('{a} / {b} từ đúng', { a: score, b: results.length }) }}</p>
        <p class="vnote">
          {{ wrong.length ? tr('Còn {n} từ cần ôn lại.', { n: wrong.length }) : tr(results.length ? 'Bạn nhớ hết rồi.' : 'Bạn chưa trả lời câu nào.') }}
        </p>
      </div>
      <ol v-if="wrong.length" class="vlist">
        <li v-for="r in wrong" :key="itemKey(r.item)" class="vitem quiz-wrong">
          <div class="vmain">
            <div class="vhead">
              <span class="vword">{{ r.item.word.w }}</span>
              <SpeakButton :text="r.item.word.w" />
              <span class="vipa">{{ r.item.word.ipa }}</span>
            </div>
            <span class="vres-vi">{{ r.item.word.vi }}</span>
            <span v-if="r.answer" class="quiz-yours">{{ tr('Bạn gõ:') }} <s>{{ r.answer }}</s></span>
          </div>
        </li>
      </ol>
      <div class="quiz-actions">
        <button v-if="wrong.length" type="button" class="vbtn primary" @click="start(wrong.map((r) => r.item))">
          {{ tr('Kiểm tra lại {n} từ sai', { n: wrong.length }) }}
        </button>
        <button
          v-if="wrong.length"
          type="button"
          class="vbtn"
          :disabled="wrongInToday"
          @click="today.add(wrong.map((r) => r.item))"
        >
          {{ tr(wrongInToday ? '✓ Đã thêm vào hôm nay' : 'Thêm từ sai vào hôm nay') }}
        </button>
        <button type="button" class="vbtn" @click="phase = 'setup'">{{ tr('Làm bài mới') }}</button>
      </div>
    </template>
  </div>
</template>
