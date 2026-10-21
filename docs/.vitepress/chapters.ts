// Single source of truth for the wiki's structure: the sidebar, the chapter index pages
// and the study-path page are all generated from this list.

export type Level = 'v1' | 'v2' | 'tc'

export interface Section {
  slug: string
  title: string
  /** English title, used by the /en/ version. */
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
    dir: '1-tu-loai',
    title: 'Từ loại',
    en: 'The Parts of Speech',
    intro: 'Nền móng của mọi câu: mỗi từ thuộc loại nào, đứng ở đâu và đổi dạng ra sao.',
    introEn: 'The foundation of every sentence: what kind of word each word is, where it goes and how it changes.',
    sections: [
      { slug: 'tong-quan', title: 'Tổng quan 8 từ loại', titleEn: 'The 8 parts of speech', level: 'v1' },
      { slug: 'dem-duoc-khong-dem-duoc', title: 'Danh từ đếm được & không đếm được', titleEn: 'Countable and uncountable nouns', level: 'v1' },
      { slug: 'so-nhieu', title: 'Số nhiều của danh từ', titleEn: 'Plural nouns', level: 'v1' },
      { slug: 'mao-tu', title: 'Mạo từ a / an / the', titleEn: 'Articles: a / an / the', level: 'v1' },
      { slug: 'dai-tu', title: 'Đại từ', titleEn: 'Pronouns', level: 'v1' },
      { slug: 'tinh-tu-trang-tu', title: 'Tính từ & trạng từ', titleEn: 'Adjectives and adverbs', level: 'v1' },
      { slug: 'gioi-tu-in-on-at', title: 'Giới từ in / on / at', titleEn: 'Prepositions in / on / at', level: 'v1' },
      { slug: 'dong-tu-khiem-khuyet', title: 'Động từ khiếm khuyết cơ bản', titleEn: 'Basic modal verbs', level: 'v1' },
      { slug: 'hoa-hop-chu-ngu-dong-tu', title: 'Hòa hợp chủ ngữ – động từ', titleEn: 'Subject–verb agreement', level: 'v1' },
      { slug: 'so-sanh', title: 'So sánh', titleEn: 'Comparisons', level: 'v2' },
      { slug: 'v-ing-to-v', title: 'V-ing và to V', titleEn: 'V-ing and to V', level: 'v2' },
      { slug: 'so-huu-cach', title: 'Sở hữu cách', titleEn: 'Possessive \'s', level: 'v2' },
      { slug: 'lien-tu', title: 'Liên từ', titleEn: 'Conjunctions', level: 'v2' },
      { slug: 'cac-loai-danh-tu-khac', title: 'Các cách phân loại danh từ khác', titleEn: 'Other ways to classify nouns', level: 'tc' },
    ],
  },
  {
    no: 2,
    dir: '2-thi',
    title: 'Thì',
    en: 'Tenses',
    intro: 'Cách chia động từ theo thời gian (hiện tại, quá khứ, tương lai) và trạng thái của hành động.',
    introEn: 'How verbs change for time (present, past, future) and for how an action unfolds.',
    sections: [
      { slug: 'tong-quan', title: 'Tổng quan 12 thì', titleEn: 'Overview of the 12 tenses', level: 'v1' },
      { slug: 'hien-tai-don', title: 'Hiện tại đơn', titleEn: 'Present simple', level: 'v1' },
      { slug: 'hien-tai-tiep-dien', title: 'Hiện tại tiếp diễn', titleEn: 'Present continuous', level: 'v1' },
      { slug: 'qua-khu-don', title: 'Quá khứ đơn', titleEn: 'Past simple', level: 'v1' },
      { slug: 'tuong-lai-don', title: 'Tương lai đơn & be going to', titleEn: 'Future simple and be going to', level: 'v1' },
      { slug: 'hien-tai-hoan-thanh', title: 'Hiện tại hoàn thành', titleEn: 'Present perfect', level: 'v1' },
      { slug: 'them-duoi-phat-am', title: 'Thêm -s/-es, -ed, -ing & cách phát âm', titleEn: 'Adding -s/-es, -ed, -ing and pronunciation', level: 'v1' },
      { slug: 'qua-khu-tiep-dien', title: 'Quá khứ tiếp diễn', titleEn: 'Past continuous', level: 'v2' },
      { slug: 'qua-khu-hoan-thanh', title: 'Quá khứ hoàn thành', titleEn: 'Past perfect', level: 'v2' },
      { slug: 'hoan-thanh-tiep-dien-tuong-lai', title: 'Các thì hoàn thành tiếp diễn & tương lai khác', titleEn: 'Perfect continuous and other future tenses', level: 'v2' },
      { slug: 'dong-tu-bat-quy-tac', title: 'Động từ bất quy tắc thường gặp', titleEn: 'Common irregular verbs', level: 'tc' },
    ],
  },
  {
    no: 3,
    dir: '3-menh-de-cum-tu',
    title: 'Mệnh đề và cụm từ',
    en: 'Clauses and Phrases',
    intro: 'Ghép nhiều ý thành câu dài: mệnh đề quan hệ, mục đích, nguyên nhân, kết quả, tương phản, wish.',
    introEn: 'Joining ideas into longer sentences: relative clauses, purpose, cause, result, contrast, wish.',
    sections: [
      { slug: 'menh-de-quan-he', title: 'Mệnh đề quan hệ', titleEn: 'Relative clauses', level: 'v2' },
      { slug: 'muc-dich', title: 'Mục đích', titleEn: 'Purpose', level: 'v2' },
      { slug: 'nguyen-nhan-ket-qua', title: 'Nguyên nhân & kết quả', titleEn: 'Cause and result', level: 'v2' },
      { slug: 'tuong-phan', title: 'Tương phản', titleEn: 'Contrast', level: 'v2' },
      { slug: 'wish-if-only', title: 'Wish & if only', titleEn: 'Wish and if only', level: 'v2' },
      { slug: 'menh-de-danh-tu', title: 'Mệnh đề danh từ', titleEn: 'Noun clauses', level: 'v2' },
    ],
  },
  {
    no: 4,
    dir: '4-cau',
    title: 'Câu',
    en: 'Sentences',
    intro: 'Trật tự từ, cách đặt câu hỏi, câu phủ định, câu hỏi đuôi và cách nhấn mạnh.',
    introEn: 'Word order, asking questions, negatives, question tags and emphasis.',
    sections: [
      { slug: 'trat-tu-tu', title: 'Trật tự từ trong câu', titleEn: 'Word order', level: 'v1' },
      { slug: 'phu-dinh-cau-hoi', title: 'Câu phủ định & câu hỏi', titleEn: 'Negatives and questions', level: 'v1' },
      { slug: 'cau-hoi-duoi', title: 'Câu hỏi đuôi', titleEn: 'Question tags', level: 'v2' },
      { slug: 'nhan-manh-dao-ngu', title: 'Câu nhấn mạnh & đảo ngữ', titleEn: 'Emphasis and inversion', level: 'v2' },
    ],
  },
  {
    no: 5,
    dir: '5-cau-dieu-kien',
    title: 'Câu điều kiện',
    en: 'Conditional Sentences',
    intro: 'Nói về điều kiện có thật và các giả định trái với thực tế.',
    introEn: 'Talking about real conditions and imagined ones.',
    sections: [
      { slug: 'cac-loai', title: 'Các loại câu điều kiện', titleEn: 'Types of conditionals', level: 'v2' },
      { slug: 'unless-dao-ngu', title: 'Unless, đảo ngữ & cách khác', titleEn: 'Unless, inversion and other forms', level: 'v2' },
    ],
  },
  {
    no: 6,
    dir: '6-loi-noi-gian-tiep',
    title: 'Lời nói gián tiếp',
    en: 'Indirect Speech',
    intro: 'Thuật lại lời người khác đã nói.',
    introEn: 'Reporting what someone else said.',
    sections: [
      { slug: 'lui-thi', title: 'Nguyên tắc lùi thì & đổi trạng từ', titleEn: 'Backshift and changing time words', level: 'v2' },
      { slug: 'cau-hoi-menh-lenh', title: 'Câu hỏi, mệnh lệnh, đề nghị', titleEn: 'Reported questions, commands and suggestions', level: 'v2' },
    ],
  },
  {
    no: 7,
    dir: '7-bi-dong',
    title: 'Câu bị động',
    en: 'Passive Sentences',
    intro: 'Đưa đối tượng chịu tác động lên làm chủ ngữ thay vì người thực hiện.',
    introEn: 'Putting the thing affected first instead of the person doing the action.',
    sections: [
      { slug: 'cach-chuyen', title: 'Cách chuyển sang bị động', titleEn: 'Forming the passive', level: 'v1' },
      { slug: 'theo-thi', title: 'Bị động theo từng thì', titleEn: 'The passive in each tense', level: 'v1' },
      { slug: 'the-sai-khien', title: 'Thể sai khiến', titleEn: 'The causative', level: 'v2' },
    ],
  },
  {
    no: 8,
    dir: '8-so-luong',
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
    dir: '9-tu-vung-hoc',
    title: 'Từ vựng học',
    en: 'Word Study',
    intro: 'Tạo từ bằng tiền tố, hậu tố; dạng của từ; thành ngữ và văn phong.',
    introEn: 'Building words with prefixes and suffixes; word forms, idioms and style.',
    sections: [
      { slug: 'hau-to', title: 'Hậu tố & họ từ', titleEn: 'Suffixes and word families', level: 'v2' },
      { slug: 'tien-to', title: 'Tiền tố', titleEn: 'Prefixes', level: 'v2' },
      { slug: 'van-phong-thanh-ngu', title: 'Văn phong & thành ngữ', titleEn: 'Style and idioms', level: 'tc' },
    ],
  },
]

export const sectionLink = (c: Chapter, s: Section) => `/${c.dir}/${s.slug}`
export const sectionNo = (c: Chapter, s: Section) => `${c.no}.${c.sections.indexOf(s) + 1}`
