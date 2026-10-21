import { defineConfig } from 'vitepress'
import { chapters, LEVEL_LABEL, sectionLink, sectionNo } from './chapters'
import { coreTopics, extraTopics } from './vocabTopics'

const grammarSidebar = [
  {
    text: 'Bắt đầu',
    items: [
      { text: 'Giới thiệu', link: '/' },
      { text: 'Lộ trình học', link: '/lo-trinh' },
    ],
  },
  ...chapters.map((c) => ({
    text: `${c.no}. ${c.title}`,
    link: `/${c.dir}/`,
    collapsed: true,
    items: c.sections.map((s) => ({
      // Sidebar text is rendered as HTML, so the level dot can sit next to the title.
      text: `<span class="sb-lv ${s.level}" title="${LEVEL_LABEL[s.level]}"></span>${sectionNo(c, s)} ${s.title}`,
      link: sectionLink(c, s),
    })),
  })),
]

const vocabSidebar = [
  {
    text: 'Từ vựng theo chủ đề',
    items: [
      { text: 'Tổng quan & tra từ', link: '/tu-vung/' },
      { text: 'Hôm nay học', link: '/tu-vung/hom-nay' },
      { text: 'Kiểm tra từ đã học', link: '/tu-vung/on-tap' },
      { text: 'Học từ bài viết', link: '/tu-vung/phan-tich' },
      { text: 'Từ của tôi', link: '/tu-vung/cua-toi' },
      ...coreTopics.map((t, i) => ({ text: `${i + 1}. ${t.title}`, link: `/tu-vung/${t.slug}` })),
    ],
  },
  {
    text: 'Mở rộng',
    items: extraTopics.map((t) => ({ text: t.title, link: `/tu-vung/${t.slug}` })),
  },
]

export default defineConfig({
  lang: 'vi-VN',
  title: 'Sổ Tay Ngữ Pháp',
  description: 'Lý thuyết ngữ pháp tiếng Anh rút gọn, nhiều ví dụ, sắp theo 9 chương sách Giải thích ngữ pháp tiếng Anh.',
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
  themeConfig: {
    nav: [
      { text: 'Ngữ pháp', link: '/lo-trinh', activeMatch: '^/(?!tu-vung)' },
      { text: 'Từ vựng', link: '/tu-vung/', activeMatch: '^/tu-vung/' },
    ],
    sidebar: { '/tu-vung/': vocabSidebar, '/': grammarSidebar },
    outline: { level: [2, 3], label: 'Trong bài này' },
    docFooter: { prev: 'Bài trước', next: 'Bài tiếp' },
    darkModeSwitchLabel: 'Giao diện',
    lightModeSwitchTitle: 'Chuyển sang sáng',
    darkModeSwitchTitle: 'Chuyển sang tối',
    sidebarMenuLabel: 'Mục lục',
    returnToTopLabel: 'Lên đầu trang',
    notFound: { title: 'Không tìm thấy trang', quote: 'Trang này không tồn tại.', linkText: 'Về trang chủ' },
    search: {
      provider: 'local',
      options: {
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
})
