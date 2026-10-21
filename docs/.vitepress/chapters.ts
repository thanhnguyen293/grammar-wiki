// Single source of truth for the wiki's structure: the sidebar, the chapter index pages
// and the study-path page are all generated from this list.

export type Level = 'v1' | 'v2' | 'tc'

export interface Section {
  slug: string
  title: string
  level: Level
}

export interface Chapter {
  no: number
  dir: string
  title: string
  en: string
  intro: string
  sections: Section[]
}

export const LEVEL_LABEL: Record<Level, string> = {
  v1: 'Vòng 1',
  v2: 'Vòng 2',
  tc: 'Tra cứu',
}

export const chapters: Chapter[] = [
  {
    no: 1,
    dir: '1-tu-loai',
    title: 'Từ loại',
    en: 'The Parts of Speech',
    intro: 'Nền móng của mọi câu: mỗi từ thuộc loại nào, đứng ở đâu và đổi dạng ra sao.',
    sections: [
      { slug: 'tong-quan', title: 'Tổng quan 8 từ loại', level: 'v1' },
      { slug: 'dem-duoc-khong-dem-duoc', title: 'Danh từ đếm được & không đếm được', level: 'v1' },
      { slug: 'so-nhieu', title: 'Số nhiều của danh từ', level: 'v1' },
      { slug: 'mao-tu', title: 'Mạo từ a / an / the', level: 'v1' },
      { slug: 'dai-tu', title: 'Đại từ', level: 'v1' },
      { slug: 'tinh-tu-trang-tu', title: 'Tính từ & trạng từ', level: 'v1' },
      { slug: 'gioi-tu-in-on-at', title: 'Giới từ in / on / at', level: 'v1' },
      { slug: 'dong-tu-khiem-khuyet', title: 'Động từ khiếm khuyết cơ bản', level: 'v1' },
      { slug: 'hoa-hop-chu-ngu-dong-tu', title: 'Hòa hợp chủ ngữ – động từ', level: 'v1' },
      { slug: 'so-sanh', title: 'So sánh', level: 'v2' },
      { slug: 'v-ing-to-v', title: 'V-ing và to V', level: 'v2' },
      { slug: 'so-huu-cach', title: 'Sở hữu cách', level: 'v2' },
      { slug: 'lien-tu', title: 'Liên từ', level: 'v2' },
      { slug: 'cac-loai-danh-tu-khac', title: 'Các cách phân loại danh từ khác', level: 'tc' },
    ],
  },
  {
    no: 2,
    dir: '2-thi',
    title: 'Thì',
    en: 'Tenses',
    intro: 'Cách chia động từ theo thời gian (hiện tại, quá khứ, tương lai) và trạng thái của hành động.',
    sections: [
      { slug: 'tong-quan', title: 'Tổng quan 12 thì', level: 'v1' },
      { slug: 'hien-tai-don', title: 'Hiện tại đơn', level: 'v1' },
      { slug: 'hien-tai-tiep-dien', title: 'Hiện tại tiếp diễn', level: 'v1' },
      { slug: 'qua-khu-don', title: 'Quá khứ đơn', level: 'v1' },
      { slug: 'tuong-lai-don', title: 'Tương lai đơn & be going to', level: 'v1' },
      { slug: 'hien-tai-hoan-thanh', title: 'Hiện tại hoàn thành', level: 'v1' },
      { slug: 'them-duoi-phat-am', title: 'Thêm -s/-es, -ed, -ing & cách phát âm', level: 'v1' },
      { slug: 'qua-khu-tiep-dien', title: 'Quá khứ tiếp diễn', level: 'v2' },
      { slug: 'qua-khu-hoan-thanh', title: 'Quá khứ hoàn thành', level: 'v2' },
      { slug: 'hoan-thanh-tiep-dien-tuong-lai', title: 'Các thì hoàn thành tiếp diễn & tương lai khác', level: 'v2' },
      { slug: 'dong-tu-bat-quy-tac', title: 'Động từ bất quy tắc thường gặp', level: 'tc' },
    ],
  },
  {
    no: 3,
    dir: '3-menh-de-cum-tu',
    title: 'Mệnh đề và cụm từ',
    en: 'Clauses and Phrases',
    intro: 'Ghép nhiều ý thành câu dài: mệnh đề quan hệ, mục đích, nguyên nhân, kết quả, tương phản, wish.',
    sections: [
      { slug: 'menh-de-quan-he', title: 'Mệnh đề quan hệ', level: 'v2' },
      { slug: 'muc-dich', title: 'Mục đích', level: 'v2' },
      { slug: 'nguyen-nhan-ket-qua', title: 'Nguyên nhân & kết quả', level: 'v2' },
      { slug: 'tuong-phan', title: 'Tương phản', level: 'v2' },
      { slug: 'wish-if-only', title: 'Wish & if only', level: 'v2' },
      { slug: 'menh-de-danh-tu', title: 'Mệnh đề danh từ', level: 'v2' },
    ],
  },
  {
    no: 4,
    dir: '4-cau',
    title: 'Câu',
    en: 'Sentences',
    intro: 'Trật tự từ, cách đặt câu hỏi, câu phủ định, câu hỏi đuôi và cách nhấn mạnh.',
    sections: [
      { slug: 'trat-tu-tu', title: 'Trật tự từ trong câu', level: 'v1' },
      { slug: 'phu-dinh-cau-hoi', title: 'Câu phủ định & câu hỏi', level: 'v1' },
      { slug: 'cau-hoi-duoi', title: 'Câu hỏi đuôi', level: 'v2' },
      { slug: 'nhan-manh-dao-ngu', title: 'Câu nhấn mạnh & đảo ngữ', level: 'v2' },
    ],
  },
  {
    no: 5,
    dir: '5-cau-dieu-kien',
    title: 'Câu điều kiện',
    en: 'Conditional Sentences',
    intro: 'Nói về điều kiện có thật và các giả định trái với thực tế.',
    sections: [
      { slug: 'cac-loai', title: 'Các loại câu điều kiện', level: 'v2' },
      { slug: 'unless-dao-ngu', title: 'Unless, đảo ngữ & cách khác', level: 'v2' },
    ],
  },
  {
    no: 6,
    dir: '6-loi-noi-gian-tiep',
    title: 'Lời nói gián tiếp',
    en: 'Indirect Speech',
    intro: 'Thuật lại lời người khác đã nói.',
    sections: [
      { slug: 'lui-thi', title: 'Nguyên tắc lùi thì & đổi trạng từ', level: 'v2' },
      { slug: 'cau-hoi-menh-lenh', title: 'Câu hỏi, mệnh lệnh, đề nghị', level: 'v2' },
    ],
  },
  {
    no: 7,
    dir: '7-bi-dong',
    title: 'Câu bị động',
    en: 'Passive Sentences',
    intro: 'Đưa đối tượng chịu tác động lên làm chủ ngữ thay vì người thực hiện.',
    sections: [
      { slug: 'cach-chuyen', title: 'Cách chuyển sang bị động', level: 'v1' },
      { slug: 'theo-thi', title: 'Bị động theo từng thì', level: 'v1' },
      { slug: 'the-sai-khien', title: 'Thể sai khiến', level: 'v2' },
    ],
  },
  {
    no: 8,
    dir: '8-so-luong',
    title: 'Sự diễn tả về số lượng',
    en: 'Expression of Quantity',
    intro: 'Diễn đạt nhiều, ít, tất cả, mỗi, cả hai.',
    sections: [
      { slug: 'some-any-much-many', title: 'some / any · much / many / a lot of', level: 'v1' },
      { slug: 'few-little', title: 'few / a few · little / a little', level: 'v1' },
      { slug: 'all-most-every-each', title: 'all / most / every / each / both…', level: 'v1' },
    ],
  },
  {
    no: 9,
    dir: '9-tu-vung-hoc',
    title: 'Từ vựng học',
    en: 'Word Study',
    intro: 'Tạo từ bằng tiền tố, hậu tố; dạng của từ; thành ngữ và văn phong.',
    sections: [
      { slug: 'hau-to', title: 'Hậu tố & họ từ', level: 'v2' },
      { slug: 'tien-to', title: 'Tiền tố', level: 'v2' },
      { slug: 'van-phong-thanh-ngu', title: 'Văn phong & thành ngữ', level: 'tc' },
    ],
  },
]

export const sectionLink = (c: Chapter, s: Section) => `/${c.dir}/${s.slug}`
export const sectionNo = (c: Chapter, s: Section) => `${c.no}.${c.sections.indexOf(s) + 1}`
