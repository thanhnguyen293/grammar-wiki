// Vocabulary topics, in the order a beginner should meet them. Each topic's words live in
// docs/tu-vung/data/<slug>.json, already sorted from most to least common.

export interface VocabTopic {
  slug: string
  title: string
  en: string
  /** Planned number of words; scripts/check-vocab.mjs checks the data against it. */
  target: number
  /** Specialist topics sit outside the 3000 core words: they may reuse a core word with its
      specialist meaning (bug, branch, release), so their progress is tracked separately. */
  track?: 'it'
}

export const vocabTopics: VocabTopic[] = [
  { slug: 'con-nguoi-gia-dinh', title: 'Con người & gia đình', en: 'People & family', target: 100 },
  { slug: 'dong-tu-hang-ngay', title: 'Động từ hành động thường gặp', en: 'Everyday action verbs', target: 200 },
  { slug: 'tinh-tu-mo-ta', title: 'Tính từ mô tả thường gặp', en: 'Common describing adjectives', target: 170 },
  { slug: 'tu-chuc-nang', title: 'Từ chức năng', en: 'Pronouns, prepositions, conjunctions, determiners', target: 150 },
  { slug: 'thoi-gian', title: 'Thời gian & lịch', en: 'Time & calendar', target: 80 },
  { slug: 'so-luong-do-luong', title: 'Số đếm, số lượng & đo lường', en: 'Numbers, quantity & measurement', target: 90 },
  { slug: 'an-uong', title: 'Ăn uống', en: 'Food & drink', target: 120 },
  { slug: 'nha-cua-do-dung', title: 'Nhà cửa & đồ dùng', en: 'Home & household objects', target: 110 },
  { slug: 'quan-ao-mua-sam', title: 'Quần áo & mua sắm', en: 'Clothes & shopping', target: 100 },
  { slug: 'co-the-suc-khoe', title: 'Cơ thể & sức khỏe', en: 'Body & health', target: 110 },
  { slug: 'cam-xuc-tinh-cach', title: 'Cảm xúc & tính cách', en: 'Feelings & personality', target: 110 },
  { slug: 'mau-sac-hinh-dang-chat-lieu', title: 'Màu sắc, hình dạng & chất liệu', en: 'Colours, shapes & materials', target: 60 },
  { slug: 'thanh-pho-dia-diem', title: 'Thành phố & địa điểm', en: 'Town & places', target: 100 },
  { slug: 'giao-thong-du-lich', title: 'Giao thông & du lịch', en: 'Transport & travel', target: 100 },
  { slug: 'thoi-tiet-thien-nhien', title: 'Thời tiết & thiên nhiên', en: 'Weather & nature', target: 110 },
  { slug: 'dong-vat-cay-coi', title: 'Động vật & cây cối', en: 'Animals & plants', target: 80 },
  { slug: 'truong-hoc', title: 'Trường học & học tập', en: 'School & learning', target: 110 },
  { slug: 'cong-viec-nghe-nghiep', title: 'Công việc & nghề nghiệp', en: 'Work & jobs', target: 120 },
  { slug: 'tien-kinh-doanh', title: 'Tiền bạc & kinh doanh', en: 'Money & business', target: 120 },
  { slug: 'cong-nghe-truyen-thong', title: 'Công nghệ & truyền thông', en: 'Technology & media', target: 110 },
  { slug: 'giai-tri-the-thao', title: 'Giải trí, thể thao & sở thích', en: 'Free time, sport & hobbies', target: 100 },
  { slug: 'giao-tiep-ngon-ngu', title: 'Giao tiếp & ngôn ngữ', en: 'Communication & language', target: 90 },
  { slug: 'dong-tu-tu-duy', title: 'Động từ tư duy & cảm nhận', en: 'Thinking & sensing verbs', target: 90 },
  { slug: 'trang-tu', title: 'Trạng từ', en: 'Adverbs of degree, frequency & manner', target: 90 },
  { slug: 'khai-niem-chung', title: 'Khái niệm chung', en: 'General ideas (problem, reason, way…)', target: 120 },
  { slug: 'nghe-thuat-van-hoa', title: 'Nghệ thuật & văn hóa', en: 'Arts & culture', target: 70 },
  { slug: 'xa-hoi-phap-luat', title: 'Xã hội, pháp luật & chính trị', en: 'Society, law & politics', target: 100 },
  { slug: 'khoa-hoc-moi-truong', title: 'Khoa học & môi trường', en: 'Science & environment', target: 90 },
  { slug: 'cntt-mobile', title: 'Công nghệ thông tin cho mobile developer', en: 'IT for mobile developers', target: 250, track: 'it' },
]

export const coreTopics = vocabTopics.filter((t) => !t.track)
export const itTopics = vocabTopics.filter((t) => t.track === 'it')

/** Key under which "đã thuộc" is stored for a word. */
export const learnedKey = (slug: string, word: string) =>
  vocabTopics.find((t) => t.slug === slug)?.track ? `${slug}:${word}` : word
