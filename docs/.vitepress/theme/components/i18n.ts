// UI strings for the English version (/en/). Vietnamese text is the key, so components keep
// reading naturally in Vietnamese and fall back to it when a translation is missing.
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { MINE, vocabTopics } from '../../vocabTopics'
import { POS_LABEL, type Pos } from './useVocab'

const EN: Record<string, string> = {
  // Shared list and card views
  'Danh sách': 'List',
  'Thẻ ghi nhớ': 'Flashcards',
  'Chế độ học': 'Study mode',
  'Lọc từ': 'Filter words',
  'Tất cả': 'All',
  'Chưa thuộc': 'Not learned',
  'Đã thuộc': 'Learned',
  'Ẩn nghĩa': 'Hide meanings',
  'Đã thuộc {a} / {b} từ': 'Learned {a} / {b} words',
  'Trình duyệt này không hỗ trợ đọc phát âm. Hãy thử Chrome, Edge hoặc Safari.':
    "This browser can't read words aloud. Try Chrome, Edge or Safari.",
  'Đang tải danh sách từ…': 'Loading words…',
  'Hiện nghĩa': 'Show meaning',
  'Nghe câu ví dụ': 'Listen to the example',
  'Nghe phát âm': 'Listen',
  'Nghe: {w}': 'Listen: {w}',
  'Bỏ khỏi danh sách hôm nay': "Remove from today's list",
  'Thêm vào danh sách học hôm nay': "Add to today's list",
  '✓ Hôm nay': '✓ Today',
  '+ Hôm nay': '+ Today',
  'Bỏ đánh dấu': 'Unmark',
  'Đánh dấu đã thuộc': 'Mark as learned',
  '✓ Đã thuộc': '✓ Learned',
  'Đã thuộc?': 'Learned?',
  'Xóa': 'Delete',
  'Không có từ nào trong bộ lọc này.': 'No words match this filter.',
  'Thẻ {a} / {b}': 'Card {a} / {b}',
  'Trộn thẻ': 'Shuffle',
  'Úp thẻ': 'Hide answer',
  'Lật thẻ': 'Flip',
  'Lật thẻ xem nghĩa': 'Flip to see the meaning',
  'Nhớ nghĩa trong đầu, rồi chạm để lật thẻ': 'Recall the meaning, then tap to flip',
  '← Trước': '← Previous',
  'Tiếp →': 'Next →',
  'Đã thuộc, tiếp': 'Learned, next',
  'Phím tắt: Space lật thẻ · ← → chuyển thẻ': 'Shortcuts: Space flips · ← → move between cards',
  'Không còn thẻ nào trong bộ lọc này.': 'No cards left in this filter.',

  // Topic page
  '+ Thêm {n} từ tiếp theo vào hôm nay': "+ Add the next {n} words to today's list",
  'Hôm nay học: {n} từ →': 'Today: {n} words →',

  // Vocabulary home
  'Đã thuộc {a} / {b} từ thông dụng': 'Learned {a} / {b} core words',
  'Hôm nay học': "Today's words",
  '{n} từ đã chọn': '{n} words picked',
  'Mở danh sách →': 'Open list →',
  'Kiểm tra từ đã học': 'Review quiz',
  'nhìn nghĩa tiếng Việt, gõ từ tiếng Anh': 'see the Vietnamese meaning, type the English word',
  'Bắt đầu →': 'Start →',
  'Học từ bài viết': 'Learn from an article',
  'dán một bài tiếng Anh, lọc ra từ và cụm từ để học': 'paste an English text and pick out words and phrases to learn',
  'Mở →': 'Open →',
  'Tra từ tiếng Anh hoặc nghĩa tiếng Việt (vd: family, gia dinh)': 'Search English words or Vietnamese meanings (e.g. family, gia dinh)',
  'Tra từ': 'Search words',
  'Không tìm thấy từ nào khớp "{q}".': 'No words match "{q}".',
  '3000 từ thông dụng': '3000 core words',
  'Mở rộng': 'Extra topics',
  'Cụm': 'Phr',

  // Personal words
  'Chưa có từ nào.': 'No words yet.',
  'Khi': 'When you',
  'phân tích một bài viết': 'analyse an article',
  ', những từ chưa có trong từ điển của wiki có nút': ", words that are not in the wiki's dictionary get a",
  '+ Thêm vào Từ của tôi': '+ Add to My words',
  '. Bạn tự nhập nghĩa, câu trong bài được giữ làm ví dụ.': ' button. You enter the meaning; the sentence from the article becomes the example.',

  // Today
  '{n} từ': '{n} words',
  'mục tiêu {n} từ/ngày': 'goal {n} words/day',
  'Bấm lần nữa để xóa hết': 'Click again to clear everything',
  'Xóa danh sách hôm nay': "Clear today's list",
  'Muốn xem mình còn nhớ từ của những ngày trước?': 'Want to check whether you still remember earlier words?',
  'Kiểm tra từ đã học →': 'Review quiz →',
  'CÒN TỪ HÔM TRƯỚC': 'LEFT OVER FROM EARLIER',
  'Ngày {d} còn {n} từ chưa thuộc:': '{d}: {n} words not learned yet:',
  'Chuyển sang hôm nay': 'Move to today',
  'Danh sách hôm nay đang trống.': "Today's list is empty.",
  'Mở một': 'Open a',
  'chủ đề': 'topic',
  ', bấm': ', click',
  'cạnh từ bạn muốn học, hoặc bấm': 'next to the words you want to learn, or click',
  '+ Thêm 5 từ tiếp theo vào hôm nay': "+ Add the next 5 words to today's list",
  'ở đầu trang chủ đề.': 'at the top of a topic page.',

  // Review quiz
  'Hôm qua': 'Yesterday',
  '7 ngày qua': 'Last 7 days',
  '30 ngày qua': 'Last 30 days',
  'Chọn khoảng thời gian': 'Pick a time range',
  '{n} từ trong danh sách "Hôm nay học" của các ngày trước. Mỗi câu hiện nghĩa tiếng Việt, bạn gõ từ tiếng Anh.':
    '{n} words from the "Today\'s words" lists of earlier days. Each question shows the Vietnamese meaning; you type the English word.',
  'Chưa có từ nào để ôn trong khoảng này.': 'No words to review in this range.',
  'Bài ôn tập lấy từ danh sách': 'The quiz uses the',
  'của những ngày trước. Hãy chọn từ để học hôm nay, ngày mai quay lại đây để kiểm tra.':
    'lists of earlier days. Pick words to learn today, then come back tomorrow to test yourself.',
  'Bắt đầu kiểm tra': 'Start the quiz',
  'Câu {a} / {b} · Đúng {c}': 'Question {a} / {b} · Correct {c}',
  'Kết thúc': 'Finish',
  'Từ tiếng Anh nào có nghĩa là': 'Which English word means',
  'Gõ từ tiếng Anh rồi nhấn Enter': 'Type the English word and press Enter',
  'Câu trả lời': 'Answer',
  'Kiểm tra': 'Check',
  'Gợi ý chữ đầu': 'Show first letter',
  'Mình chưa nhớ': "I don't remember",
  'Chính xác!': 'Correct!',
  'Chưa đúng': 'Not quite',
  'Đáp án': 'Answer',
  'Bạn gõ:': 'You typed:',
  'Xem kết quả': 'See results',
  'Câu tiếp (Enter)': 'Next (Enter)',
  'Từ của mình cũng đúng': 'My word is also right',
  '{a} / {b} từ đúng': '{a} / {b} correct',
  'Còn {n} từ cần ôn lại.': '{n} words to review again.',
  'Bạn nhớ hết rồi.': 'You remembered them all.',
  'Bạn chưa trả lời câu nào.': "You haven't answered any questions.",
  'Kiểm tra lại {n} từ sai': 'Retry {n} wrong words',
  '✓ Đã thêm vào hôm nay': "✓ Added to today's list",
  'Thêm từ sai vào hôm nay': "Add wrong words to today's list",
  'Làm bài mới': 'New quiz',

  // Article analyser
  'Google Dịch': 'Google Translate',
  'Chưa đánh dấu': 'Not marked',
  'Chưa biết': "Don't know",
  'Đã biết': 'Know',
  'Ngoài từ điển': 'Not in dictionary',
  'Dán đoạn văn hoặc bài viết tiếng Anh': 'Paste an English paragraph or article',
  'Dán bài báo, email, tài liệu, comment trong PR… vào đây': 'Paste a news article, email, docs, PR comments… here',
  'Phân tích': 'Analyse',
  'Đang tải từ điển…': 'Loading dictionary…',
  'Thử với đoạn mẫu': 'Try a sample',
  'Xóa văn bản': 'Clear text',
  'Chỉ phân tích {n} ký tự đầu.': 'Only the first {n} characters are analysed.',
  'từ đơn': 'single words',
  'cụm từ': 'phrases',
  'đã biết': 'known',
  'chưa biết': "don't know",
  'chưa đánh dấu': 'not marked',
  'ngoài từ điển': 'not in dictionary',
  'Ẩn từ cơ bản (the, of, is…)': 'Hide basic words (the, of, is…)',
  'Ẩn tên riêng': 'Hide names',
  'Hiện bài viết đã tô màu': 'Show highlighted text',
  '· Bấm vào một từ để tới dòng của nó.': "· Click a word to jump to its row.",
  'Lọc theo loại': 'Filter by kind',
  'Lọc theo trạng thái': 'Filter by status',
  'Cụm từ ({n})': 'Phrases ({n})',
  'Từ đơn ({n})': 'Single words ({n})',
  'Tất cả ({n})': 'All ({n})',
  'Đánh dấu {n} từ chưa đánh dấu là "Đã biết"': 'Mark the {n} unmarked words as "Know"',
  '+ Thêm {n} từ "Chưa biết" vào hôm nay': '+ Add {n} "Don\'t know" words to today\'s list',
  '✓ Các từ "Chưa biết" đã có trong danh sách hôm nay.': '✓ The "Don\'t know" words are already in today\'s list.',
  'tên riêng?': 'name?',
  'Trong bài: {f}': 'In the text: {f}',
  'Chưa có trong từ điển của wiki.': "Not in the wiki's dictionary yet.",
  'Đang tra tự động…': 'Looking it up…',
  'Đã điền sẵn gợi ý từ từ điển công khai và MyMemory. Hãy kiểm tra lại trước khi lưu.':
    'Filled in suggestions from public dictionaries and MyMemory. Check them before saving.',
  'Không tra được tự động. Bạn tự điền, hoặc mở Cambridge / Google Dịch ở trên.':
    "Couldn't look it up. Fill it in yourself, or open Cambridge / Google Translate above.",
  'Định nghĩa (tiếng Anh):': 'Definition:',
  'Từ': 'Word',
  'Tra lại': 'Look up again',
  'Nghĩa tiếng Việt': 'Vietnamese meaning',
  'vd: có thể mở rộng': 'e.g. có thể mở rộng',
  'Loại từ': 'Part of speech',
  'Phiên âm': 'IPA',
  'không bắt buộc': 'optional',
  'Dịch câu ví dụ (không bắt buộc)': 'Vietnamese translation of the example (optional)',
  'Lưu và thêm vào hôm nay': "Save and add to today's list",
  'Đang dịch…': 'Translating…',
  'Gợi ý dịch câu': 'Suggest a translation',
  'Hủy': 'Cancel',
  'Không dịch được câu lúc này.': "Couldn't translate the sentence right now.",

  // Lesson header
  'Chương {n} · {t}': 'Chapter {n} · {t}',
  'Mục {n}': 'Lesson {n}',
}

const POS_LABEL_EN: Record<Pos, string> = {
  n: 'noun',
  v: 'verb',
  adj: 'adjective',
  adv: 'adverb',
  pron: 'pronoun',
  prep: 'preposition',
  conj: 'conjunction',
  det: 'determiner',
  num: 'number',
  modal: 'modal verb',
  int: 'interjection',
  phr: 'phrase',
}

export function useLocale() {
  const { lang } = useData()
  const isEn = computed(() => lang.value.startsWith('en'))
  /** Translates a Vietnamese UI string and fills {placeholders}. */
  const tr = (vi: string, params: Record<string, string | number> = {}) =>
    (isEn.value ? (EN[vi] ?? vi) : vi).replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? ''))
  /** Site path in the current language, with the deploy base. */
  const link = (path: string) => withBase((isEn.value ? '/en' : '') + path)
  const pos = computed(() => (isEn.value ? POS_LABEL_EN : POS_LABEL))
  const topicTitle = (slug: string) => {
    if (slug === MINE.slug) return isEn.value ? 'My words' : MINE.title
    const t = vocabTopics.find((x) => x.slug === slug)
    return t ? (isEn.value ? t.en : t.title) : slug
  }
  return { isEn, tr, link, pos, topicTitle }
}
