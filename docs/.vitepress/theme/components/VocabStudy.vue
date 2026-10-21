<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { MINE, vocabTopics } from '../../vocabTopics'
import SpeakButton from './SpeakButton.vue'
import VocabCards from './VocabCards.vue'
import { canSpeak, itemKey, POS_LABEL, useLearned, useToday, type Item } from './useVocab'

/** List + flashcards for any set of words: a topic, or today's list. */
const props = defineProps<{ items: Item[]; loading?: boolean; showTopic?: boolean; removable?: boolean }>()
const emit = defineEmits<{ remove: [item: Item] }>()

const mode = ref<'list' | 'cards'>('list')
const filter = ref<'all' | 'todo' | 'done'>('all')
const hideMeaning = ref(false)
const revealed = ref(new Set<string>())
const speechOk = ref(true)
const { learned, toggle } = useLearned()
const today = useToday()
onMounted(() => (speechOk.value = canSpeak()))

const topicTitle = (slug: string) =>
  slug === MINE.slug ? MINE.title : (vocabTopics.find((t) => t.slug === slug)?.title ?? slug)
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
</script>

<template>
  <div class="vocab">
    <div class="vbar">
      <div class="vseg" role="group" aria-label="Chế độ học">
        <button type="button" :aria-pressed="mode === 'list'" @click="mode = 'list'">Danh sách</button>
        <button type="button" :aria-pressed="mode === 'cards'" @click="openCards">Thẻ ghi nhớ</button>
      </div>
      <div class="vseg" role="group" aria-label="Lọc từ">
        <button type="button" :aria-pressed="filter === 'all'" @click="setFilter('all')">Tất cả</button>
        <button type="button" :aria-pressed="filter === 'todo'" @click="setFilter('todo')">Chưa thuộc</button>
        <button type="button" :aria-pressed="filter === 'done'" @click="setFilter('done')">Đã thuộc</button>
      </div>
      <label v-if="mode === 'list'" class="vcheck">
        <input id="hide-meaning" v-model="hideMeaning" type="checkbox" @change="revealed = new Set()" />
        Ẩn nghĩa
      </label>
    </div>

    <div class="vprog">
      <span>Đã thuộc {{ learnedCount }} / {{ items.length || (loading ? '…' : 0) }} từ</span>
      <div class="vprog-bar"><i :style="{ width: items.length ? (learnedCount / items.length) * 100 + '%' : '0' }" /></div>
    </div>
    <p v-if="!speechOk" class="vnote">Trình duyệt này không hỗ trợ đọc phát âm. Hãy thử Chrome, Edge hoặc Safari.</p>

    <slot />

    <p v-if="loading" class="vempty">Đang tải danh sách từ…</p>

    <template v-else-if="mode === 'list'">
      <ol v-if="shown.length" class="vlist">
        <li
          v-for="it in shown"
          :key="itemKey(it)"
          class="vitem"
          :class="{ learned: learned.has(itemKey(it)) }"
        >
          <span class="vno">{{ items.indexOf(it) + 1 }}</span>
          <div class="vmain">
            <div class="vhead">
              <span class="vword">{{ it.word.w }}</span>
              <SpeakButton :text="it.word.w" />
              <span v-if="it.word.ipa" class="vipa">{{ it.word.ipa }}</span>
              <span class="vpos">{{ POS_LABEL[it.word.pos] }}</span>
              <span v-if="it.word.lv" class="vlv">{{ it.word.lv }}</span>
              <a v-if="showTopic" class="vtopic-link" :href="withBase(`/tu-vung/${it.slug}`)">{{ topicTitle(it.slug) }}</a>
            </div>
            <button
              type="button"
              class="vvi"
              :class="{ hidden: isHidden(it) }"
              :disabled="!hideMeaning"
              :aria-label="isHidden(it) ? 'Hiện nghĩa' : undefined"
              @click="reveal(itemKey(it))"
            >
              {{ it.word.vi }}
            </button>
            <div class="vex">
              <span>{{ it.word.ex }}</span>
              <SpeakButton :text="it.word.ex" label="Nghe câu ví dụ" />
            </div>
            <div v-if="it.word.exVi" class="vexvi" :class="{ hidden: isHidden(it) }">{{ it.word.exVi }}</div>
          </div>
          <div class="vactions">
            <button
              type="button"
              class="vtoday"
              :aria-pressed="today.has(it.slug, it.word.w)"
              :title="today.has(it.slug, it.word.w) ? 'Bỏ khỏi danh sách hôm nay' : 'Thêm vào danh sách học hôm nay'"
              @click="today.toggle(it.slug, it.word.w)"
            >
              {{ today.has(it.slug, it.word.w) ? '✓ Hôm nay' : '+ Hôm nay' }}
            </button>
            <button
              type="button"
              class="vmark"
              :aria-pressed="learned.has(itemKey(it))"
              :title="learned.has(itemKey(it)) ? 'Bỏ đánh dấu' : 'Đánh dấu đã thuộc'"
              @click="toggle(itemKey(it))"
            >
              {{ learned.has(itemKey(it)) ? '✓ Đã thuộc' : 'Đã thuộc?' }}
            </button>
            <button v-if="removable" type="button" class="vmark" @click="emit('remove', it)">Xóa</button>
          </div>
        </li>
      </ol>
      <p v-else-if="items.length" class="vempty">Không có từ nào trong bộ lọc này.</p>
    </template>

    <VocabCards v-else :items="deck" :learned="learned" @toggle="toggle" />
  </div>
</template>
