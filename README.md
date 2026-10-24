# Sổ Tay Ngữ Pháp

Wiki lý thuyết ngữ pháp tiếng Anh cho người Việt học lại từ đầu. Nội dung sắp theo 9 chương của cuốn *Giải thích ngữ pháp tiếng Anh* (Mai Lan Hương – Hà Thanh Uyên), tự biên soạn lại, mỗi quy tắc đều có ví dụ kèm dịch nghĩa. Mỗi bài được gắn nhãn **Vòng 1**, **Vòng 2** hoặc **Tra cứu** theo lộ trình học.

Phần **Từ vựng** (`/vocabulary/`) có 3000 từ thông dụng chia theo 28 chủ đề, cộng 250 từ chuyên ngành công nghệ thông tin cho mobile developer. Mỗi từ có phiên âm, loại từ, nghĩa, câu ví dụ có dịch, nút nghe phát âm (giọng đọc của trình duyệt), chế độ thẻ ghi nhớ, ẩn nghĩa để tự kiểm tra và đánh dấu đã thuộc (lưu trên trình duyệt). Ngoài ra có 500 cụm từ thông dụng (phrasal verb, collocation, thành ngữ), danh sách **Hôm nay học**, trang **Kiểm tra từ đã học** (nhìn nghĩa, gõ từ) và trang **Học từ bài viết**: dán một bài tiếng Anh, wiki đưa từ về dạng gốc, gom cụm từ, cho đánh dấu đã biết / chưa biết và thêm từ vào danh sách học.

Web có hai ngôn ngữ: tiếng Anh (gốc `/`, mặc định) và tiếng Việt (`/vi/`), đổi bằng menu ngôn ngữ trên thanh điều hướng. Mọi đường dẫn đều bằng tiếng Anh (ví dụ `/tenses/present-simple`); link cũ kiểu `/2-thi/hien-tai-don` hay `/en/...` tự chuyển sang trang mới. Bản tiếng Anh dịch giao diện và 48 bài ngữ pháp; câu ví dụ vẫn giữ dòng dịch tiếng Việt và từ vựng vẫn giữ nghĩa tiếng Việt.

Có thể đăng nhập Google để đồng bộ tiến độ giữa các máy (Firebase); cách cài đặt xem [SYNC_SETUP.md](SYNC_SETUP.md).

Xây bằng [VitePress](https://vitepress.dev): mỗi bài là một file Markdown, có sẵn tìm kiếm, sidebar, chế độ sáng/tối.

## Chạy

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # xuất web tĩnh ra docs/.vitepress/dist
npm run preview   # xem bản build
npm run check     # kiểm tra dữ liệu từ vựng
```

Cần Node 18 trở lên.

## Deploy

Mỗi lần push lên nhánh `main`, GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) kiểm tra dữ liệu từ vựng, build và đưa web lên GitHub Pages tại https://thanhnguyen293.github.io/grammar-wiki/. Workflow đặt `VITEPRESS_BASE=/<tên-repo>/` vì Pages phục vụ web dưới đường dẫn con; chạy ở máy thì base là `/`.

## Cấu trúc

```
docs/
  index.md                 trang chủ (tiếng Anh, gốc web)
  vi/                      bản tiếng Việt, cùng tên file với bản tiếng Anh
  study-path.md            lộ trình Vòng 1 / Vòng 2 / Tra cứu
  parts-of-speech/ … word-study/
    index.md               trang chương (tự liệt kê các bài)
    <slug>.md              từng bài
  vocabulary/              trang từ vựng: tổng quan, hôm nay, ôn tập, chủ đề
  .vitepress/
    chapters.ts            danh sách chương, bài, nhãn vòng học
    config.mts             cấu hình site, sidebar sinh từ chapters.ts
    vocabTopics.ts         danh sách chủ đề từ vựng
    theme/                 CSS và các component (thanh nhãn bài, danh sách bài, từ vựng)
      components/textAnalyze.ts  tách từ, đưa về dạng gốc, nhận diện cụm từ trong bài viết
      components/i18n.ts         chuỗi giao diện tiếng Anh (khóa là chuỗi tiếng Việt)
      components/sync.ts         đăng nhập Google và đồng bộ tiến độ lên Firestore
    legacyPaths.ts         đường dẫn cũ (slug tiếng Việt, /en/) → đường dẫn mới
    firebase.config.ts     cấu hình Firebase (null = tắt đồng bộ)
  data/
    vocab/<slug>.json      từ của từng chủ đề, xếp từ thông dụng nhất xuống
    relations.json         họ từ, từ đồng nghĩa, trái nghĩa
firestore.rules            quy tắc bảo mật Firestore cho dữ liệu đồng bộ
scripts/
  vocab-plan.json          danh sách 3000 từ đã chốt cho từng chủ đề
  check-vocab.mjs          kiểm tra định dạng, số lượng, trùng lặp
```

## Thêm hoặc sửa bài

Xem [CONTENT_GUIDE.md](CONTENT_GUIDE.md). Tóm tắt: thêm một dòng vào `chapters.ts`, tạo file `.md` cùng slug, viết theo bài mẫu [docs/vi/tenses/present-simple.md](docs/vi/tenses/present-simple.md).
