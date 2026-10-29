// The workplace English section: spoken and written English for working in an IT office.
// Its sidebar, index page and lesson bar are generated from this list, like chapters.ts does
// for grammar. Lessons are situations rather than grammar points, so they have no level.

export interface WorkplaceLesson {
  slug: string
  title: string
  titleEn: string
}

export const WORKPLACE_DIR = 'workplace'

export const workplace = {
  title: 'Giao tiếp công sở IT',
  en: 'Workplace English for IT',
  intro: 'Mẫu câu và hội thoại cho những việc diễn ra hằng ngày ở một công ty công nghệ: họp, báo cáo tiến độ, hỏi lại yêu cầu, review code, nhắn tin và email.',
  introEn: 'Phrases and dialogues for everyday work at a tech company: meetings, status updates, clarifying requirements, code review, chat and email.',
}

export const workplaceLessons: WorkplaceLesson[] = [
  { slug: 'introductions', title: 'Giới thiệu bản thân & team', titleEn: 'Introducing yourself and your team' },
  { slug: 'daily-standup', title: 'Họp daily stand-up', titleEn: 'The daily stand-up' },
  { slug: 'meetings', title: 'Phát biểu trong cuộc họp', titleEn: 'Speaking up in meetings' },
  { slug: 'clarifying', title: 'Hỏi lại & làm rõ yêu cầu', titleEn: 'Asking questions and clarifying requirements' },
  { slug: 'tasks-deadlines', title: 'Nhận việc, ước lượng & deadline', titleEn: 'Tasks, estimates and deadlines' },
  { slug: 'reporting-bugs', title: 'Báo lỗi & sự cố', titleEn: 'Reporting bugs and incidents' },
  { slug: 'code-review', title: 'Góp ý & nhận góp ý khi review code', titleEn: 'Giving and receiving code review feedback' },
  { slug: 'chat-email', title: 'Tin nhắn chat & email công việc', titleEn: 'Work chat and email' },
  { slug: 'demos', title: 'Demo & trình bày tính năng', titleEn: 'Demos and presentations' },
  { slug: 'small-talk-time-off', title: 'Small talk & xin nghỉ phép', titleEn: 'Small talk and time off' },
]

export const workplaceLink = (l: WorkplaceLesson) => `/${WORKPLACE_DIR}/${l.slug}`
export const workplaceNo = (l: WorkplaceLesson) => workplaceLessons.indexOf(l) + 1
