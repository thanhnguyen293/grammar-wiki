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
import HomeHero from './components/HomeHero.vue'
import HomeChapters from './components/HomeChapters.vue'
import SidebarToggle from './components/SidebarToggle.vue'
import ProgressDashboard from './components/ProgressDashboard.vue'
import { useScrollbarReveal } from './components/useScrollbarReveal'
import './styles/tokens.css'
import './styles/base.css'
import './styles/content.css'
import './styles/grammar.css'
import './styles/vocab.css'
import './styles/analyzer.css'

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'doc-before': () => h(LevelBar),
      'nav-bar-content-before': () => h(SidebarToggle),
    }),
  setup() {
    useScrollbarReveal()
  },
  enhanceApp({ app }) {
    app.component('ChapterIndex', ChapterIndex)
    app.component('StudyPath', StudyPath)
    app.component('VocabHome', VocabHome)
    app.component('VocabTopic', VocabTopic)
    app.component('VocabToday', VocabToday)
    app.component('VocabReview', VocabReview)
    app.component('ArticleAnalyzer', ArticleAnalyzer)
    app.component('VocabMine', VocabMine)
    app.component('HomeHero', HomeHero)
    app.component('HomeChapters', HomeChapters)
    app.component('ProgressDashboard', ProgressDashboard)
  },
} satisfies Theme
