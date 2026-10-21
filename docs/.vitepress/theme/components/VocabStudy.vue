<script setup lang="ts">
import { useLocale } from './i18n'
import { computed, onMounted, ref } from 'vue'
import SpeakButton from './SpeakButton.vue'
import VocabCards from './VocabCards.vue'
import { canSpeak, itemKey, useLearned, useToday, type Item } from './useVocab'

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
      </div>

      <div class="vprog">
        <span>{{ tr('Đã thuộc {a} / {b} từ', { a: learnedCount, b: items.length || (loading ? '…' : 0) }) }}</span>
        <div class="vprog-bar"><i :style="{ width: items.length ? (learnedCount / items.length) * 100 + '%' : '0' }" /></div>
      </div>
    </div>

    <p v-if="!speechOk" class="vnote">{{ tr('Trình duyệt này không hỗ trợ đọc phát âm. Hãy thử Chrome, Edge hoặc Safari.') }}</p>

    <slot />

    <p v-if="loading" class="vempty">{{ tr('Đang tải danh sách từ…') }}</p>

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
              <span class="vpos">{{ pos[it.word.pos] }}</span>
              <span v-if="it.word.lv" class="vlv">{{ it.word.lv }}</span>
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
