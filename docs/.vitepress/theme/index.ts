import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'
import LevelBar from './components/LevelBar.vue'
import ChapterIndex from './components/ChapterIndex.vue'
import StudyPath from './components/StudyPath.vue'
import VocabHome from './components/VocabHome.vue'
import VocabTopic from './components/VocabTopic.vue'
import VocabToday from './components/VocabToday.vue'
import VocabReview from './components/VocabReview.vue'
import ArticleAnalyzer from './components/ArticleAnalyzer.vue'
import VocabMine from './components/VocabMine.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, { 'doc-before': () => h(LevelBar) }),
  enhanceApp({ app }) {
    app.component('ChapterIndex', ChapterIndex)
    app.component('StudyPath', StudyPath)
    app.component('VocabHome', VocabHome)
    app.component('VocabTopic', VocabTopic)
    app.component('VocabToday', VocabToday)
    app.component('VocabReview', VocabReview)
    app.component('ArticleAnalyzer', ArticleAnalyzer)
    app.component('VocabMine', VocabMine)
  },
} satisfies Theme
