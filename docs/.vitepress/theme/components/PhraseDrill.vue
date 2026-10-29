<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useLocale } from './i18n'
import { data, type Phrase } from './phrases.data'
import SpeakButton from './SpeakButton.vue'
import { speak, useQuizLog } from './useVocab'

// Fill-in-the-blank practice for a workplace lesson: each key phrase comes back with its bold
// parts blanked out and the Vietnamese meaning as the hint. Answers count as quiz answers on
// the progress page.
const props = defineProps<{ lesson: string }>()
const { tr } = useLocale()
const quizLog = useQuizLog()

const all = data[props.lesson] ?? []

interface Part {
  text: string
  /** Index of the blank, or -1 for plain text. */
  n: number
}
function parse(en: string): Part[] {
  // "I'**ve been working**": the blank takes the whole word, so the learner types "I've".
  const pieces = en.replace(/(\b\w+')\*\*/g, '**$1').split(/\*\*(.+?)\*\*/)
  let n = 0
  return pieces.flatMap((text, i) => (text ? [{ text, n: i % 2 ? n++ : -1 }] : []))
}
const plain = (en: string) => en.replace(/\*\*/g, '')
// Some phrases are bold from start to end, leaving only the Vietnamese as a clue; the first
// letter of each word says how long the answer is and how it starts ("I… t… l… t… e…").
const hint = (text: string) =>
  text
    .split(/\s+/)
    .map((w) => (/^\w/.test(w) ? `${w[0]}…` : w))
    .join(' ')

// Contractions and their full forms both count: "I'm" = "I am", "don't" = "do not".
const FULL: [RegExp, string][] = [
  [/\bwon't\b/g, 'will not'],
  [/\bcan't\b/g, 'cannot'],
  [/n't\b/g, ' not'],
  [/'m\b/g, ' am'],
  [/'re\b/g, ' are'],
  [/'ve\b/g, ' have'],
  [/'ll\b/g, ' will'],
]
function norm(s: string) {
  let t = s.toLowerCase().replace(/[’‘]/g, "'")
  for (const [re, full] of FULL) t = t.replace(re, full)
  return t
    .replace(/\bcan not\b/g, 'cannot')
    .replace(/[.,!?:;"…]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
// "'s" after a pronoun is "is" or "has" ("he's our lead", "she's left"), so it gets both readings.
const S_PRONOUN = /\b(he|she|it|that|there|what|who|where|here)'s\b/g
const forms = (s: string) => {
  const t = norm(s)
  return [t, t.replace(S_PRONOUN, '$1 is'), t.replace(S_PRONOUN, '$1 has')]
}
const same = (answer: string, target: string) => {
  const want = forms(target)
  return forms(answer).some((f) => want.includes(f))
}

const order = ref<Phrase[]>(all)
const pos = ref(0)
const answers = ref<string[]>([])
const marks = ref<boolean[] | null>(null)
const score = ref(0)
const wrong = ref<Phrase[]>([])
const inputs: HTMLInputElement[] = []

const current = computed(() => order.value[pos.value])
const parts = computed(() => (current.value ? parse(current.value.en) : []))
const blanks = computed(() => parts.value.filter((p) => p.n >= 0))
const finished = computed(() => pos.value >= order.value.length)

function shuffle<T>(list: T[]) {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}
function reset(focus: boolean) {
  answers.value = blanks.value.map(() => '')
  marks.value = null
  if (focus) nextTick(() => inputs[0]?.focus())
}
function start(list: Phrase[], focus = true) {
  order.value = shuffle(list)
  pos.value = 0
  score.value = 0
  wrong.value = []
  reset(focus)
}
// Shuffled only in the browser, so the server-rendered page and the first client render agree.
onMounted(() => start(all, false))

function finish(result: boolean[]) {
  if (!current.value) return
  marks.value = result
  const ok = result.every(Boolean)
  if (ok) score.value++
  else wrong.value.push(current.value)
  quizLog.record(ok)
  speak(plain(current.value.en))
}
function check() {
  if (marks.value) return
  finish(blanks.value.map((b) => same(answers.value[b.n] ?? '', b.text)))
}
function giveUp() {
  if (!marks.value) finish(blanks.value.map(() => false))
}
function next() {
  pos.value++
  if (!finished.value) reset(true)
}
const onEnter = () => (marks.value ? next() : check())
</script>

<template>
  <div class="drill">
    <p v-if="!all.length" class="drill-vi">{{ tr('Bài này chưa có mẫu câu để luyện.') }}</p>
    <template v-else-if="current">
      <div class="drill-head">
        <span>{{ tr('Câu {a}/{b}', { a: pos + 1, b: order.length }) }}</span>
        <span>{{ tr('Đúng {n}', { n: score }) }}</span>
      </div>
      <p class="drill-vi">{{ current.vi }}</p>
      <p class="drill-en">
        <template v-for="(p, i) in parts" :key="`${pos}-${i}`">
          <span v-if="p.n < 0">{{ p.text }}</span>
          <span v-else class="drill-blank" :class="marks && (marks[p.n] ? 'ok' : 'bad')">
            <input
              :ref="(el) => (inputs[p.n] = el as HTMLInputElement)"
              v-model="answers[p.n]"
              type="text"
              :style="{ width: `${Math.max(4, p.text.length + 2)}ch` }"
              :readonly="!!marks"
              :placeholder="hint(p.text)"
              :aria-label="tr('Chỗ trống {n}', { n: p.n + 1 })"
              autocomplete="off"
              autocapitalize="off"
              spellcheck="false"
              @keydown.enter.prevent="onEnter"
            />
            <span v-if="marks && !marks[p.n]" class="drill-answer">{{ p.text }}</span>
          </span>
        </template>
        <SpeakButton v-if="marks" :text="plain(current.en)" />
      </p>
      <div class="drill-actions">
        <template v-if="!marks">
          <button type="button" class="vbtn primary" @click="check">{{ tr('Kiểm tra') }}</button>
          <button type="button" class="vbtn" @click="giveUp">{{ tr('Xem đáp án') }}</button>
        </template>
        <button v-else type="button" class="vbtn primary" @click="next">
          {{ pos + 1 < order.length ? tr('Câu tiếp →') : tr('Xem kết quả') }}
        </button>
      </div>
    </template>
    <div v-else class="drill-done">
      <p>{{ tr('Xong! Bạn đúng {a}/{b} câu.', { a: score, b: order.length }) }}</p>
      <div class="drill-actions">
        <button v-if="wrong.length" type="button" class="vbtn primary" @click="start(wrong)">
          {{ tr('Làm lại {n} câu sai', { n: wrong.length }) }}
        </button>
        <button type="button" class="vbtn" :class="{ primary: !wrong.length }" @click="start(all)">{{ tr('Làm lại từ đầu') }}</button>
      </div>
    </div>
  </div>
</template>
