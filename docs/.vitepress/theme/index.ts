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
import SyncButton from './components/SyncButton.vue'
import PomodoroTimer from './components/PomodoroTimer.vue'
import SidebarMenuButton from './components/SidebarMenuButton.vue'
import BackToTop from './components/BackToTop.vue'
import { initPomodoro } from './components/usePomodoro'
import { initSync } from './components/sync'
import { onMounted } from 'vue'
import './styles/tokens.css'
import './styles/base.css'
import './styles/content.css'
import './styles/grammar.css'
import './styles/vocab.css'
import './styles/analyzer.css'
import './styles/sync.css'
import './styles/pomodoro.css'
import './styles/chrome.css'

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'doc-before': () => h(LevelBar),
      'nav-bar-content-before': () => h(SidebarToggle),
      'nav-bar-title-before': () => h(SidebarMenuButton),
      'nav-bar-content-after': () => [h(PomodoroTimer), h(SyncButton)],
      'layout-bottom': () => h(BackToTop),
    }),
  setup() {
    useScrollbarReveal()
    onMounted(initSync)
    onMounted(() =>
      initPomodoro((ended, goalReached) => {
        const en = document.documentElement.lang.startsWith('en')
        if (goalReached)
          return {
            title: en ? "Today's goal reached" : 'Đã đạt mục tiêu hôm nay',
            body: en ? 'Great work. Take a proper break.' : 'Làm tốt lắm. Nghỉ ngơi thật thoải mái nhé.',
          }
        return ended === 'focus'
          ? { title: en ? 'Focus session done' : 'Hết giờ tập trung', body: en ? 'Time for a break.' : 'Nghỉ một chút nhé.' }
          : { title: en ? 'Break is over' : 'Hết giờ nghỉ', body: en ? 'Back to studying.' : 'Quay lại học thôi.' }
      }),
    )
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
