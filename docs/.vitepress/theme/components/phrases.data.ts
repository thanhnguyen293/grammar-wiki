// Build-time list of each workplace lesson's key phrases, read from the "Mẫu câu" section of the
// Vietnamese lesson (the English page has the same sentences). PhraseDrill turns the bold part
// of each sentence into a blank, so the exercises follow the lesson text without a copy.
import { readFileSync } from 'node:fs'
import { basename } from 'node:path'

export interface Phrase {
  /** The English sentence with ** around the parts to fill in. */
  en: string
  vi: string
}

declare const data: Record<string, Phrase[]>
export { data }

export default {
  watch: ['../../../vi/workplace/*.md'],
  load(files: string[]): Record<string, Phrase[]> {
    const out: Record<string, Phrase[]> = {}
    for (const file of files) {
      const lesson = basename(file, '.md')
      if (lesson === 'index') continue
      const section = readFileSync(file, 'utf8').split(/^## Mẫu câu$/m)[1]?.split(/^## /m)[0] ?? ''
      // "- English sentence<br>*Vietnamese meaning*", with at least one bold part to blank out.
      out[lesson] = [...section.matchAll(/^- (.*\*\*.+?\*\*.*)<br>\*(.+)\*\s*$/gm)].map((m) => ({ en: m[1].trim(), vi: m[2].trim() }))
    }
    return out
  },
}
