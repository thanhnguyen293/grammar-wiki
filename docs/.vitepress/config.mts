import { defineConfig, type DefaultTheme } from 'vitepress'
import { chapters, LEVEL_LABEL, LEVEL_LABEL_EN, sectionLink, sectionNo } from './chapters'
import { coreTopics, extraTopics } from './vocabTopics'

// Vietnamese lives at the root, English under /en/ with the same file names.
type Lang = 'vi' | 'en'
const prefix = (lang: Lang) => (lang === 'en' ? '/en' : '')

function grammarSidebar(lang: Lang): DefaultTheme.SidebarItem[] {
  const p = prefix(lang)
  const en = lang === 'en'
  const levels = en ? LEVEL_LABEL_EN : LEVEL_LABEL
  return [
    {
      text: en ? 'Start here' : 'Bắt đầu',
      items: [
        { text: en ? 'Introduction' : 'Giới thiệu', link: `${p}/` },
        { text: en ? 'Study path' : 'Lộ trình học', link: `${p}/lo-trinh` },
      ],
    },
    ...chapters.map((c) => ({
      text: `${c.no}. ${en ? c.en : c.title}`,
      link: `${p}/${c.dir}/`,
      collapsed: true,
      items: c.sections.map((s) => ({
        // Sidebar text is rendered as HTML, so the level dot can sit next to the title.
        text: `<span class="sb-lv ${s.level}" title="${levels[s.level]}"></span>${sectionNo(c, s)} ${en ? s.titleEn : s.title}`,
        link: `${p}${sectionLink(c, s)}`,
      })),
    })),
  ]
}

function vocabSidebar(lang: Lang): DefaultTheme.SidebarItem[] {
  const p = prefix(lang)
  const en = lang === 'en'
  return [
    {
      text: en ? 'Vocabulary by topic' : 'Từ vựng theo chủ đề',
      items: [
        { text: en ? 'Overview & search' : 'Tổng quan & tra từ', link: `${p}/tu-vung/` },
        { text: en ? "Today's words" : 'Hôm nay học', link: `${p}/tu-vung/hom-nay` },
        { text: en ? 'Review quiz' : 'Kiểm tra từ đã học', link: `${p}/tu-vung/on-tap` },
        { text: en ? 'Learn from an article' : 'Học từ bài viết', link: `${p}/tu-vung/phan-tich` },
        { text: en ? 'My words' : 'Từ của tôi', link: `${p}/tu-vung/cua-toi` },
        ...coreTopics.map((t, i) => ({ text: `${i + 1}. ${en ? t.en : t.title}`, link: `${p}/tu-vung/${t.slug}` })),
      ],
    },
    {
      text: en ? 'Extra topics' : 'Mở rộng',
      items: extraTopics.map((t) => ({ text: en ? t.en : t.title, link: `${p}/tu-vung/${t.slug}` })),
    },
  ]
}

const viTheme: DefaultTheme.Config = {
  nav: [
    { text: 'Ngữ pháp', link: '/lo-trinh', activeMatch: '^/(?!tu-vung|en/)' },
    { text: 'Từ vựng', link: '/tu-vung/', activeMatch: '^/tu-vung/' },
  ],
  sidebar: { '/tu-vung/': vocabSidebar('vi'), '/': grammarSidebar('vi') },
  outline: { level: [2, 3], label: 'Trong bài này' },
  docFooter: { prev: 'Bài trước', next: 'Bài tiếp' },
  darkModeSwitchLabel: 'Giao diện',
  lightModeSwitchTitle: 'Chuyển sang sáng',
  darkModeSwitchTitle: 'Chuyển sang tối',
  sidebarMenuLabel: 'Mục lục',
  returnToTopLabel: 'Lên đầu trang',
  langMenuLabel: 'Đổi ngôn ngữ',
  notFound: { title: 'Không tìm thấy trang', quote: 'Trang này không tồn tại.', linkText: 'Về trang chủ' },
}

const enTheme: DefaultTheme.Config = {
  nav: [
    { text: 'Grammar', link: '/en/lo-trinh', activeMatch: '^/en/(?!tu-vung)' },
    { text: 'Vocabulary', link: '/en/tu-vung/', activeMatch: '^/en/tu-vung/' },
  ],
  sidebar: { '/en/tu-vung/': vocabSidebar('en'), '/en/': grammarSidebar('en') },
  outline: { level: [2, 3], label: 'On this page' },
  docFooter: { prev: 'Previous', next: 'Next' },
  sidebarMenuLabel: 'Menu',
  returnToTopLabel: 'Back to top',
  langMenuLabel: 'Change language',
}

export default defineConfig({
  title: 'Sổ Tay Ngữ Pháp',
  // GitHub Pages serves the site under /<repo>/; the deploy workflow sets VITEPRESS_BASE.
  base: process.env.VITEPRESS_BASE || '/',
  cleanUrls: true,
  lastUpdated: false,
  // The local search index ships in one chunk; it is expected to be large.
  vite: { build: { chunkSizeWarningLimit: 2000 } },
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Literata:opsz,wght@7..72,600;7..72,700&family=JetBrains+Mono:wght@400;500&display=swap',
      },
    ],
  ],
  locales: {
    root: {
      label: 'Tiếng Việt',
      lang: 'vi-VN',
      description: 'Lý thuyết ngữ pháp tiếng Anh rút gọn, nhiều ví dụ, sắp theo 9 chương sách Giải thích ngữ pháp tiếng Anh.',
      themeConfig: viTheme,
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'Grammar Notebook',
      description: 'Short English grammar lessons with many examples, plus 3000 core words, for Vietnamese learners.',
      themeConfig: enTheme,
    },
  },
  themeConfig: {
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: 'Tìm kiếm', buttonAriaLabel: 'Tìm kiếm' },
              modal: {
                displayDetails: 'Hiện chi tiết',
                resetButtonTitle: 'Xóa',
                backButtonTitle: 'Đóng',
                noResultsText: 'Không có kết quả cho',
                footer: { selectText: 'chọn', navigateText: 'di chuyển', closeText: 'đóng' },
              },
            },
          },
        },
      },
    },
  },
})
