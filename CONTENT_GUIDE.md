# Hướng dẫn viết bài

Mỗi bài là một file Markdown trong `docs/vi/<thư-mục-chương>/<slug>.md` (bản tiếng Việt) và `docs/<thư-mục-chương>/<slug>.md` (bản tiếng Anh, ở gốc web). Thư mục và slug đều là tiếng Anh, ví dụ `tenses/present-simple`. Danh sách chương, slug, tên bài và nhãn vòng học nằm ở [docs/.vitepress/chapters.ts](docs/.vitepress/chapters.ts). Sidebar, trang chương và trang lộ trình đều sinh ra từ file đó, nên khi thêm bài mới chỉ cần thêm một dòng ở đó và tạo file `.md` tương ứng.

Bài mẫu: [docs/vi/tenses/present-simple.md](docs/vi/tenses/present-simple.md). Bài mới theo đúng cấu trúc và mật độ ví dụ của bài này.

## Người đọc

Người Việt mất gốc tiếng Anh, vốn từ ít. Họ cần **thấy được** quy tắc qua ví dụ, không cần thuật ngữ. Viết tiếng Việt ngắn, rõ, câu chủ động. Ví dụ tiếng Anh dùng từ vựng đơn giản, tình huống đời thường (gia đình, đi học, đi làm, mua sắm, du lịch).

## Cấu trúc một bài

1. `# Tên bài` — đúng tên trong `chapters.ts`. Không cần frontmatter; nhãn vòng học và số mục tự hiện.
2. Một đoạn mở đầu 1–2 câu: dùng để làm gì, khi nào gặp.
3. `## Công thức` (khi bài có cấu trúc câu) trong khung `::: info CÔNG THỨC`, dạng bảng **Dạng | Cấu trúc | Ví dụ**.
4. `## Cách dùng` — mỗi cách dùng là một `### 1. …`, mỗi mục có **3–4 ví dụ** có dịch nghĩa.
5. Các phần riêng của chủ điểm (dấu hiệu nhận biết, bảng so sánh, bảng phân biệt, ngoại lệ…). Bảng nào cũng có cột **Ví dụ**.
6. `## Lỗi hay gặp` — khung `::: danger LỖI HAY GẶP`, bảng **✗ Sai | ✓ Đúng | Vì sao**, 3–5 dòng.
7. `## Ví dụ trong ngữ cảnh` — một đoạn hội thoại hoặc đoạn văn 5–8 dòng dùng chủ điểm tự nhiên, phần ngữ pháp in đậm, rồi khung `::: details Xem bản dịch`.
8. `## Ghi nhớ` — khung `::: warning TÓM TẮT`, 3–4 gạch đầu dòng.
9. Dòng `Xem thêm:` với 1–3 liên kết tới bài liên quan.

Bài nhãn **Tra cứu** có thể bỏ phần 7, nhưng vẫn cần ví dụ trong bảng.

## Quy ước định dạng

**Ví dụ** luôn viết thành danh sách, câu tiếng Anh trước, `<br>` rồi nghĩa tiếng Việt in nghiêng. Phần ngữ pháp đang học in đậm:

```md
- My dad **goes** to work by bus.<br>*Bố tôi đi làm bằng xe buýt.*
```

**Khung màu** (đúng tiêu đề viết hoa như dưới):

| Khung | Dùng cho |
|---|---|
| `::: info CÔNG THỨC` | Công thức, cấu trúc câu |
| `::: warning QUAN TRỌNG` | Quy tắc phải nhớ (tối đa 2 khung mỗi bài) |
| `::: warning TÓM TẮT` | Phần Ghi nhớ cuối bài |
| `::: danger LỖI HAY GẶP` | Lỗi sai thường gặp |
| `::: tip MẸO` | Mẹo nhớ, ghi chú thêm |
| `::: details Xem bản dịch` | Bản dịch đoạn hội thoại |

**Hội thoại** đặt trong `>`; mỗi dòng (trừ dòng cuối) kết thúc bằng ` \` để xuống dòng:

```md
> **Lan:** What **do** you **do**, Minh? \
> **Minh:** I'**m** a nurse.
```

Trong bản dịch, mỗi dòng kết thúc bằng `<br>` (trừ dòng cuối).

**Liên kết**: cùng chương dùng `./slug`, khác chương dùng `/vi/thu-muc-chuong/slug` (ví dụ `/vi/conditionals/types`).

**Không** dùng emoji, không dùng ký tự `|` trong ô bảng (sẽ vỡ bảng), không chép nguyên văn từ sách.

## Kiểm tra trước khi xong

- Mọi câu ví dụ đúng ngữ pháp và có dịch nghĩa.
- Mỗi cách dùng có ít nhất 3 ví dụ.
- `npm run dev` rồi mở bài: không vỡ bảng, khung hiện đúng màu.

# Giao tiếp công sở IT

Mục `/workplace/` dạy tiếng Anh giao tiếp ở công ty công nghệ, mỗi bài là một tình huống (họp, stand-up, review code…). Danh sách bài nằm ở [docs/.vitepress/workplace.ts](docs/.vitepress/workplace.ts); sidebar, trang mục lục và thanh trên đầu bài sinh từ đó. File: `docs/vi/workplace/<slug>.md` và `docs/workplace/<slug>.md`. Bài mẫu: [docs/vi/workplace/introductions.md](docs/vi/workplace/introductions.md).

Người đọc là dân IT người Việt đi làm, biết từ chuyên ngành nhưng ngại nói. Câu mẫu ngắn, dùng được ngay, tình huống thật (Jira, Slack, pull request, sprint, release). Tên nhân vật trộn tên Việt và tên nước ngoài.

Cấu trúc: học kiến thức nền trước, rồi mới đến mẫu câu, cuối bài luyện lại mẫu câu.

1. `# Tên bài` đúng tên trong `workplace.ts`, rồi 1–2 câu mở đầu: tình huống nào, nói với ai.
2. `## Cần biết trước` gồm:
   - `### Từ vựng`: một câu dẫn rồi `<VocabTopic slug="cong-so-<slug>" />`. Từ của bài nằm ở `docs/data/vocab/cong-so-<slug>.json` (15 từ, cùng quy ước 7 trường như phần Từ vựng bên dưới) và khai báo trong `vocabTopics.ts` với `track: 'work'`. Một từ chỉ xuất hiện ở một bài giao tiếp.
   - `### Ngữ pháp`: bảng **Điểm ngữ pháp | Dùng để | Ví dụ**, 2–3 dòng, cột đầu là liên kết tới bài ngữ pháp, ví dụ lấy từ chính bài này.
3. `## Mẫu câu` gồm 4–6 nhóm `### 1. …` theo mục đích, mỗi nhóm 3–4 câu. Câu tiếng Anh trước, `<br>` rồi nghĩa tiếng Việt in nghiêng. **Phần in đậm thành chỗ trống trong bài luyện tập**, nên chỉ in đậm cụm cần học, không in đậm cả câu.
4. Phần riêng của tình huống khi cần, ví dụ bảng **Nghe hơi cứng | Tự nhiên hơn | Vì sao** để chỉ cách nói lịch sự.
5. `## Lỗi hay gặp`: khung `::: danger LỖI HAY GẶP`, bảng **✗ Sai | ✓ Đúng | Vì sao**, 4–5 lỗi người Việt hay mắc.
6. `## Hội thoại mẫu`: một câu nói bối cảnh, đoạn hội thoại 6–10 dòng, mẫu câu in đậm, rồi `::: details Xem bản dịch`.
7. `## Luyện tập`: một câu dẫn rồi `<PhraseDrill lesson="<slug>" />`. Bài tập tự lấy các câu trong phần Mẫu câu của bản tiếng Việt (`phrases.data.ts`), không cần chép lại.
8. `## Ghi nhớ`: khung `::: warning TÓM TẮT`, 3–4 gạch đầu dòng.
9. `Xem thêm:` 2–3 liên kết (bài ngữ pháp liên quan, bài giao tiếp kế tiếp), ngăn bằng ` · `.

Bản tiếng Anh đổi tiêu đề: Cần biết trước → Before you start, Từ vựng → Vocabulary, Ngữ pháp → Grammar, Mẫu câu → Key phrases, Hội thoại mẫu → Sample dialogue, Lỗi hay gặp → Common mistakes, Luyện tập → Practice, Ghi nhớ → Remember; cột **Vì sao** dịch sang tiếng Anh.

# Từ vựng theo chủ đề

Danh sách chủ đề nằm ở [docs/.vitepress/vocabTopics.ts](docs/.vitepress/vocabTopics.ts). Từ của mỗi chủ đề nằm trong `docs/data/vocab/<slug>.json`, là một mảng **xếp theo nhóm nghĩa**: từ đồng nghĩa, trái nghĩa, cùng họ hoặc cùng một bộ nhỏ (grandfather, grandmother, grandpa, grandma) đứng cạnh nhau, nhóm thông dụng hơn đứng trước. Thêm từ mới thì đặt cạnh nhóm của nó. Tiến độ học lưu theo chủ đề + từ chứ không theo vị trí, nên đổi thứ tự trong một chủ đề không ảnh hưởng dữ liệu người học; chuyển từ sang chủ đề khác thì có. `slug` là mã cố định của chủ đề (lưu cùng tiến độ học, không đổi); URL của trang dùng trường `path`. Trang chủ đề `docs/vocabulary/<path>.md` và `docs/vi/vocabulary/<path>.md` chỉ chứa `<VocabTopic slug="..." />`. Nhóm hiển thị trên sidebar khai báo ở `topicGroups`.

Mỗi từ có đúng 7 trường:

```json
{ "w": "family", "ipa": "/ˈfæməli/", "pos": "n", "vi": "gia đình", "ex": "My family lives in Hanoi.", "exVi": "Gia đình tôi sống ở Hà Nội.", "lv": "A1" }
```

| Trường | Quy ước |
|---|---|
| `w` | Từ gốc, chữ thường. Mỗi từ chỉ xuất hiện ở **một** chủ đề trong toàn bộ site. |
| `ipa` | Phiên âm Anh-Mỹ, đặt trong `/…/`, có dấu trọng âm `ˈ` với từ nhiều âm tiết. |
| `pos` | `n`, `v`, `adj`, `adv`, `pron`, `prep`, `conj`, `det`, `num`, `modal`, `int`, `phr` — loại từ của nghĩa chính. |
| `vi` | Nghĩa tiếng Việt ngắn gọn, nghĩa phổ biến nhất trước; nhiều nghĩa ngăn bằng dấu phẩy, tối đa 3 nghĩa. |
| `ex` | Một câu ví dụ ngắn (dưới ~12 từ), đời thường, đúng ngữ pháp, chứa từ đó, kết thúc bằng `.` `?` hoặc `!`. |
| `exVi` | Bản dịch tự nhiên của câu ví dụ. |
| `lv` | Trình độ ước lượng: `A1`, `A2`, `B1` hoặc `B2`. |

Kiểm tra: `npm run check` (hoặc `node scripts/check-vocab.mjs <slug>` cho một chủ đề).

# Bản tiếng Anh (English version)

The English site is the root of the web (`docs/`); the Vietnamese one lives under `docs/vi/` with the same folder and file names (`docs/vi/tenses/present-simple.md` mirrors `docs/tenses/present-simple.md`). All folder names and slugs are English. Links from before this layout (Vietnamese slugs, English under `/en/`) still work: `docs/.vitepress/legacyPaths.ts` maps them to the new pages.

When writing or updating an English lesson:

- Translate all Vietnamese prose (intro, explanations, table headers and cells, notes, "Vì sao" column) into plain, simple English that an intermediate learner can read. Same structure, same examples, same headings order.
- H1 = the English title from `docs/.vitepress/chapters.ts` (`en` field of the section).
- Keep every English example sentence unchanged, and **keep its Vietnamese translation line** (`<br>*...*`): readers are still Vietnamese learners.
- Container titles: `::: info FORMULA`, `::: warning IMPORTANT`, `::: warning SUMMARY`, `::: danger COMMON MISTAKES`, `::: tip TIP`, `::: details Vietnamese translation` (the dialogue translation stays Vietnamese).
- Section headings: Công thức → Formula, Cách dùng → How to use, Dấu hiệu nhận biết → Signal words, Lỗi hay gặp → Common mistakes, Ví dụ trong ngữ cảnh → In context, Ghi nhớ → Remember, "Xem thêm:" → "See also:".
- Links: same-chapter `./slug` stays as is; links to another chapter start at the root (e.g. `/conditionals/types`), while Vietnamese pages use `/vi/` (e.g. `/vi/conditionals/types`).
