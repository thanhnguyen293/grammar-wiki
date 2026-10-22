import { computed } from 'vue'
import { localDate, useLearned, useQuizLog } from './useVocab'

/** What the learner did on one local date. */
export interface DayActivity {
  /** Words marked as learned that day. */
  learned: number
  /** Quiz answers given, and how many were right. */
  done: number
  ok: number
}

/** One number per day for the heatmap: every learned word and every quiz answer counts. */
export const activityScore = (d: DayActivity | undefined) => (d ? d.learned + d.done : 0)

const DAY = 86_400_000
const addDays = (date: string, n: number) => {
  const [y, m, d] = date.split('-').map(Number)
  return localDate(new Date(y, m - 1, d + n))
}

/** Longest run of consecutive active days, and the run that is still going: it counts up to
    today, or up to yesterday while today has nothing yet, so the streak isn't lost at 7am. */
export function streaks(active: Set<string>, today = localDate()) {
  let longest = 0
  for (const d of active) {
    if (active.has(addDays(d, -1))) continue
    let n = 1
    while (active.has(addDays(d, n))) n++
    longest = Math.max(longest, n)
  }
  let end = active.has(today) ? today : addDays(today, -1)
  let current = 0
  while (active.has(end)) {
    current++
    end = addDays(end, -1)
  }
  return { current, longest }
}

export function useActivity() {
  const { learnedAt } = useLearned()
  const quiz = useQuizLog()

  const days = computed(() => {
    const out: Record<string, DayActivity> = {}
    const day = (d: string) => (out[d] ??= { learned: 0, done: 0, ok: 0 })
    for (const t of Object.values(learnedAt.value)) day(localDate(new Date(t))).learned++
    for (const [d, q] of Object.entries(quiz.log.value)) {
      day(d).done += q.done
      day(d).ok += q.ok
    }
    return out
  })
  const streak = computed(() => streaks(new Set(Object.keys(days.value).filter((d) => activityScore(days.value[d]) > 0))))

  /** Totals over the last `n` days including today. */
  function lastDays(n: number) {
    const from = localDate(new Date(Date.now() - (n - 1) * DAY))
    return Object.entries(days.value)
      .filter(([d]) => d >= from)
      .reduce((s, [, a]) => ({ learned: s.learned + a.learned, done: s.done + a.done, ok: s.ok + a.ok }), {
        learned: 0,
        done: 0,
        ok: 0,
      })
  }

  return { days, streak, lastDays }
}
