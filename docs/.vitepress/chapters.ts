// Single source of truth for the wiki's structure: the sidebar, the chapter index pages
// and the study-path page are all generated from this list.

export type Level = 'v1' | 'v2' | 'tc'

export interface Section {
  slug: string
  title: string
  /** English title, used by the English version (the site root). */
  titleEn: string
  level: Level
}

export interface Chapter {
  no: number
  dir: string
  title: string
  en: string
  intro: string
  introEn: string
  sections: Section[]
}

export const LEVEL_LABEL: Record<Level, string> = {
  v1: 'Vòng 1',
  v2: 'Vòng 2',
  tc: 'Tra cứu',
}

export const LEVEL_LABEL_EN: Record<Level, string> = {
  v1: 'Round 1',
  v2: 'Round 2',
  tc: 'Reference',
}

export const chapters: Chapter[] = [
  {
    no: 1,
    dir: 'parts-of-speech',
    title: 'Từ loại',
    en: 'The Parts of Speech',
    intro: 'Nền móng của mọi câu: mỗi từ thuộc loại nào, đứng ở đâu và đổi dạng ra sao.',
    introEn: 'The foundation of every sentence: what kind of word each word is, where it goes and how it changes.',
    sections: [
      { slug: 'overview', title: 'Tổng quan 8 từ loại', titleEn: 'The 8 parts of speech', level: 'v1' },
      { slug: 'countable-uncountable', title: 'Danh từ đếm được & không đếm được', titleEn: 'Countable and uncountable nouns', level: 'v1' },
      { slug: 'plurals', title: 'Số nhiều của danh từ', titleEn: 'Plural nouns', level: 'v1' },
      { slug: 'articles', title: 'Mạo từ a / an / the', titleEn: 'Articles: a / an / the', level: 'v1' },
      { slug: 'pronouns', title: 'Đại từ', titleEn: 'Pronouns', level: 'v1' },
      { slug: 'adjectives-adverbs', title: 'Tính từ & trạng từ', titleEn: 'Adjectives and adverbs', level: 'v1' },
      { slug: 'in-on-at', title: 'Giới từ in / on / at', titleEn: 'Prepositions in / on / at', level: 'v1' },
      { slug: 'modal-verbs', title: 'Động từ khiếm khuyết cơ bản', titleEn: 'Basic modal verbs', level: 'v1' },
      { slug: 'subject-verb-agreement', title: 'Hòa hợp chủ ngữ – động từ', titleEn: 'Subject–verb agreement', level: 'v1' },
      { slug: 'comparisons', title: 'So sánh', titleEn: 'Comparisons', level: 'v2' },
      { slug: 'gerunds-infinitives', title: 'V-ing và to V', titleEn: 'V-ing and to V', level: 'v2' },
      { slug: 'possessives', title: 'Sở hữu cách', titleEn: 'Possessive \'s', level: 'v2' },
      { slug: 'conjunctions', title: 'Liên từ', titleEn: 'Conjunctions', level: 'v2' },
      { slug: 'noun-types', title: 'Các cách phân loại danh từ khác', titleEn: 'Other ways to classify nouns', level: 'tc' },
    ],
  },
  {
    no: 2,
    dir: 'tenses',
    title: 'Thì',
    en: 'Tenses',
    intro: 'Cách chia động từ theo thời gian (hiện tại, quá khứ, tương lai) và trạng thái của hành động.',
    introEn: 'How verbs change for time (present, past, future) and for how an action unfolds.',
    sections: [
      { slug: 'overview', title: 'Tổng quan 12 thì', titleEn: 'Overview of the 12 tenses', level: 'v1' },
      { slug: 'present-simple', title: 'Hiện tại đơn', titleEn: 'Present simple', level: 'v1' },
      { slug: 'present-continuous', title: 'Hiện tại tiếp diễn', titleEn: 'Present continuous', level: 'v1' },
      { slug: 'past-simple', title: 'Quá khứ đơn', titleEn: 'Past simple', level: 'v1' },
      { slug: 'future-simple', title: 'Tương lai đơn & be going to', titleEn: 'Future simple and be going to', level: 'v1' },
      { slug: 'present-perfect', title: 'Hiện tại hoàn thành', titleEn: 'Present perfect', level: 'v1' },
      { slug: 'endings-pronunciation', title: 'Thêm -s/-es, -ed, -ing & cách phát âm', titleEn: 'Adding -s/-es, -ed, -ing and pronunciation', level: 'v1' },
      { slug: 'past-continuous', title: 'Quá khứ tiếp diễn', titleEn: 'Past continuous', level: 'v2' },
      { slug: 'past-perfect', title: 'Quá khứ hoàn thành', titleEn: 'Past perfect', level: 'v2' },
      { slug: 'perfect-continuous-future', title: 'Các thì hoàn thành tiếp diễn & tương lai khác', titleEn: 'Perfect continuous and other future tenses', level: 'v2' },
      { slug: 'irregular-verbs', title: 'Động từ bất quy tắc thường gặp', titleEn: 'Common irregular verbs', level: 'tc' },
    ],
  },
  {
    no: 3,
    dir: 'clauses-and-phrases',
    title: 'Mệnh đề và cụm từ',
    en: 'Clauses and Phrases',
    intro: 'Ghép nhiều ý thành câu dài: mệnh đề quan hệ, mục đích, nguyên nhân, kết quả, tương phản, wish.',
    introEn: 'Joining ideas into longer sentences: relative clauses, purpose, cause, result, contrast, wish.',
    sections: [
      { slug: 'relative-clauses', title: 'Mệnh đề quan hệ', titleEn: 'Relative clauses', level: 'v2' },
      { slug: 'purpose', title: 'Mục đích', titleEn: 'Purpose', level: 'v2' },
      { slug: 'cause-result', title: 'Nguyên nhân & kết quả', titleEn: 'Cause and result', level: 'v2' },
      { slug: 'contrast', title: 'Tương phản', titleEn: 'Contrast', level: 'v2' },
      { slug: 'wish-if-only', title: 'Wish & if only', titleEn: 'Wish and if only', level: 'v2' },
      { slug: 'noun-clauses', title: 'Mệnh đề danh từ', titleEn: 'Noun clauses', level: 'v2' },
    ],
  },
  {
    no: 4,
    dir: 'sentences',
    title: 'Câu',
    en: 'Sentences',
    intro: 'Trật tự từ, cách đặt câu hỏi, câu phủ định, câu hỏi đuôi và cách nhấn mạnh.',
    introEn: 'Word order, asking questions, negatives, question tags and emphasis.',
    sections: [
      { slug: 'word-order', title: 'Trật tự từ trong câu', titleEn: 'Word order', level: 'v1' },
      { slug: 'negatives-questions', title: 'Câu phủ định & câu hỏi', titleEn: 'Negatives and questions', level: 'v1' },
      { slug: 'question-tags', title: 'Câu hỏi đuôi', titleEn: 'Question tags', level: 'v2' },
      { slug: 'emphasis-inversion', title: 'Câu nhấn mạnh & đảo ngữ', titleEn: 'Emphasis and inversion', level: 'v2' },
    ],
  },
  {
    no: 5,
    dir: 'conditionals',
    title: 'Câu điều kiện',
    en: 'Conditional Sentences',
    intro: 'Nói về điều kiện có thật và các giả định trái với thực tế.',
    introEn: 'Talking about real conditions and imagined ones.',
    sections: [
      { slug: 'types', title: 'Các loại câu điều kiện', titleEn: 'Types of conditionals', level: 'v2' },
      { slug: 'unless-inversion', title: 'Unless, đảo ngữ & cách khác', titleEn: 'Unless, inversion and other forms', level: 'v2' },
    ],
  },
  {
    no: 6,
    dir: 'reported-speech',
    title: 'Lời nói gián tiếp',
    en: 'Indirect Speech',
    intro: 'Thuật lại lời người khác đã nói.',
    introEn: 'Reporting what someone else said.',
    sections: [
      { slug: 'backshift', title: 'Nguyên tắc lùi thì & đổi trạng từ', titleEn: 'Backshift and changing time words', level: 'v2' },
      { slug: 'questions-commands', title: 'Câu hỏi, mệnh lệnh, đề nghị', titleEn: 'Reported questions, commands and suggestions', level: 'v2' },
    ],
  },
  {
    no: 7,
    dir: 'passive',
    title: 'Câu bị động',
    en: 'Passive Sentences',
    intro: 'Đưa đối tượng chịu tác động lên làm chủ ngữ thay vì người thực hiện.',
    introEn: 'Putting the thing affected first instead of the person doing the action.',
    sections: [
      { slug: 'forming', title: 'Cách chuyển sang bị động', titleEn: 'Forming the passive', level: 'v1' },
      { slug: 'by-tense', title: 'Bị động theo từng thì', titleEn: 'The passive in each tense', level: 'v1' },
      { slug: 'causative', title: 'Thể sai khiến', titleEn: 'The causative', level: 'v2' },
    ],
  },
  {
    no: 8,
    dir: 'quantity',
    title: 'Sự diễn tả về số lượng',
    en: 'Expression of Quantity',
    intro: 'Diễn đạt nhiều, ít, tất cả, mỗi, cả hai.',
    introEn: 'Saying how much or how many: a lot, a little, all, each, both.',
    sections: [
      { slug: 'some-any-much-many', title: 'some / any · much / many / a lot of', titleEn: 'some / any · much / many / a lot of', level: 'v1' },
      { slug: 'few-little', title: 'few / a few · little / a little', titleEn: 'few / a few · little / a little', level: 'v1' },
      { slug: 'all-most-every-each', title: 'all / most / every / each / both…', titleEn: 'all / most / every / each / both…', level: 'v1' },
    ],
  },
  {
    no: 9,
    dir: 'word-study',
    title: 'Từ vựng học',
    en: 'Word Study',
    intro: 'Tạo từ bằng tiền tố, hậu tố; dạng của từ; thành ngữ và văn phong.',
    introEn: 'Building words with prefixes and suffixes; word forms, idioms and style.',
    sections: [
      { slug: 'suffixes', title: 'Hậu tố & họ từ', titleEn: 'Suffixes and word families', level: 'v2' },
      { slug: 'prefixes', title: 'Tiền tố', titleEn: 'Prefixes', level: 'v2' },
      { slug: 'style-idioms', title: 'Văn phong & thành ngữ', titleEn: 'Style and idioms', level: 'tc' },
    ],
  },
]

export const sectionLink = (c: Chapter, s: Section) => `/${c.dir}/${s.slug}`
export const sectionNo = (c: Chapter, s: Section) => `${c.no}.${c.sections.indexOf(s) + 1}`
