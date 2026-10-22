<script setup lang="ts">
import { computed, ref } from 'vue'
import { activityScore, type DayActivity } from './useActivity'
import { useLocale } from './i18n'
import { localDate } from './useVocab'

const props = defineProps<{ days: Record<string, DayActivity> }>()
const { tr, isEn } = useLocale()

const WEEKS = 53
// Fixed steps rather than relative to the busiest day, so a level means the same thing
// next month as it does today.
const STEPS = [1, 5, 10, 20]
const level = (n: number) => (n === 0 ? 0 : STEPS.filter((s) => n >= s).length)

const today = localDate()
const cells = computed(() => {
  const end = new Date()
  end.setHours(0, 0, 0, 0)
  // Weeks start on Monday; the grid begins on the Monday 52 weeks before this one.
  const start = new Date(end)
  start.setDate(end.getDate() - ((end.getDay() + 6) % 7) - (WEEKS - 1) * 7)
  const out = []
  for (let i = 0; i < WEEKS * 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const key = localDate(d)
    if (key > today) break
    const a = props.days[key]
    const n = activityScore(a)
    out.push({ key, date: d, week: Math.floor(i / 7), row: i % 7, n, a, level: level(n) })
  }
  return out
})

// A month label sits above the week that holds the 1st of that month.
const months = computed(() =>
  cells.value
    .filter((c) => c.date.getDate() === 1)
    .map((c) => ({
      week: c.week,
      label: isEn.value ? c.date.toLocaleDateString('en-US', { month: 'short' }) : `Th${c.date.getMonth() + 1}`,
    })),
)
const weekdays = computed(() => (isEn.value ? ['Mon', '', 'Wed', '', 'Fri', '', ''] : ['T2', '', 'T4', '', 'T6', '', '']))

const activeDays = computed(() => cells.value.filter((c) => c.n > 0))

const fmtDate = (d: Date) =>
  d.toLocaleDateString(isEn.value ? 'en-GB' : 'vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' })
function describe(a: DayActivity | undefined) {
  if (!a || activityScore(a) === 0) return tr('Chưa học')
  const parts = []
  if (a.learned) parts.push(tr('{n} từ thuộc', { n: a.learned }))
  if (a.done) parts.push(tr('{a} câu kiểm tra ({b} đúng)', { a: a.done, b: a.ok }))
  return parts.join(' · ')
}

// One tooltip for the whole grid, moved to whichever cell is under the pointer.
const box = ref<HTMLElement>()
const tip = ref<{ title: string; body: string; x: number; y: number } | null>(null)
function show(e: Event) {
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-i]')
  if (!el || !box.value) return
  const c = cells.value[Number(el.dataset.i)]
  const r = el.getBoundingClientRect()
  const b = box.value.getBoundingClientRect()
  tip.value = { title: fmtDate(c.date), body: describe(c.a), x: r.left - b.left + r.width / 2, y: r.top - b.top }
}
</script>

<template>
  <div ref="box" class="hm-box">
    <div class="hm-scroll">
      <div
        class="hm"
        :style="{ '--weeks': WEEKS }"
        role="img"
        :aria-label="tr('Biểu đồ hoạt động 12 tháng qua: {n} ngày có học', { n: activeDays.length })"
        @mouseover="show"
        @pointerdown="show"
        @mouseleave="tip = null"
      >
        <span v-for="m in months" :key="m.week + m.label" class="hm-month" :style="{ gridColumn: m.week + 2 }">
          {{ m.label }}
        </span>
        <span v-for="(w, i) in weekdays" :key="i" class="hm-wd" :style="{ gridRow: i + 2 }">{{ w }}</span>
        <i
          v-for="(c, i) in cells"
          :key="c.key"
          :data-i="i"
          :class="['hm-cell', `l${c.level}`, { today: c.key === today }]"
          :style="{ gridColumn: c.week + 2, gridRow: c.row + 2 }"
        />
      </div>
    </div>

    <div v-if="tip" class="hm-tip" :style="{ left: tip.x + 'px', top: tip.y + 'px' }" role="status">
      <b>{{ tip.title }}</b>
      <span>{{ tip.body }}</span>
    </div>

    <div class="hm-foot">
      <details class="hm-table">
        <summary>{{ tr('Xem dạng bảng') }}</summary>
        <table v-if="activeDays.length">
          <thead>
            <tr>
              <th>{{ tr('Ngày') }}</th>
              <th>{{ tr('Từ thuộc') }}</th>
              <th>{{ tr('Câu kiểm tra') }}</th>
              <th>{{ tr('Đúng') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in [...activeDays].reverse()" :key="c.key">
              <td>{{ c.date.toLocaleDateString(isEn ? 'en-GB' : 'vi-VN') }}</td>
              <td>{{ c.a?.learned ?? 0 }}</td>
              <td>{{ c.a?.done ?? 0 }}</td>
              <td>{{ c.a?.ok ?? 0 }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="vnote">{{ tr('Chưa có ngày nào có hoạt động.') }}</p>
      </details>
      <span class="hm-legend" aria-hidden="true">
        {{ tr('Ít') }}
        <i v-for="l in 5" :key="l" :class="['hm-cell', `l${l - 1}`]" />
        {{ tr('Nhiều') }}
      </span>
    </div>
  </div>
</template>
