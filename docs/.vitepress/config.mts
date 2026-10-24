import { defineConfig, type DefaultTheme, type MarkdownRenderer } from 'vitepress'
import { chapterNo, chapters, LEVEL_LABEL, LEVEL_LABEL_EN, lessonNo, sectionLink } from './chapters'
import { extraTopics, topicGroups, vocabTopics, type VocabTopic } from './vocabTopics'

// English lives at the root, Vietnamese under /vi/ with the same file names.
type Lang = 'vi' | 'en'
const prefix = (lang: Lang) => (lang === 'vi' ? '/vi' : '')

function grammarSidebar(lang: Lang): DefaultTheme.SidebarItem[] {
  const p = prefix(lang)
  const en = lang === 'en'
  const levels = en ? LEVEL_LABEL_EN : LEVEL_LABEL
  return [
    {
      text: en ? 'Start here' : 'Bắt đầu',
      items: [
        { text: en ? 'Introduction' : 'Giới thiệu', link: `${p}/` },
        { text: en ? 'Study path' : 'Lộ trình học', link: `${p}/study-path` },
      ],
    },
    ...chapters.map((c) => ({
      text: `${chapterNo(c)}. ${en ? c.en : c.title}`,
      link: `${p}/${c.dir}/`,
      collapsed: true,
      items: c.sections.map((s) => ({
        // Sidebar text is rendered as HTML: the level dot, lesson number and title sit in
        // columns so a long title wraps under itself (see .sb-item in base.css).
        text: `<span class="sb-item"><span class="sb-lv ${s.level}" title="${levels[s.level]}"></span><span class="sb-no">${lessonNo(c, s)}</span><span>${en ? s.titleEn : s.title}</span></span>`,
        link: `${p}${sectionLink(c, s)}`,
      })),
    })),
  ]
}

function vocabSidebar(lang: Lang): DefaultTheme.SidebarItem[] {
  const p = prefix(lang)
  const en = lang === 'en'
  const topic = (t: VocabTopic) => ({ text: en ? (t.short ?? t.en) : t.title, link: `${p}/vocabulary/${t.path}` })
  const bySlug = new Map(vocabTopics.map((t) => [t.slug, t]))
  return [
    {
      text: en ? 'Study' : 'Học & ôn',
      items: [
        { text: en ? 'Overview & search' : 'Tổng quan & tra từ', link: `${p}/vocabulary/` },
        { text: en ? "Today's words" : 'Hôm nay học', link: `${p}/vocabulary/today` },
        { text: en ? 'Review quiz' : 'Kiểm tra từ đã học', link: `${p}/vocabulary/review` },
        { text: en ? 'Learn from an article' : 'Học từ bài viết', link: `${p}/vocabulary/article` },
        { text: en ? 'My words' : 'Từ của tôi', link: `${p}/vocabulary/my-words` },
      ],
    },
    {
      text: en ? '3000 core words' : '3000 từ thông dụng',
      // One collapsed group per theme; the group holding the open page expands by itself.
      items: topicGroups.map((g) => ({
        text: en ? g.en : g.title,
        collapsed: true,
        items: g.slugs.map((s) => topic(bySlug.get(s)!)),
      })),
    },
    {
      text: en ? 'Extra topics' : 'Mở rộng',
      items: extraTopics.map(topic),
    },
  ]
}

// Prepares tables for phones (see content.css):
// - each cell gets its column's header as data-label, so a table stacked into one block per
//   row can still say which column a value came from;
// - a table too wide for a phone gets the class "stack". The width is estimated from the
//   average text length per column (about 7.5px a character at 14px, plus cell padding),
//   against the 327px a 375px phone leaves for content; a table whose longest words alone
//   don't fit side by side stacks too. Short tables such as V1 | V2 | V3 stay tables.
const PHONE_CONTENT = 327
function tableLabels(md: MarkdownRenderer) {
  const text = (s: string) => s.replace(/[*_`]/g, '').replace(/<br\s*\/?>/g, ' ').trim()
  md.core.ruler.push('table_labels', (state) => {
    let table: (typeof state.tokens)[number] | undefined
    let headers: string[] = []
    let lengths: number[] = []
    let words: number[] = []
    let rows = 0
    let col = 0
    for (let i = 0; i < state.tokens.length; i++) {
      const t = state.tokens[i]
      if (t.type === 'table_open') {
        table = t
        headers = []
        lengths = []
        words = []
        rows = 0
      } else if (t.type === 'th_open') headers.push(text(state.tokens[i + 1].content))
      else if (t.type === 'tr_open') col = 0
      else if (t.type === 'td_open') {
        if (col === 0) rows++
        const cell = text(state.tokens[i + 1].content)
        lengths[col] = (lengths[col] ?? 0) + cell.length
        words[col] = Math.max(words[col] ?? 0, ...cell.split(/\s+/).map((w) => w.length))
        if (headers[col] !== undefined) t.attrSet('data-label', headers[col])
        col++
      } else if (t.type === 'table_close' && table && rows) {
        const pad = headers.length * 20
        const width = lengths.reduce((sum, n) => sum + n / rows, 0) * 7.5 + pad
        const minWidth = words.reduce((sum, n) => sum + n, 0) * 7.5 + pad
        if (width <= PHONE_CONTENT && minWidth <= PHONE_CONTENT) continue
        table.attrJoin('class', 'stack')
        // Headers like "Hiện tại đơn: thường xuyên" are too long for the label column, so
        // those labels go above their values instead.
        if (Math.max(...headers.map((h) => h.length)) > 16) table.attrJoin('class', 'stack-top')
      }
    }
  })
  // VitePress renders <table> from a fixed string; this keeps its tabindex and adds the class.
  md.renderer.rules.table_open = (tokens, idx, _options, _env, self) => `<table tabindex="0"${self.renderAttrs(tokens[idx])}>\n`
}

const viTheme: DefaultTheme.Config = {
  // Logo only in the top bar: the title takes room the timer and sync buttons need.
  siteTitle: false,
  nav: [
    { text: 'Ngữ pháp', link: '/vi/study-path', activeMatch: '^/vi/(?!vocabulary|progress)' },
    { text: 'Từ vựng', link: '/vi/vocabulary/', activeMatch: '^/vi/vocabulary/' },
    { text: 'Tiến độ', link: '/vi/progress', activeMatch: '^/vi/progress' },
  ],
  sidebar: { '/vi/vocabulary/': vocabSidebar('vi'), '/vi/': grammarSidebar('vi') },
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
  // Logo only in the top bar: the title takes room the timer and sync buttons need.
  siteTitle: false,
  nav: [
    { text: 'Grammar', link: '/study-path', activeMatch: '^/(?!vocabulary|progress|vi/)' },
    { text: 'Vocabulary', link: '/vocabulary/', activeMatch: '^/vocabulary/' },
    { text: 'Progress', link: '/progress', activeMatch: '^/progress' },
  ],
  sidebar: { '/vocabulary/': vocabSidebar('en'), '/': grammarSidebar('en') },
  outline: { level: [2, 3], label: 'On this page' },
  docFooter: { prev: 'Previous', next: 'Next' },
  sidebarMenuLabel: 'Menu',
  returnToTopLabel: 'Back to top',
  langMenuLabel: 'Change language',
}

export default defineConfig({
  title: 'Grammar Notebook',
  // GitHub Pages serves the site under /<repo>/; the deploy workflow sets VITEPRESS_BASE.
  base: process.env.VITEPRESS_BASE || '/',
  cleanUrls: true,
  markdown: { config: tableLabels },
  lastUpdated: false,
  // The local search index ships in one chunk; it is expected to be large.
  vite: { build: { chunkSizeWarningLimit: 2000 } },
  head: [
    // Restores a collapsed sidebar before first paint (see SidebarToggle.vue).
    ['script', {}, "try{localStorage.getItem('sidebar-collapsed')==='1'&&document.documentElement.classList.add('sidebar-collapsed')}catch(e){}"],
    // Google Translate's voice (speak() in useVocab.ts) answers 404 to any request that names another
    // site as referrer, and <audio> has no per-element referrer setting. So the Firebase API key must
    // not be restricted by HTTP referrer, or sync would stop working.
    ['meta', { name: 'referrer', content: 'no-referrer' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${process.env.VITEPRESS_BASE || '/'}logo.svg` }],
    // Added to the home screen, the site opens as its own app (see AppBackButton and TabBar).
    ['link', { rel: 'manifest', href: `${process.env.VITEPRESS_BASE || '/'}manifest.webmanifest` }],
    ['link', { rel: 'apple-touch-icon', href: `${process.env.VITEPRESS_BASE || '/'}icons/icon-180.png` }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'Ngữ Pháp' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { name: 'theme-color', content: '#fbf8f1', media: '(prefers-color-scheme: light)' }],
    ['meta', { name: 'theme-color', content: '#16181d', media: '(prefers-color-scheme: dark)' }],
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
      label: 'English',
      lang: 'en-US',
      title: 'Grammar Notebook',
      description: 'Short English grammar lessons with many examples, plus 3000 core words, for Vietnamese learners.',
      themeConfig: enTheme,
    },
    vi: {
      label: 'Tiếng Việt',
      lang: 'vi-VN',
      link: '/vi/',
      title: 'Sổ Tay Ngữ Pháp',
      description: 'Lý thuyết ngữ pháp tiếng Anh rút gọn, nhiều ví dụ, sắp theo 9 chương sách Giải thích ngữ pháp tiếng Anh.',
      themeConfig: viTheme,
    },
  },
  themeConfig: {
    logo: '/logo.svg',
    search: {
      provider: 'local',
      options: {
        locales: {
          vi: {
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
