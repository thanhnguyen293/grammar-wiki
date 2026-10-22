<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useLocale } from './i18n'
import { format, usePomodoro, type PomodoroMode } from './usePomodoro'

const { state, left, total, today, start, pause, reset, setMode, skip, updateSettings } = usePomodoro()
const { tr } = useLocale()
const open = ref(false)
const showSettings = ref(false)
const root = ref<HTMLElement>()

const MODES: { value: PomodoroMode; label: string }[] = [
  { value: 'focus', label: 'Tập trung' },
  { value: 'short', label: 'Nghỉ ngắn' },
  { value: 'long', label: 'Nghỉ dài' },
]
// The top bar shows the time only once a session has started; an idle timer is just an icon.
const active = computed(() => state.running || left.value < total.value)
const progress = computed(() => (total.value ? 1 - left.value / total.value : 0))
// Which focus session of the cycle we are in, or just finished during a break.
const cycleStep = computed(() => {
  const every = state.settings.longEvery
  return state.mode === 'focus' ? (state.round % every) + 1 : state.round % every || every
})
const R = 15.5
const CIRC = 2 * Math.PI * R

function onDocClick(e: MouseEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) open.value = false
}
const onKey = (e: KeyboardEvent) => e.key === 'Escape' && (open.value = false)
onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})

const setNumber = (key: 'focus' | 'short' | 'long' | 'longEvery', e: Event, max: number) => {
  const n = Math.round(Number((e.target as HTMLInputElement).value))
  if (n >= 1 && n <= max) updateSettings({ [key]: n })
}
</script>

<template>
  <div ref="root" class="pomo">
    <button
      type="button"
      class="pomo-btn"
      :class="[state.mode, { running: state.running, active }]"
      :aria-label="tr('Đồng hồ Pomodoro')"
      :aria-expanded="open"
      :title="tr('Đồng hồ Pomodoro')"
      @click="open = !open"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <circle cx="12" cy="13" r="8" fill="none" stroke="currentColor" stroke-width="1.8" />
        <path d="M12 9v4l2.5 2M9.5 2.5h5M12 2.5V5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      </svg>
      <span v-if="active" class="pomo-time">{{ format(left) }}</span>
    </button>

    <div v-if="open" class="pomo-panel" role="dialog" :aria-label="tr('Đồng hồ Pomodoro')">
      <div class="vseg pomo-modes" role="group" :aria-label="tr('Chế độ')">
        <button v-for="m in MODES" :key="m.value" type="button" :aria-pressed="state.mode === m.value" @click="setMode(m.value)">
          {{ tr(m.label) }}
        </button>
      </div>

      <div class="pomo-dial" :class="state.mode">
        <svg viewBox="0 0 36 36" aria-hidden="true">
          <circle cx="18" cy="18" :r="R" class="pomo-track" />
          <circle
            cx="18"
            cy="18"
            :r="R"
            class="pomo-fill"
            :stroke-dasharray="CIRC"
            :stroke-dashoffset="CIRC * (1 - progress)"
          />
        </svg>
        <span class="pomo-big">{{ format(left) }}</span>
      </div>

      <div class="pomo-actions">
        <button v-if="!state.running" type="button" class="vbtn primary" @click="start">
          {{ tr(left < total ? 'Tiếp tục' : 'Bắt đầu') }}
        </button>
        <button v-else type="button" class="vbtn primary" @click="pause">{{ tr('Tạm dừng') }}</button>
        <button type="button" class="vbtn" :disabled="!active" @click="reset">{{ tr('Đặt lại') }}</button>
        <button type="button" class="vbtn" @click="skip">{{ tr('Bỏ qua') }}</button>
      </div>

      <p class="pomo-stats">
        {{ tr('Hôm nay: {n} phiên tập trung', { n: today }) }} ·
        {{ tr('Vòng {a}/{b}', { a: cycleStep, b: state.settings.longEvery }) }}
      </p>

      <button type="button" class="pomo-settings-toggle" :aria-expanded="showSettings" @click="showSettings = !showSettings">
        {{ tr('Cài đặt') }} {{ showSettings ? '▴' : '▾' }}
      </button>
      <div v-if="showSettings" class="pomo-settings">
        <label>
          {{ tr('Tập trung (phút)') }}
          <input id="pomo-focus" type="number" min="1" max="120" :value="state.settings.focus" @change="setNumber('focus', $event, 120)" />
        </label>
        <label>
          {{ tr('Nghỉ ngắn (phút)') }}
          <input id="pomo-short" type="number" min="1" max="60" :value="state.settings.short" @change="setNumber('short', $event, 60)" />
        </label>
        <label>
          {{ tr('Nghỉ dài (phút)') }}
          <input id="pomo-long" type="number" min="1" max="60" :value="state.settings.long" @change="setNumber('long', $event, 60)" />
        </label>
        <label>
          {{ tr('Nghỉ dài sau (phiên)') }}
          <input id="pomo-every" type="number" min="1" max="12" :value="state.settings.longEvery" @change="setNumber('longEvery', $event, 12)" />
        </label>
        <label class="pomo-check">
          <input id="pomo-auto" type="checkbox" :checked="state.settings.autoStart" @change="updateSettings({ autoStart: ($event.target as HTMLInputElement).checked })" />
          {{ tr('Tự chuyển sang phiên tiếp theo') }}
        </label>
      </div>
    </div>
  </div>
</template>
