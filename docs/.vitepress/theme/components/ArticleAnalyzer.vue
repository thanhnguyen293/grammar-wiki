<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { MINE, vocabTopics } from '../../vocabTopics'
import SpeakButton from './SpeakButton.vue'
import { lookupEnglish, translateToVi } from './autoLookup'
import { analyze, buildDict, type Analysis, type Dict, type Entry } from './textAnalyze'
import {
  itemKey,
  loadTopic,
  POS_LABEL,
  useLearned,
  useMine,
  useToday,
  useUnknown,
  type Item,
  type Pos,
} from './useVocab'

type Status = 'known' | 'unknown' | 'none' | 'outside'
type Filter = 'all' | Status

const TEXT_KEY = 'stnp.vocab.article'
const MAX_CHARS = 30000
const SAMPLE = `Our team is getting ready to release version 2.0 of the app next week. Yesterday the QA team found a bug: the app crashes when users turn off notifications and then log in again. Minh looked into it and found out that the problem comes from an old library. He didn't give up. He set up a new branch, fixed the issue and asked me to review his pull request. I'm looking forward to seeing the new version in the App Store. In the meantime, please take care of the release notes and keep in touch with the client.`

const { learned, set: setLearned } = useLearned()
const unknown = useUnknown()
const today = useToday()
const mine = useMine()

const text = ref('')
const dict = ref<Dict | null>(null)
const result = ref<Analysis | null>(null)
const analysedText = ref('')
const filter = ref<Filter>('all')
const kind = ref<'all' | 'phrase' | 'word'>('all')
const hideBasic = ref(true)
const hideNames = ref(true)
const showReader = ref(true)
const flash = ref('')

onMounted(async () => {
  try {
    text.value = window.localStorage.getItem(TEXT_KEY) ?? ''
  } catch {
    // Storage blocked: start empty.
  }
  await loadDict()
  if (text.value.trim()) run()
})
watch(text, (v) => {
  try {
    window.localStorage.setItem(TEXT_KEY, v)
  } catch {
    // See above.
  }
})

async function loadDict() {
  // Core topics come first, so a word in both the core list and the IT list shows its everyday meaning first.
  const slugs = [...vocabTopics.map((t) => t.slug), MINE.slug]
  const lists = await Promise.all(slugs.map(async (slug) => (await loadTopic(slug)).map((word) => ({ slug, word }))))
  dict.value = buildDict(lists.flat())
}

function run() {
  if (!dict.value || !text.value.trim()) return
  analysedText.value = text.value.slice(0, MAX_CHARS)
  result.value = analyze(analysedText.value, dict.value)
  filter.value = 'all'
  kind.value = 'all'
}

const primary = (e: Entry): Item | undefined => e.items[0]
function status(e: Entry): Status {
  const it = primary(e)
  if (!it) return 'outside'
  const k = itemKey(it)
  return learned.value.has(k) ? 'known' : unknown.keys.value.has(k) ? 'unknown' : 'none'
}
const isBasic = (e: Entry) => primary(e)?.slug === 'tu-chuc-nang' || ['be', 'have', 'do'].includes(e.head)

const visible = computed(() =>
  (result.value?.entries ?? []).filter((e) => !(hideBasic.value && isBasic(e)) && !(hideNames.value && e.kind === 'name')),
)
const kindCounts = computed(() => {
  const phrase = visible.value.filter((e) => e.kind === 'phrase').length
  return { all: visible.value.length, phrase, word: visible.value.length - phrase }
})
// The kind filter narrows everything below it, so the status counts and bulk buttons follow it.
const pool = computed(() =>
  visible.value.filter((e) => kind.value === 'all' || (kind.value === 'phrase') === (e.kind === 'phrase')),
)
const counts = computed(() => {
  const c = { all: pool.value.length, known: 0, unknown: 0, none: 0, outside: 0 }
  for (const e of pool.value) c[status(e)]++
  return c
})
const shown = computed(() => pool.value.filter((e) => filter.value === 'all' || status(e) === filter.value))

function mark(e: Entry, s: 'known' | 'unknown') {
  const it = primary(e)
  if (!it) return
  const k = itemKey(it)
  const already = status(e) === s
  // Pressing the active button again clears the mark.
  setLearned(k, s === 'known' && !already)
  unknown.set(k, s === 'unknown' && !already)
}
function markRestKnown() {
  for (const e of pool.value) if (status(e) === 'none') mark(e, 'known')
}
const unknownItems = computed(() =>
  pool.value.filter((e) => status(e) === 'unknown').flatMap((e) => (primary(e) ? [primary(e)!] : [])),
)
const unknownNotToday = computed(() => unknownItems.value.filter((i) => !today.has(i.slug, i.word.w)))

const topicTitle = (slug: string) =>
  slug === MINE.slug ? MINE.title : (vocabTopics.find((t) => t.slug === slug)?.title ?? slug)

/* ---------- Highlighted text ---------- */
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)
const entryByKey = computed(() => new Map((result.value?.entries ?? []).map((e) => [e.key, e])))

function tokenClass(key: string | undefined) {
  const e = key ? entryByKey.value.get(key) : undefined
  if (!e || isBasic(e) || e.kind === 'name') return ''
  return `tk ${status(e)}${e.kind === 'phrase' ? ' ph' : ''}`
}

const readerHtml = computed(() => {
  const r = result.value
  if (!r) return ''
  const t = analysedText.value
  let html = ''
  let pos = 0
  for (const tok of r.tokens) {
    html += esc(t.slice(pos, tok.start))
    const cls = tokenClass(tok.entry)
    html += cls ? `<span class="${cls}" data-k="${esc(tok.entry!)}">${esc(tok.text)}</span>` : esc(tok.text)
    pos = tok.end
  }
  return html + esc(t.slice(pos))
})

function contextHtml(e: Entry) {
  const r = result.value!
  const span = r.spans[e.sentence]
  if (!span) return ''
  const t = analysedText.value
  const marks = e.tokens.map((i) => r.tokens[i]).filter((tok) => tok.sentence === e.sentence)
  let html = ''
  let pos = span.start
  for (const tok of marks) {
    html += esc(t.slice(pos, tok.start)) + `<mark>${esc(tok.text)}</mark>`
    pos = tok.end
  }
  return (html + esc(t.slice(pos, span.end))).trim()
}
const sentenceText = (e: Entry) => result.value?.sentences[e.sentence] ?? ''

async function jumpTo(ev: MouseEvent) {
  const key = (ev.target as HTMLElement).closest<HTMLElement>('[data-k]')?.dataset.k
  if (!key) return
  filter.value = 'all'
  kind.value = 'all'
  flash.value = key
  await nextTick()
  document.getElementById(rowId(key))?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  setTimeout(() => flash.value === key && (flash.value = ''), 1600)
}
const rowId = (key: string) => 'e-' + key.replace(/[^a-zA-Z0-9]+/g, '-')

/* ---------- Adding words that are not in the dictionary ---------- */
const editing = ref<string | null>(null)
const form = ref({ w: '', vi: '', pos: 'n' as Pos, ipa: '', exVi: '' })
const lookup = ref<{ state: 'idle' | 'loading' | 'done' | 'failed'; definition?: string; translating?: boolean; sentenceFailed?: boolean }>({
  state: 'idle',
})
let lookupRun = 0

function openForm(e: Entry) {
  editing.value = e.key
  form.value = { w: e.head.toLowerCase(), vi: '', pos: 'n', ipa: '', exVi: '' }
  autoFill()
}
/** Pre-fills IPA, part of speech and a Vietnamese meaning; the learner checks them before saving. */
async function autoFill() {
  const run = ++lookupRun
  const word = form.value.w.trim()
  if (!word) return
  lookup.value = { state: 'loading' }
  // A new lookup replaces the previous suggestions, which may belong to a different word.
  form.value = { ...form.value, ipa: '', vi: '' }
  const [en, vi] = await Promise.all([lookupEnglish(word), translateToVi(word, 3)])
  if (run !== lookupRun) return
  if (en?.ipa) form.value.ipa = en.ipa
  if (en?.pos) form.value.pos = en.pos
  if (vi && !form.value.vi.trim()) form.value.vi = vi
  lookup.value = { state: en || vi ? 'done' : 'failed', definition: en?.definition }
}
async function translateSentence(e: Entry) {
  lookup.value = { ...lookup.value, translating: true, sentenceFailed: false }
  const t = await translateToVi(sentenceText(e))
  if (t) form.value.exVi = t
  lookup.value = { ...lookup.value, translating: false, sentenceFailed: !t }
}
async function saveMine(e: Entry) {
  const w = form.value.w.trim()
  const vi = form.value.vi.trim()
  if (!w || !vi) return
  const ipa = form.value.ipa.trim()
  const word = {
    w,
    vi,
    pos: form.value.pos,
    ipa: ipa && !ipa.startsWith('/') ? `/${ipa}/` : ipa,
    ex: sentenceText(e).slice(0, 220),
    exVi: form.value.exVi.trim(),
    lv: '' as const,
  }
  mine.save(word)
  today.add([{ slug: MINE.slug, word }])
  unknown.set(itemKey({ slug: MINE.slug, word }), true)
  editing.value = null
  await loadDict()
  run()
}
const lookupLinks = (w: string) => [
  { label: 'Cambridge', href: `https://dictionary.cambridge.org/dictionary/english-vietnamese/${encodeURIComponent(w)}` },
  { label: 'Google Dịch', href: `https://translate.google.com/?sl=en&tl=vi&op=translate&text=${encodeURIComponent(w)}` },
]

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'none', label: 'Chưa đánh dấu' },
  { value: 'unknown', label: 'Chưa biết' },
  { value: 'known', label: 'Đã biết' },
  { value: 'outside', label: 'Ngoài từ điển' },
]
</script>

<template>
  <div class="vocab analyzer">
    <label for="article-text" class="an-label">Dán đoạn văn hoặc bài viết tiếng Anh</label>
    <textarea
      id="article-text"
      v-model="text"
      class="an-text"
      rows="8"
      placeholder="Dán bài báo, email, tài liệu, comment trong PR… vào đây"
    />
    <div class="an-actions">
      <button type="button" class="vbtn primary" :disabled="!dict || !text.trim()" @click="run">
        {{ dict ? 'Phân tích' : 'Đang tải từ điển…' }}
      </button>
      <button v-if="!text.trim()" type="button" class="vbtn" @click="(text = SAMPLE), run()">Thử với đoạn mẫu</button>
      <button v-else type="button" class="vbtn" @click="(text = ''), (result = null)">Xóa văn bản</button>
      <span v-if="text.length > MAX_CHARS" class="vnote">Chỉ phân tích {{ MAX_CHARS.toLocaleString('vi') }} ký tự đầu.</span>
    </div>

    <template v-if="result">
      <div class="an-summary">
        <span><b>{{ kindCounts.word }}</b> từ đơn</span>
        <span><b>{{ kindCounts.phrase }}</b> cụm từ</span>
        <span class="s-known"><b>{{ counts.known }}</b> đã biết</span>
        <span class="s-unknown"><b>{{ counts.unknown }}</b> chưa biết</span>
        <span><b>{{ counts.none }}</b> chưa đánh dấu</span>
        <span class="s-outside"><b>{{ counts.outside }}</b> ngoài từ điển</span>
      </div>

      <div class="vbar">
        <label class="vcheck"><input id="hide-basic" v-model="hideBasic" type="checkbox" /> Ẩn từ cơ bản (the, of, is…)</label>
        <label class="vcheck"><input id="hide-names" v-model="hideNames" type="checkbox" /> Ẩn tên riêng</label>
        <label class="vcheck"><input id="show-reader" v-model="showReader" type="checkbox" /> Hiện bài viết đã tô màu</label>
      </div>

      <div v-if="showReader" class="an-reader" @click="jumpTo" v-html="readerHtml" />
      <p v-if="showReader" class="an-legend">
        <span class="tk none">chưa đánh dấu</span>
        <span class="tk unknown">chưa biết</span>
        <span class="tk known">đã biết</span>
        <span class="tk none ph">cụm từ</span>
        <span class="tk outside">ngoài từ điển</span>
        · Bấm vào một từ để tới dòng của nó.
      </p>

      <div class="vbar">
        <div class="vseg" role="group" aria-label="Lọc theo loại">
          <button type="button" :aria-pressed="kind === 'all'" @click="kind = 'all'">Tất cả ({{ kindCounts.all }})</button>
          <button type="button" :aria-pressed="kind === 'phrase'" @click="kind = 'phrase'">Cụm từ ({{ kindCounts.phrase }})</button>
          <button type="button" :aria-pressed="kind === 'word'" @click="kind = 'word'">Từ đơn ({{ kindCounts.word }})</button>
        </div>
        <div class="vseg" role="group" aria-label="Lọc theo trạng thái">
          <button v-for="f in FILTERS" :key="f.value" type="button" :aria-pressed="filter === f.value" @click="filter = f.value">
            {{ f.label }} ({{ counts[f.value] }})
          </button>
        </div>
      </div>
      <div class="an-bulk">
        <button v-if="counts.none" type="button" class="vbtn" @click="markRestKnown">
          Đánh dấu {{ counts.none }} từ chưa đánh dấu là "Đã biết"
        </button>
        <button v-if="unknownNotToday.length" type="button" class="vbtn primary" @click="today.add(unknownNotToday)">
          + Thêm {{ unknownNotToday.length }} từ "Chưa biết" vào hôm nay
        </button>
        <span v-else-if="unknownItems.length" class="vnote">✓ Các từ "Chưa biết" đã có trong danh sách hôm nay.</span>
      </div>

      <ol v-if="shown.length" class="vlist">
        <li
          v-for="e in shown"
          :id="rowId(e.key)"
          :key="e.key"
          class="vitem an-row"
          :class="[status(e), { flash: flash === e.key }]"
        >
          <span class="vno">×{{ e.count }}</span>
          <div class="vmain">
            <div class="vhead">
              <span class="vword">{{ primary(e)?.word.w ?? e.head }}</span>
              <SpeakButton :text="primary(e)?.word.w ?? e.head" />
              <span v-if="e.kind === 'phrase'" class="an-chip">cụm từ</span>
              <span v-if="primary(e)?.word.ipa" class="vipa">{{ primary(e)!.word.ipa }}</span>
              <span v-if="primary(e)" class="vpos">{{ POS_LABEL[primary(e)!.word.pos] }}</span>
              <span v-if="primary(e)?.word.lv" class="vlv">{{ primary(e)!.word.lv }}</span>
              <span v-if="e.kind === 'name'" class="an-chip">tên riêng?</span>
            </div>
            <span v-if="primary(e)" class="vres-vi">{{ primary(e)!.word.vi }}</span>
            <span v-for="it in e.items.slice(1)" :key="it.slug" class="an-other">
              {{ topicTitle(it.slug) }}: {{ it.word.vi }}
            </span>
            <span
              v-if="e.forms.some((f) => f.toLowerCase() !== (primary(e)?.word.w ?? e.head).toLowerCase())"
              class="an-forms"
            >
              Trong bài: {{ e.forms.join(', ') }}
            </span>
            <p class="an-context" v-html="contextHtml(e)" />

            <div v-if="status(e) === 'outside'" class="an-outside">
              <template v-if="editing !== e.key">
                <span class="vnote">Chưa có trong từ điển của wiki.</span>
                <a v-for="l in lookupLinks(e.head)" :key="l.label" :href="l.href" target="_blank" rel="noopener">{{ l.label }} ↗</a>
                <button type="button" class="vtoday" @click="openForm(e)">+ Thêm vào Từ của tôi</button>
              </template>
              <form v-else class="an-form" @submit.prevent="saveMine(e)">
                <p class="an-lookup" :class="lookup.state">
                  <template v-if="lookup.state === 'loading'">Đang tra tự động…</template>
                  <template v-else-if="lookup.state === 'done'">
                    Đã điền sẵn gợi ý từ từ điển công khai và MyMemory. Hãy kiểm tra lại trước khi lưu.
                  </template>
                  <template v-else-if="lookup.state === 'failed'">
                    Không tra được tự động. Bạn tự điền, hoặc mở Cambridge / Google Dịch ở trên.
                  </template>
                </p>
                <p v-if="lookup.definition" class="an-def"><b>Định nghĩa (tiếng Anh):</b> {{ lookup.definition }}</p>
                <label>
                  Từ
                  <span class="an-inline">
                    <input v-model="form.w" :id="`mine-w-${rowId(e.key)}`" required />
                    <button type="button" class="vbtn" :disabled="lookup.state === 'loading'" @click="autoFill">Tra lại</button>
                  </span>
                </label>
                <label>Nghĩa tiếng Việt <input v-model="form.vi" :id="`mine-vi-${rowId(e.key)}`" required placeholder="vd: có thể mở rộng" /></label>
                <label>
                  Loại từ
                  <select v-model="form.pos" :id="`mine-pos-${rowId(e.key)}`">
                    <option v-for="(label, p) in POS_LABEL" :key="p" :value="p">{{ label }}</option>
                  </select>
                </label>
                <label>Phiên âm <input v-model="form.ipa" :id="`mine-ipa-${rowId(e.key)}`" placeholder="không bắt buộc" /></label>
                <label class="an-wide">
                  Dịch câu ví dụ (không bắt buộc)
                  <textarea v-model="form.exVi" :id="`mine-exvi-${rowId(e.key)}`" rows="2" />
                </label>
                <div class="quiz-actions">
                  <button type="submit" class="vbtn primary" :disabled="!form.w.trim() || !form.vi.trim()">Lưu và thêm vào hôm nay</button>
                  <button type="button" class="vbtn" :disabled="lookup.translating" @click="translateSentence(e)">
                    {{ lookup.translating ? 'Đang dịch…' : 'Gợi ý dịch câu' }}
                  </button>
                  <button type="button" class="vbtn" @click="editing = null">Hủy</button>
                  <span v-if="lookup.sentenceFailed" class="vnote">Không dịch được câu lúc này.</span>
                </div>
              </form>
            </div>
          </div>
          <div v-if="status(e) !== 'outside'" class="vactions">
            <button type="button" class="vmark an-known" :aria-pressed="status(e) === 'known'" @click="mark(e, 'known')">
              Đã biết
            </button>
            <button type="button" class="vmark an-unknown" :aria-pressed="status(e) === 'unknown'" @click="mark(e, 'unknown')">
              Chưa biết
            </button>
            <button
              type="button"
              class="vtoday"
              :aria-pressed="today.has(primary(e)!.slug, primary(e)!.word.w)"
              @click="today.toggle(primary(e)!.slug, primary(e)!.word.w)"
            >
              {{ today.has(primary(e)!.slug, primary(e)!.word.w) ? '✓ Hôm nay' : '+ Hôm nay' }}
            </button>
          </div>
        </li>
      </ol>
      <p v-else class="vempty">Không có từ nào trong bộ lọc này.</p>
    </template>
  </div>
</template>
