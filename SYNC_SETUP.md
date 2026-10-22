# Cài đặt đồng bộ tài khoản (Firebase)

Nút **Đồng bộ** trên thanh menu cho phép đăng nhập bằng Google và lưu tiến độ học vào tài khoản: từ đã thuộc, đánh dấu "chưa biết", danh sách Hôm nay học, Từ của tôi và lịch sử ôn tập. Nút chỉ hiện khi [docs/.vitepress/firebase.config.ts](docs/.vitepress/firebase.config.ts) có cấu hình.

Firebase gói miễn phí (Spark) đủ cho dùng cá nhân.

Project đang dùng: **`grammar-wiki-tn293`** ([console](https://console.firebase.google.com/project/grammar-wiki-tn293/overview)). Khi sửa [firestore.rules](firestore.rules), đưa lên bằng:

```bash
firebase deploy --only firestore:rules --project grammar-wiki-tn293
```

Các bước dưới đây là cách dựng lại từ đầu nếu cần một project khác.

## 1. Tạo project

1. Mở https://console.firebase.google.com, bấm **Create a project** (hoặc **Add project**), đặt tên, ví dụ `grammar-wiki`. Có thể tắt Google Analytics.

## 2. Bật đăng nhập Google

1. Menu trái: **Build → Authentication → Get started**.
2. Tab **Sign-in method** → **Google** → bật **Enable**, chọn email hỗ trợ → **Save**.
3. Tab **Settings → Authorized domains** → **Add domain** → nhập `thanhnguyen293.github.io`. (`localhost` đã có sẵn để chạy thử ở máy.)

## 3. Tạo Firestore

1. **Build → Firestore Database → Create database**.
2. Chọn vị trí gần Việt Nam, ví dụ `asia-southeast1 (Singapore)`, chế độ **production**.
3. Tab **Rules**: xóa nội dung cũ, dán toàn bộ file [firestore.rules](firestore.rules) → **Publish**. Quy tắc này chỉ cho mỗi người đọc và ghi đúng tài liệu của chính họ.

## 4. Lấy cấu hình web

1. Bấm bánh răng cạnh **Project Overview → Project settings**.
2. Mục **Your apps** → biểu tượng **Web `</>`** → đặt tên app → **Register app** (không cần Firebase Hosting).
3. Sao chép object `firebaseConfig` (gồm `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`) và dán vào `docs/.vitepress/firebase.config.ts`:

```ts
export const firebaseConfig: FirebaseOptions | null = {
  apiKey: '...',
  authDomain: '...',
  projectId: '...',
  storageBucket: '...',
  messagingSenderId: '...',
  appId: '...',
}
```

Các giá trị này là định danh công khai của project web, được phép nằm trong mã nguồn; dữ liệu được bảo vệ bởi quy tắc Firestore ở bước 3.

## Cách đồng bộ hoạt động

- Trình duyệt vẫn là bản làm việc chính: mọi thao tác lưu ngay vào máy, rồi khoảng 1,5 giây sau được gửi lên tài khoản.
- Khi đăng nhập trên máy mới, dữ liệu trên máy và trên tài khoản được **gộp lại**, không ghi đè. Với cùng một từ, thao tác làm sau cùng thắng (kể cả bỏ đánh dấu, xóa từ).
- Mở web trên hai máy cùng lúc thì thay đổi ở máy này hiện sang máy kia sau vài giây.
- Số câu ôn tập trong cùng một ngày ở hai máy khác nhau không cộng dồn: giữ số lớn hơn.
- Đoạn văn đang dán ở trang Học từ bài viết và tùy chọn ẩn thanh bên không được đồng bộ.
- Đăng xuất không xóa dữ liệu trên máy.
