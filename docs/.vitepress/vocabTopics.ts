// Vocabulary topics, in the order a beginner should meet them. Each topic's words live in
// docs/data/vocab/<slug>.json, grouped by meaning (related words side by side), the most
// common groups first.

export interface VocabTopic {
  /** Stable id: names the data file and is stored with the learner's progress (in the browser
      and in Firestore), so it never changes. */
  slug: string
  /** URL of the topic page, under /vocabulary/. */
  path: string
  title: string
  en: string
  /** Shorter English name for the sidebar, where the full one would wrap. */
  short?: string
  /** Planned number of words; scripts/check-vocab.mjs checks the data against it. */
  target: number
  /** Specialist topics sit outside the 3000 core words: they may reuse a core word with its
      specialist meaning (bug, branch, release), so their progress is tracked separately.
      'work' topics hold the words of one workplace lesson. */
  track?: 'it' | 'phrase' | 'work'
}

export const vocabTopics: VocabTopic[] = [
  { slug: 'con-nguoi-gia-dinh', path: 'people-family', title: 'Con người & gia đình', en: 'People & family', target: 100 },
  { slug: 'dong-tu-hang-ngay', path: 'everyday-verbs', title: 'Động từ hành động thường gặp', en: 'Everyday action verbs', target: 200 },
  { slug: 'tinh-tu-mo-ta', path: 'describing-adjectives', title: 'Tính từ mô tả thường gặp', en: 'Common describing adjectives', short: 'Describing adjectives', target: 170 },
  { slug: 'tu-chuc-nang', path: 'function-words', title: 'Từ chức năng', en: 'Pronouns, prepositions, conjunctions, determiners', short: 'Function words', target: 150 },
  { slug: 'thoi-gian', path: 'time', title: 'Thời gian & lịch', en: 'Time & calendar', target: 80 },
  { slug: 'so-luong-do-luong', path: 'numbers-measurement', title: 'Số đếm, số lượng & đo lường', en: 'Numbers, quantity & measurement', short: 'Numbers & measurement', target: 90 },
  { slug: 'an-uong', path: 'food-drink', title: 'Ăn uống', en: 'Food & drink', target: 120 },
  { slug: 'nha-cua-do-dung', path: 'home', title: 'Nhà cửa & đồ dùng', en: 'Home & household objects', short: 'Home & household', target: 110 },
  { slug: 'quan-ao-mua-sam', path: 'clothes-shopping', title: 'Quần áo & mua sắm', en: 'Clothes & shopping', target: 100 },
  { slug: 'co-the-suc-khoe', path: 'body-health', title: 'Cơ thể & sức khỏe', en: 'Body & health', target: 110 },
  { slug: 'cam-xuc-tinh-cach', path: 'feelings-personality', title: 'Cảm xúc & tính cách', en: 'Feelings & personality', target: 110 },
  { slug: 'mau-sac-hinh-dang-chat-lieu', path: 'colours-shapes-materials', title: 'Màu sắc, hình dạng & chất liệu', en: 'Colours, shapes & materials', target: 60 },
  { slug: 'thanh-pho-dia-diem', path: 'town-places', title: 'Thành phố & địa điểm', en: 'Town & places', target: 100 },
  { slug: 'giao-thong-du-lich', path: 'transport-travel', title: 'Giao thông & du lịch', en: 'Transport & travel', target: 100 },
  { slug: 'thoi-tiet-thien-nhien', path: 'weather-nature', title: 'Thời tiết & thiên nhiên', en: 'Weather & nature', target: 110 },
  { slug: 'dong-vat-cay-coi', path: 'animals-plants', title: 'Động vật & cây cối', en: 'Animals & plants', target: 80 },
  { slug: 'truong-hoc', path: 'school', title: 'Trường học & học tập', en: 'School & learning', target: 110 },
  { slug: 'cong-viec-nghe-nghiep', path: 'work-jobs', title: 'Công việc & nghề nghiệp', en: 'Work & jobs', target: 120 },
  { slug: 'tien-kinh-doanh', path: 'money-business', title: 'Tiền bạc & kinh doanh', en: 'Money & business', target: 120 },
  { slug: 'cong-nghe-truyen-thong', path: 'technology-media', title: 'Công nghệ & truyền thông', en: 'Technology & media', target: 110 },
  { slug: 'giai-tri-the-thao', path: 'free-time-sport', title: 'Giải trí, thể thao & sở thích', en: 'Free time, sport & hobbies', target: 100 },
  { slug: 'giao-tiep-ngon-ngu', path: 'communication', title: 'Giao tiếp & ngôn ngữ', en: 'Communication & language', target: 90 },
  { slug: 'dong-tu-tu-duy', path: 'thinking-verbs', title: 'Động từ tư duy & cảm nhận', en: 'Thinking & sensing verbs', target: 90 },
  { slug: 'trang-tu', path: 'adverbs', title: 'Trạng từ', en: 'Adverbs of degree, frequency & manner', short: 'Adverbs', target: 90 },
  { slug: 'khai-niem-chung', path: 'general-ideas', title: 'Khái niệm chung', en: 'General ideas (problem, reason, way…)', short: 'General ideas', target: 120 },
  { slug: 'nghe-thuat-van-hoa', path: 'arts-culture', title: 'Nghệ thuật & văn hóa', en: 'Arts & culture', target: 70 },
  { slug: 'xa-hoi-phap-luat', path: 'society-law', title: 'Xã hội, pháp luật & chính trị', en: 'Society, law & politics', target: 100 },
  { slug: 'khoa-hoc-moi-truong', path: 'science-environment', title: 'Khoa học & môi trường', en: 'Science & environment', target: 90 },
  { slug: 'cntt-mobile', path: 'it-mobile', title: 'Công nghệ thông tin cho mobile developer', en: 'IT for mobile developers', target: 250, track: 'it' },
  { slug: 'cum-tu', path: 'phrases', title: 'Cụm từ thông dụng', en: 'Phrasal verbs, collocations & fixed expressions', short: 'Common phrases', target: 500, track: 'phrase' },
  // One topic per workplace lesson (workplace.ts); shown inside the lesson, so `path` is the
  // lesson's slug under /workplace/ rather than a page under /vocabulary/.
  { slug: 'cong-so-introductions', path: 'introductions', title: 'Giới thiệu bản thân & team', en: 'Introducing yourself and your team', target: 15, track: 'work' },
  { slug: 'cong-so-daily-standup', path: 'daily-standup', title: 'Họp daily stand-up', en: 'The daily stand-up', target: 15, track: 'work' },
  { slug: 'cong-so-meetings', path: 'meetings', title: 'Phát biểu trong cuộc họp', en: 'Speaking up in meetings', target: 15, track: 'work' },
  { slug: 'cong-so-clarifying', path: 'clarifying', title: 'Hỏi lại & làm rõ yêu cầu', en: 'Asking questions and clarifying requirements', target: 15, track: 'work' },
  { slug: 'cong-so-tasks-deadlines', path: 'tasks-deadlines', title: 'Nhận việc, ước lượng & deadline', en: 'Tasks, estimates and deadlines', target: 15, track: 'work' },
  { slug: 'cong-so-reporting-bugs', path: 'reporting-bugs', title: 'Báo lỗi & sự cố', en: 'Reporting bugs and incidents', target: 15, track: 'work' },
  { slug: 'cong-so-code-review', path: 'code-review', title: 'Góp ý & nhận góp ý khi review code', en: 'Giving and receiving code review feedback', target: 15, track: 'work' },
  { slug: 'cong-so-chat-email', path: 'chat-email', title: 'Tin nhắn chat & email công việc', en: 'Work chat and email', target: 15, track: 'work' },
  { slug: 'cong-so-demos', path: 'demos', title: 'Demo & trình bày tính năng', en: 'Demos and presentations', target: 15, track: 'work' },
  { slug: 'cong-so-small-talk-time-off', path: 'small-talk-time-off', title: 'Small talk & xin nghỉ phép', en: 'Small talk and time off', target: 15, track: 'work' },
]

export const coreTopics = vocabTopics.filter((t) => !t.track)

/** The core topics in sidebar groups, each a run of consecutive topics so the learning order
    above is kept. Every core topic is in exactly one group. */
export const topicGroups: { title: string; en: string; slugs: string[] }[] = [
  {
    title: 'Nền tảng',
    en: 'Basics',
    slugs: ['con-nguoi-gia-dinh', 'dong-tu-hang-ngay', 'tinh-tu-mo-ta', 'tu-chuc-nang', 'thoi-gian', 'so-luong-do-luong'],
  },
  {
    title: 'Cuộc sống hằng ngày',
    en: 'Daily life',
    slugs: ['an-uong', 'nha-cua-do-dung', 'quan-ao-mua-sam', 'co-the-suc-khoe', 'cam-xuc-tinh-cach', 'mau-sac-hinh-dang-chat-lieu'],
  },
  {
    title: 'Nơi chốn & thiên nhiên',
    en: 'Places & nature',
    slugs: ['thanh-pho-dia-diem', 'giao-thong-du-lich', 'thoi-tiet-thien-nhien', 'dong-vat-cay-coi'],
  },
  {
    title: 'Học tập, công việc & giải trí',
    en: 'Study, work & free time',
    slugs: ['truong-hoc', 'cong-viec-nghe-nghiep', 'tien-kinh-doanh', 'cong-nghe-truyen-thong', 'giai-tri-the-thao'],
  },
  {
    title: 'Giao tiếp & diễn đạt',
    en: 'Communicating ideas',
    slugs: ['giao-tiep-ngon-ngu', 'dong-tu-tu-duy', 'trang-tu', 'khai-niem-chung'],
  },
  {
    title: 'Xã hội & khoa học',
    en: 'Society & science',
    slugs: ['nghe-thuat-van-hoa', 'xa-hoi-phap-luat', 'khoa-hoc-moi-truong'],
  },
]
/** Words the learner added themselves (from articles); kept in the browser, not in data files. */
export const MINE = { slug: 'cua-toi', path: 'my-words', title: 'Từ của tôi' }

/** Topics outside the 3000 core words: IT vocabulary and common phrases. */
export const extraTopics = vocabTopics.filter((t) => t.track === 'it' || t.track === 'phrase')

/** The words of each workplace lesson, in lesson order. */
export const workTopics = vocabTopics.filter((t) => t.track === 'work')

/** Key under which "đã thuộc" is stored for a word. Core words use the bare word; everything
    else (specialist topics, phrases, the learner's own words) is prefixed with its slug. */
export const learnedKey = (slug: string, word: string) =>
  coreTopics.some((t) => t.slug === slug) ? word : `${slug}:${word}`

/** URL of a topic page (or "my words") from its id, without the locale prefix. */
export const topicLink = (slug: string) => {
  const t = vocabTopics.find((x) => x.slug === slug)
  if (t?.track === 'work') return `/workplace/${t.path}`
  return `/vocabulary/${slug === MINE.slug ? MINE.path : t?.path ?? ''}`
}
