// The learner's progress as one mergeable document, used to sync between devices. Pure
// functions only. Each entry carries the time it last changed, so two devices can be merged
// entry by entry and the most recent change wins, including removals.
import type { QuizDay, Word } from './useVocab'

/** Positive: on since that time (epoch ms). Negative: switched off at that time. */
export type Stamp = number

export interface SyncState {
  v: 1
  learned: Record<string, Stamp>
  unknown: Record<string, Stamp>
  /** "Hôm nay học" lists per local date; an empty list means the day was cleared. */
  days: Record<string, { refs: string[]; at: number }>
  /** The learner's own words; `word: null` means it was deleted. */
  mine: Record<string, { word: Word | null; at: number }>
  quiz: Record<string, QuizDay>
}

export const emptyState = (): SyncState => ({ v: 1, learned: {}, unknown: {}, days: {}, mine: {}, quiz: {} })

function mergeStamps(a: Record<string, Stamp>, b: Record<string, Stamp>) {
  const out = { ...a }
  for (const [k, v] of Object.entries(b)) {
    const cur = out[k]
    // Later change wins; on a tie "on" wins so nothing learned is lost.
    if (cur === undefined || Math.abs(v) > Math.abs(cur) || (Math.abs(v) === Math.abs(cur) && v > cur)) out[k] = v
  }
  return out
}

function mergeByTime<T extends { at: number }>(a: Record<string, T>, b: Record<string, T>) {
  const out = { ...a }
  for (const [k, v] of Object.entries(b)) if (!out[k] || v.at > out[k].at) out[k] = v
  return out
}

/** Quiz counts only grow during a day, so the larger count from either device is kept. */
function mergeQuiz(a: Record<string, QuizDay>, b: Record<string, QuizDay>) {
  const out = { ...a }
  for (const [d, q] of Object.entries(b)) {
    const cur = out[d]
    out[d] = cur ? { done: Math.max(cur.done, q.done), ok: Math.max(cur.ok, q.ok) } : q
  }
  return out
}

export function mergeState(a: SyncState, b: SyncState): SyncState {
  return {
    v: 1,
    learned: mergeStamps(a.learned, b.learned),
    unknown: mergeStamps(a.unknown, b.unknown),
    days: mergeByTime(a.days, b.days),
    mine: mergeByTime(a.mine, b.mine),
    quiz: mergeQuiz(a.quiz, b.quiz),
  }
}

/** JSON with sorted keys, so two equal states always serialise to the same string. */
export function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    return `{${Object.keys(obj)
      .sort()
      .filter((k) => obj[k] !== undefined)
      .map((k) => `${JSON.stringify(k)}:${canonical(obj[k])}`)
      .join(',')}}`
  }
  return JSON.stringify(value)
}

export function parseState(raw: unknown): SyncState {
  const s = typeof raw === 'string' ? JSON.parse(raw) : raw
  const e = emptyState()
  if (!s || typeof s !== 'object') return e
  return {
    v: 1,
    learned: s.learned ?? e.learned,
    unknown: s.unknown ?? e.unknown,
    days: s.days ?? e.days,
    mine: s.mine ?? e.mine,
    quiz: s.quiz ?? e.quiz,
  }
}
