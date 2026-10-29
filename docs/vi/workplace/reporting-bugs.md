# Báo lỗi & sự cố

Một bản báo lỗi tốt giúp người khác sửa nhanh: làm gì thì lỗi xảy ra, mong đợi gì, thực tế ra sao và nghiêm trọng đến mức nào. Khi có sự cố trên production, bạn còn cần cập nhật tình hình ngắn gọn và đều đặn.

## Cần biết trước

### Từ vựng

Học 15 từ và cụm từ này trước khi đọc mẫu câu: bấm loa để nghe, rồi dùng **Thẻ ghi nhớ** để tự kiểm tra.

<VocabTopic slug="cong-so-reporting-bugs" />

### Ngữ pháp

Bài này dùng nhiều nhất ba điểm ngữ pháp sau.

| Điểm ngữ pháp | Dùng để | Ví dụ |
|---|---|---|
| [Hiện tại hoàn thành](/vi/tenses/present-perfect) | báo việc vừa xảy ra, kết quả còn đến giờ | I'**ve found** a bug in the checkout screen. |
| [Bị động theo từng thì](/vi/passive/by-tense) | nói lỗi đã được xử lý mà không cần nói ai làm | The issue **has been fixed**. |
| [Hiện tại đơn](/vi/tenses/present-simple) | mô tả lỗi lặp lại mỗi lần làm theo các bước | The app **crashes** when I tap the Save button. |

## Mẫu câu

### 1. Báo có lỗi

- **I've found a bug in** the checkout screen.<br>*Mình phát hiện một lỗi ở màn hình thanh toán.*
- **The app crashes when** I tap the Save button.<br>*App bị crash khi mình bấm nút Lưu.*
- **Users haven't been able to log in** with Google **since** this morning.<br>*Từ sáng nay người dùng không đăng nhập bằng Google được.*
- **It only happens on** iOS 17.<br>*Lỗi chỉ xảy ra trên iOS 17.*

### 2. Mô tả các bước tái hiện

- **Here are the steps to reproduce:** open the app, go to Profile, then tap Edit.<br>*Đây là các bước tái hiện: mở app, vào Hồ sơ, rồi bấm Sửa.*
- **I can reproduce it** every time.<br>*Lần nào mình cũng tái hiện được.*
- **I can't reproduce it** on my device. Which phone are you using?<br>*Máy mình không tái hiện được. Bạn đang dùng điện thoại nào?*
- **It happens randomly**, about one time in ten.<br>*Lỗi xảy ra ngẫu nhiên, khoảng mười lần thì một lần.*

### 3. Kết quả mong đợi và thực tế

- **Expected:** the list refreshes. **Actual:** nothing happens.<br>*Mong đợi: danh sách được làm mới. Thực tế: không có gì xảy ra.*
- **It should show** an error message, **but instead** it shows a blank screen.<br>*Lẽ ra phải hiện thông báo lỗi, nhưng thay vào đó lại hiện màn hình trắng.*
- **I've attached** a screenshot and the logs.<br>*Mình đã đính kèm ảnh chụp màn hình và log.*

### 4. Nói mức độ nghiêm trọng

- **This is a blocker.** We can't release until it's fixed.<br>*Đây là lỗi chặn. Chưa sửa xong thì chưa release được.*
- **It's a minor issue**, so it can wait until the next sprint.<br>*Đây là lỗi nhỏ, có thể đợi sprint sau.*
- **It affects** all Android users.<br>*Lỗi ảnh hưởng đến toàn bộ người dùng Android.*
- **There's a workaround:** users can log out and log in again.<br>*Có cách tạm thời: người dùng đăng xuất rồi đăng nhập lại.*

### 5. Cập nhật khi có sự cố trên production

- **We're looking into it.** I'll post an update in 30 minutes.<br>*Bọn mình đang kiểm tra. 30 phút nữa mình sẽ cập nhật.*
- **We've found the cause.** It was a wrong config in the last release.<br>*Đã tìm ra nguyên nhân. Do sai cấu hình ở bản release vừa rồi.*
- **We've rolled back** to the previous version.<br>*Bọn mình đã quay lại phiên bản trước.*
- **The issue has been fixed.** Everything is back to normal.<br>*Sự cố đã được khắc phục. Mọi thứ hoạt động bình thường trở lại.*

## Mẫu báo lỗi ngắn

Dùng khi tạo ticket trên Jira hoặc nhắn vào kênh báo lỗi:

| Mục | Nghĩa | Ví dụ |
|---|---|---|
| Title | Tiêu đề: chỗ nào, lỗi gì | **App crashes when saving a profile photo** |
| Steps to reproduce | Các bước tái hiện | 1. Open Profile 2. Tap the photo 3. Choose a photo and tap Save |
| Expected result | Kết quả mong đợi | The new photo is shown. |
| Actual result | Kết quả thực tế | The app closes. |
| Environment | Môi trường | iPhone 13, iOS 17.2, app 3.4.0 |
| Severity | Mức độ | High: affects all iOS 17 users. |

## Lỗi hay gặp

::: danger LỖI HAY GẶP
| ✗ Sai | ✓ Đúng | Vì sao |
|---|---|---|
| The app is crash. | The app **crashes**. / The app **has crashed**. | **crash** là động từ, không đi sau **is**. |
| The bug is fixed yesterday. | The bug **was fixed** yesterday. | Có mốc quá khứ (**yesterday**) thì bị động dùng **was**. |
| It doesn't work. | The Save button **doesn't respond** when I tap it. | Câu quá chung, người đọc không biết lỗi gì. |
| User can't login. | **Users** can't **log in**. | Nói chung người dùng thì số nhiều; động từ là **log in** (hai chữ), **login** là danh từ. |
| I have found a bug yesterday. | I **found** a bug yesterday. | Có mốc quá khứ (**yesterday**) thì dùng quá khứ đơn, không dùng hiện tại hoàn thành. |
:::

## Hội thoại mẫu

Sáng thứ Hai, Linh (QA) nhắn cho Minh về lỗi vừa phát hiện.

> **Linh:** Minh, **I've found a bug in** the new profile screen. **The app crashes when** I save a photo. \
> **Minh:** Thanks, Linh. **Can you reproduce it** every time? \
> **Linh:** Yes, but **it only happens on** iOS 17. **I've attached** the logs to the ticket. \
> **Minh:** Got it. How serious is it? \
> **Linh:** **It's a blocker.** **It affects** all iOS 17 users, and there's no **workaround**. \
> **Minh:** OK, **I'm looking into it** now. I'll update you in an hour. \
> **Minh:** **I've found the cause.** The image was too large. The fix is in review now.

::: details Xem bản dịch
**Linh:** Minh ơi, mình phát hiện một lỗi ở màn hình hồ sơ mới. App bị crash khi lưu ảnh.<br>
**Minh:** Cảm ơn Linh. Lần nào cũng tái hiện được à?<br>
**Linh:** Ừ, nhưng chỉ xảy ra trên iOS 17. Mình đã đính kèm log vào ticket rồi.<br>
**Minh:** Mình hiểu rồi. Lỗi nghiêm trọng đến mức nào?<br>
**Linh:** Lỗi chặn đấy. Ảnh hưởng toàn bộ người dùng iOS 17, và không có cách xử lý tạm.<br>
**Minh:** Được, mình kiểm tra ngay đây. Một tiếng nữa mình cập nhật nhé.<br>
**Minh:** Mình tìm ra nguyên nhân rồi. Ảnh quá lớn. Bản sửa đang được review.
:::

## Luyện tập

Điền phần còn thiếu của các mẫu câu trong bài, gợi ý là nghĩa tiếng Việt. Làm xong hãy đọc to cả câu.

<PhraseDrill lesson="reporting-bugs" />

## Ghi nhớ

::: warning TÓM TẮT
- Báo lỗi đủ 4 ý: các bước tái hiện, mong đợi, thực tế, môi trường.
- Mô tả cụ thể: **The app crashes when …** thay cho **It doesn't work.**
- Nói mức độ: **blocker**, **minor issue**, **It affects …**, **There's a workaround.**
- Khi có sự cố: **We're looking into it.** → **We've found the cause.** → **The issue has been fixed.**
:::

Xem thêm: [Hiện tại hoàn thành](/vi/tenses/present-perfect) · [Bị động theo từng thì](/vi/passive/by-tense) · [Góp ý & nhận góp ý khi review code](./code-review)
