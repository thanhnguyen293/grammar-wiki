<script setup lang="ts">
import { useLocale } from './i18n'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import type { RelationKind } from './relations.data'
import SpeakButton from './SpeakButton.vue'
import VocabCards from './VocabCards.vue'
import { useRelations } from './useRelations'
import { canSpeak, itemKey, useLearned, useToday, type Item } from './useVocab'

/** List + flashcards for any set of words: a topic, or today's list. */
const props = defineProps<{ items: Item[]; loading?: boolean; showTopic?: boolean; removable?: boolean }>()
const emit = defineEmits<{ remove: [item: Item] }>()

const mode = ref<'list' | 'cards'>('list')
// Opens on the words still to learn; learned ones are one click away.
const filter = ref<'all' | 'todo' | 'done'>('todo')
const hideMeaning = ref(false)
const revealed = ref(new Set<string>())
const speechOk = ref(true)
const { learned, toggle } = useLearned()
const today = useToday()
onMounted(() => (speechOk.value = canSpeak()))

const learnedCount = computed(() => props.items.filter((i) => learned.value.has(itemKey(i))).length)
const shown = computed(() =>
  props.items.filter((i) => {
    const done = learned.value.has(itemKey(i))
    return filter.value === 'all' || (filter.value === 'done' ? done : !done)
  }),
)
// Cards get a copy of the list, rebuilt only when cards open or the filter changes, so
// marking a card as learned under "Chưa thuộc" does not reshuffle the deck mid-session.
const deck = ref<Item[]>([])
function openCards() {
  deck.value = shown.value.slice()
  mode.value = 'cards'
}
function setFilter(f: typeof filter.value) {
  filter.value = f
  if (mode.value === 'cards') deck.value = shown.value.slice()
}
function reveal(k: string) {
  const next = new Set(revealed.value)
  next.has(k) ? next.delete(k) : next.add(k)
  revealed.value = next
}
const isHidden = (i: Item) => hideMeaning.value && !revealed.value.has(itemKey(i))
const { tr, pos, link, topicTitle } = useLocale()

const relIndex = useRelations()
const KIND_LABEL: Record<RelationKind, string> = { family: 'cùng họ', synonym: 'đồng nghĩa', antonym: 'trái nghĩa' }
const KIND_ORDER = Object.keys(KIND_LABEL) as RelationKind[]
// Relations describe the core sense of a word; a specialist topic may reuse it with another
// meaning (release, bug), so only the word in its own core topic gets them.
const relatedOf = (i: Item) => (relIndex.value.slug[i.word.w] === i.slug ? (relIndex.value.related[i.word.w] ?? []) : [])
const anchor = (w: string) => `w-${w.replace(/\s+/g, '-')}`
const onPage = computed(() => new Set(props.items.map((i) => `${i.slug}:${i.word.w}`)))
const relatedHref = (w: string) => {
  const slug = relIndex.value.slug[w]
  return onPage.value.has(`${slug}:${w}`) ? `#${anchor(w)}` : `${link(`/tu-vung/${slug}`)}#${anchor(w)}`
}
/** The "Liên quan" line: related words grouped by kind. */
const relatedLine = (i: Item) => {
  const rel = relatedOf(i)
  return KIND_ORDER.map((kind) => ({ kind, words: rel.filter((r) => r.kind === kind).map((r) => r.w) }))
    .filter((g) => g.words.length)
}

// Related words are always grouped. Grouping only changes the order on screen: each group keeps
// the place of its most common word, and the related words of the same topic follow it.
// Numbers stay the frequency rank.
const rows = computed(() => {
  const placed = new Set<Item>()
  const out: { it: Item; kind?: RelationKind }[] = []
  for (const it of shown.value) {
    if (placed.has(it)) continue
    placed.add(it)
    out.push({ it })
    // Family first, then synonyms, then antonyms; each by frequency.
    const kinds = new Map(relatedOf(it).map((r) => [r.w, r.kind]))
    const rank = (o: Item) => KIND_ORDER.indexOf(kinds.get(o.word.w) ?? 'family')
    const follow = shown.value.filter((o) => kinds.has(o.word.w) && o.slug === it.slug && !placed.has(o))
    for (const o of follow.sort((a, b) => rank(a) - rank(b))) {
      placed.add(o)
      out.push({ it: o, kind: kinds.get(o.word.w) })
    }
  }
  return out
})

// Links from another topic point at a word (#w-friendly); the list renders only after the
// words load, so the browser's own jump to the anchor has already missed it.
watch(
  () => props.loading,
  async (now, before) => {
    if (before && !now && location.hash.startsWith('#w-')) {
      await nextTick()
      document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView()
    }
  },
)
</script>

<template>
  <div class="vocab">
    <!-- Stays under the site header while the list scrolls. -->
    <div class="vsticky">
      <div class="vbar">
        <div class="vseg" role="group" :aria-label="tr('Chế độ học')">
          <button type="button" :aria-pressed="mode === 'list'" @click="mode = 'list'">{{ tr('Danh sách') }}</button>
          <button type="button" :aria-pressed="mode === 'cards'" @click="openCards">{{ tr('Thẻ ghi nhớ') }}</button>
        </div>
        <div class="vseg" role="group" :aria-label="tr('Lọc từ')">
          <button type="button" :aria-pressed="filter === 'all'" @click="setFilter('all')">{{ tr('Tất cả') }}</button>
          <button type="button" :aria-pressed="filter === 'todo'" @click="setFilter('todo')">{{ tr('Chưa thuộc') }}</button>
          <button type="button" :aria-pressed="filter === 'done'" @click="setFilter('done')">{{ tr('Đã thuộc') }}</button>
        </div>
        <label v-if="mode === 'list'" class="vcheck">
          <input id="hide-meaning" v-model="hideMeaning" type="checkbox" @change="revealed = new Set()" />
          {{ tr('Ẩn nghĩa') }}
        </label>
        <span class="vbar-count" :aria-label="tr('Đã thuộc {a} / {b} từ', { a: learnedCount, b: items.length })" :title="tr('Đã thuộc {a} / {b} từ', { a: learnedCount, b: items.length })">
          {{ learnedCount }}/{{ items.length || (loading ? '…' : 0) }}
        </span>
      </div>
    </div>

    <p v-if="!speechOk" class="vnote">{{ tr('Trình duyệt này không hỗ trợ đọc phát âm. Hãy thử Chrome, Edge hoặc Safari.') }}</p>

    <slot />

    <p v-if="loading" class="vempty">{{ tr('Đang tải danh sách từ…') }}</p>

    <template v-else-if="mode === 'list'">
      <ol v-if="shown.length" class="vlist">
        <li
          v-for="{ it, kind } in rows"
          :id="relatedOf(it).length ? anchor(it.word.w) : undefined"
          :key="itemKey(it)"
          class="vitem"
          :class="{ learned: learned.has(itemKey(it)), 'vrel-follow': kind }"
        >
          <span class="vno">{{ items.indexOf(it) + 1 }}</span>
          <div class="vmain">
            <div class="vhead">
              <span class="vword">{{ it.word.w }}</span>
              <SpeakButton :text="it.word.w" />
              <span v-if="it.word.ipa" class="vipa">{{ it.word.ipa }}</span>
              <span class="vpos">{{ pos[it.word.pos] }}</span>
              <span v-if="kind" class="vrel-tag" :class="kind">{{ tr(KIND_LABEL[kind]) }}</span>
              <a v-if="showTopic" class="vtopic-link" :href="link(`/tu-vung/${it.slug}`)">{{ topicTitle(it.slug) }}</a>
            </div>
            <button
              type="button"
              class="vvi"
              :class="{ hidden: isHidden(it) }"
              :disabled="!hideMeaning"
              :aria-label="isHidden(it) ? tr('Hiện nghĩa') : undefined"
              @click="reveal(itemKey(it))"
            >
              {{ it.word.vi }}
            </button>
            <div class="vex">
              <span>{{ it.word.ex }}</span>
              <SpeakButton :text="it.word.ex" :label="tr('Nghe câu ví dụ')" />
            </div>
            <div v-if="it.word.exVi" class="vexvi" :class="{ hidden: isHidden(it) }">{{ it.word.exVi }}</div>
            <p v-if="relatedOf(it).length" class="vrel">
              <span class="vrel-label">{{ tr('Liên quan:') }}</span>
              <span v-for="g in relatedLine(it)" :key="g.kind" class="vrel-group">
                <span class="vrel-kind">{{ tr(KIND_LABEL[g.kind]) }}</span>
                <template v-for="(w, n) in g.words" :key="w">
                  <a :href="relatedHref(w)" :title="topicTitle(relIndex.slug[w])">{{ w }}</a>
                  <template v-if="n < g.words.length - 1">, </template>
                </template>
              </span>
            </p>
          </div>
          <div class="vactions">
            <button
              type="button"
              class="vtoday"
              :aria-pressed="today.has(it.slug, it.word.w)"
              :title="today.has(it.slug, it.word.w) ? tr('Bỏ khỏi danh sách hôm nay') : tr('Thêm vào danh sách học hôm nay')"
              @click="today.toggle(it.slug, it.word.w)"
            >
              {{ tr(today.has(it.slug, it.word.w) ? '✓ Hôm nay' : '+ Hôm nay') }}
            </button>
            <button
              type="button"
              class="vmark"
              :aria-pressed="learned.has(itemKey(it))"
              :title="tr(learned.has(itemKey(it)) ? 'Bỏ đánh dấu' : 'Đánh dấu đã thuộc')"
              @click="toggle(itemKey(it))"
            >
              {{ tr(learned.has(itemKey(it)) ? '✓ Đã thuộc' : 'Đã thuộc?') }}
            </button>
            <button v-if="removable" type="button" class="vmark" @click="emit('remove', it)">{{ tr('Xóa') }}</button>
          </div>
        </li>
      </ol>
      <p v-else-if="items.length" class="vempty">{{ tr('Không có từ nào trong bộ lọc này.') }}</p>
    </template>

    <VocabCards v-else :items="deck" :learned="learned" @toggle="toggle" />
  </div>
</template>
