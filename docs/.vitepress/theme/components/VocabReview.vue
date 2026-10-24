<script setup lang="ts">
import { useLocale } from './i18n'
import { computed, nextTick, onMounted, ref } from 'vue'
import { MINE, vocabTopics } from '../../vocabTopics'
import SpeakButton from './SpeakButton.vue'
import { itemKey, resolveLearned, resolveRefs, speak, useLearned, useQuizLog, useToday, type Item } from './useVocab'

type Range = 1 | 7 | 30 | null
type Source = 'today' | 'learned' | 'topic' | 'recent'
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
// Counted in calendar days back from today: 1 = since midnight.
const RECENT: { days: number; label: string }[] = [
  { days: 1, label: 'Hôm nay' },
  { days: 7, label: '7 ngày qua' },
  { days: 30, label: '30 ngày qua' },
]
const SIZES: { value: number | null; label: string }[] = [
  { value: 10, label: '10 câu' },
  { value: 20, label: '20 câu' },
  { value: 50, label: '50 câu' },
  { value: null, label: 'Tất cả' },
]

const today = useToday()
const { learned, learnedAt } = useLearned()
const quizLog = useQuizLog()
const mounted = ref(false)
const learnedItems = ref<Item[] | null>(null)
onMounted(async () => {
  mounted.value = true
  learnedItems.value = await resolveLearned([...learned.value])
  // Open the topic picker on a topic that has something to test.
  const first = learnedItems.value[0]
  if (first) topic.value = first.slug
})

const source = ref<Source>('today')
const range = ref<Range>(7)
const topic = ref(vocabTopics[0].slug)
const recent = ref(7)
const size = ref<number | null>(20)

const counts = computed(() =>
  mounted.value ? Object.fromEntries(RANGES.map((r) => [String(r.value), today.pastRefs(r.value).length])) : {},
)
const topics = computed(() =>
  [...vocabTopics, { slug: MINE.slug, title: MINE.title, en: 'My words' }].map((t) => ({
    ...t,
    n: learnedItems.value?.filter((i) => i.slug === t.slug).length ?? 0,
  })),
)
const learnedCount = computed(() => learnedItems.value?.length ?? 0)

function since(days: number) {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - (days - 1))
  return d.getTime()
}
const learnedSince = (days: number) =>
  (learnedItems.value ?? []).filter((i) => (learnedAt.value[itemKey(i)] ?? 0) >= since(days))

/** The words the chosen source covers, before the question count is applied. */
const pool = computed<Item[] | null>(() => {
  if (source.value === 'today') return null // resolved on start; counted from refs
  const all = learnedItems.value ?? []
  if (source.value === 'topic') return all.filter((i) => i.slug === topic.value)
  if (source.value === 'recent') return learnedSince(recent.value)
  return all
})
const available = computed(() =>
  source.value === 'today' ? (counts.value[String(range.value)] ?? 0) : (pool.value?.length ?? 0),
)
const questions = computed(() => (size.value === null ? available.value : Math.min(size.value, available.value)))

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
  const list = items ?? (source.value === 'today' ? await resolveRefs(today.pastRefs(range.value)) : (pool.value ?? []))
  // A retry of wrong answers keeps every word; a new quiz is cut to the chosen length.
  const mixed = shuffle(list)
  queue.value = items || size.value === null ? mixed : mixed.slice(0, size.value)
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
// Spaces don't count: the slots already split the words, so "icecream" fills "ice cream".
const squash = (s: string) => s.replace(/ /g, '')
const same = (a: string, b: string) =>
  squash(norm(a)) === squash(norm(b)) || squash(variant(norm(a))) === squash(variant(norm(b)))

function check() {
  if (!current.value || checked.value) return
  const ok = same(input.value, current.value.word.w)
  checked.value = { item: current.value, answer: input.value.trim(), ok }
  results.value.push(checked.value)
  quizLog.record(ok)
  speak(current.value.word.w)
}
function giveUp() {
  if (!current.value || checked.value) return
  checked.value = { item: current.value, answer: '', ok: false }
  results.value.push(checked.value)
  quizLog.record(false)
  speak(current.value.word.w)
}
/** For synonyms the list doesn't know about (big vs large): the learner overrides the mark. */
function acceptMine() {
  if (!checked.value || checked.value.ok) return
  checked.value.ok = true
  quizLog.upgrade()
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

// The answer is typed straight into its letter slots: one slot per letter, words kept apart,
// hyphens and apostrophes shown as fixed marks. A hidden text field underneath receives the
// typing, so phone keyboards and Enter work as usual. Letters beyond the answer's length (a
// longer synonym) appear as extra slots.
interface Slot {
  ch: string
  fixed?: boolean
  hint?: boolean
  caret?: boolean
  extra?: boolean
}
const focused = ref(false)
const slotGroups = computed(() => {
  const answer = current.value?.word.w ?? ''
  const typed = [...input.value.replace(/\s+/g, '')]
  const groups: Slot[][] = []
  let p = 0
  let first = true
  let caretPlaced = false
  for (const part of answer.split(' ')) {
    const group: Slot[] = []
    for (const ch of part) {
      if (/[a-z0-9]/i.test(ch)) {
        const c = typed[p]
        if (c !== undefined) {
          p++
          group.push({ ch: c })
        } else {
          const caret = !caretPlaced && focused.value && !checked.value
          if (caret) caretPlaced = true
          group.push({ ch: hint.value && first ? ch : '', hint: hint.value && first, caret })
        }
        first = false
      } else {
        if (typed[p] === ch) p++
        group.push({ ch, fixed: true })
      }
    }
    groups.push(group)
  }
  if (p < typed.length) groups.push(typed.slice(p).map((c) => ({ ch: c, extra: true })))
  return groups
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
const { tr, link, pos, isEn } = useLocale()
</script>

<template>
  <div class="vocab review">
    <!-- Setup -->
    <template v-if="phase === 'setup'">
      <fieldset class="rv-group">
        <legend>{{ tr('Ôn những từ nào?') }}</legend>
        <div class="rv-sources">
          <label class="rv-source" :class="{ on: source === 'today' }">
            <input v-model="source" type="radio" name="rv-source" value="today" />
            <b>{{ tr('Từ đã chọn học') }}</b>
            <span>{{ tr('Danh sách "Hôm nay học" của những ngày trước') }}</span>
          </label>
          <label class="rv-source" :class="{ on: source === 'learned' }">
            <input v-model="source" type="radio" name="rv-source" value="learned" />
            <b>{{ tr('Tất cả từ đã thuộc') }}</b>
            <span>{{ learnedItems ? tr('{n} từ', { n: learnedCount }) : '…' }}</span>
          </label>
          <label class="rv-source" :class="{ on: source === 'topic' }">
            <input v-model="source" type="radio" name="rv-source" value="topic" />
            <b>{{ tr('Đã thuộc theo chủ đề') }}</b>
            <span>{{ tr('Chọn một chủ đề') }}</span>
          </label>
          <label class="rv-source" :class="{ on: source === 'recent' }">
            <input v-model="source" type="radio" name="rv-source" value="recent" />
            <b>{{ tr('Thuộc gần đây') }}</b>
            <span>{{ tr('Những từ bạn vừa đánh dấu đã thuộc') }}</span>
          </label>
        </div>

        <div v-if="source === 'today'" class="vseg" role="group" :aria-label="tr('Chọn khoảng thời gian')">
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
        <select v-else-if="source === 'topic'" id="rv-topic" v-model="topic" class="rv-select" :aria-label="tr('Chủ đề')">
          <option v-for="t in topics" :key="t.slug" :value="t.slug">
            {{ isEn ? t.en : t.title }} ({{ t.n }})
          </option>
        </select>
        <div v-else-if="source === 'recent'" class="vseg" role="group" :aria-label="tr('Thuộc trong khoảng')">
          <button v-for="r in RECENT" :key="r.days" type="button" :aria-pressed="recent === r.days" @click="recent = r.days">
            {{ tr(r.label) }} ({{ learnedItems ? learnedSince(r.days).length : '…' }})
          </button>
        </div>
      </fieldset>

      <fieldset class="rv-group">
        <legend>{{ tr('Số câu') }}</legend>
        <div class="vseg" role="group" :aria-label="tr('Số câu')">
          <button
            v-for="z in SIZES"
            :key="String(z.value)"
            type="button"
            :aria-pressed="size === z.value"
            @click="size = z.value"
          >
            {{ tr(z.label) }}
          </button>
        </div>
      </fieldset>

      <div v-if="available" class="rv-start">
        <button type="button" class="vbtn primary" @click="start()">{{ tr('Bắt đầu kiểm tra') }}</button>
        <span class="vnote">{{ tr('{a} câu, lấy ngẫu nhiên từ {b} từ.', { a: questions, b: available }) }}</span>
      </div>
      <div v-else class="vempty-state">
        <template v-if="source === 'today'">
          <p>{{ tr('Chưa có từ nào để ôn trong khoảng này.') }}</p>
          <p>
            {{ tr('Bài ôn tập lấy từ danh sách') }} <a :href="link('/vocabulary/today')">{{ tr('Hôm nay học') }}</a>
            {{ tr('của những ngày trước. Hãy chọn từ để học hôm nay, ngày mai quay lại đây để kiểm tra.') }}
          </p>
        </template>
        <p v-else-if="!learnedItems">{{ tr('Đang tải danh sách từ…') }}</p>
        <template v-else>
          <p>{{ tr('Chưa có từ đã thuộc nào ở đây.') }}</p>
          <p>
            {{ tr('Bấm') }} <b>{{ tr('Đã thuộc?') }}</b> {{ tr('cạnh một từ trong') }}
            <a :href="link('/vocabulary/')">{{ tr('các chủ đề') }}</a>{{ tr(' để đánh dấu, rồi quay lại đây kiểm tra.') }}
          </p>
        </template>
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
        <form class="quiz-form" @submit.prevent="onEnter">
          <label class="quiz-slots" :class="{ ok: checked?.ok, bad: checked && !checked.ok, focused }">
            <span v-for="(g, gi) in slotGroups" :key="gi" class="slot-group" aria-hidden="true">
              <span
                v-for="(sl, si) in g"
                :key="si"
                class="slot"
                :class="{ filled: sl.ch && !sl.hint && !sl.fixed, fixed: sl.fixed, hint: sl.hint, caret: sl.caret, extra: sl.extra }"
                >{{ sl.ch }}</span
              >
            </span>
            <input
              id="quiz-answer"
              ref="field"
              v-model="input"
              class="quiz-input"
              type="text"
              autocomplete="off"
              autocapitalize="off"
              autocorrect="off"
              spellcheck="false"
              maxlength="60"
              :aria-label="tr('Câu trả lời')"
              :readonly="!!checked"
              @focus="focused = true"
              @blur="focused = false"
            />
          </label>
          <p v-if="!checked" class="quiz-type-hint">{{ tr('Gõ từ tiếng Anh rồi nhấn Enter') }}</p>
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
