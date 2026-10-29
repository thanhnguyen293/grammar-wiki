# Reporting bugs and incidents

A good bug report helps other people fix things fast: what you did to make the bug happen, what you expected, what actually happened and how serious it is. When something breaks in production, you also need to give short, regular updates.

## Before you start

### Vocabulary

Learn these 15 words and phrases before you read the key phrases: tap the speaker to hear each one, then use **Flashcards** to test yourself.

<VocabTopic slug="cong-so-reporting-bugs" />

### Grammar

The phrases in this lesson mostly use these three grammar points.

| Grammar point | Used for | Example |
|---|---|---|
| [Present perfect](/tenses/present-perfect) | reporting something that just happened and still matters now | I'**ve found** a bug in the checkout screen. |
| [The passive in each tense](/passive/by-tense) | saying a problem was handled without saying who did it | The issue **has been fixed**. |
| [Present simple](/tenses/present-simple) | describing a bug that happens every time you follow the steps | The app **crashes** when I tap the Save button. |

## Key phrases

### 1. Saying you found a bug

- **I've found a bug in** the checkout screen.<br>*Mình phát hiện một lỗi ở màn hình thanh toán.*
- **The app crashes when** I tap the Save button.<br>*App bị crash khi mình bấm nút Lưu.*
- **Users haven't been able to log in** with Google **since** this morning.<br>*Từ sáng nay người dùng không đăng nhập bằng Google được.*
- **It only happens on** iOS 17.<br>*Lỗi chỉ xảy ra trên iOS 17.*

### 2. Describing the steps to reproduce

- **Here are the steps to reproduce:** open the app, go to Profile, then tap Edit.<br>*Đây là các bước tái hiện: mở app, vào Hồ sơ, rồi bấm Sửa.*
- **I can reproduce it** every time.<br>*Lần nào mình cũng tái hiện được.*
- **I can't reproduce it** on my device. Which phone are you using?<br>*Máy mình không tái hiện được. Bạn đang dùng điện thoại nào?*
- **It happens randomly**, about one time in ten.<br>*Lỗi xảy ra ngẫu nhiên, khoảng mười lần thì một lần.*

### 3. Expected and actual results

- **Expected:** the list refreshes. **Actual:** nothing happens.<br>*Mong đợi: danh sách được làm mới. Thực tế: không có gì xảy ra.*
- **It should show** an error message, **but instead** it shows a blank screen.<br>*Lẽ ra phải hiện thông báo lỗi, nhưng thay vào đó lại hiện màn hình trắng.*
- **I've attached** a screenshot and the logs.<br>*Mình đã đính kèm ảnh chụp màn hình và log.*

### 4. Saying how serious it is

- **This is a blocker.** We can't release until it's fixed.<br>*Đây là lỗi chặn. Chưa sửa xong thì chưa release được.*
- **It's a minor issue**, so it can wait until the next sprint.<br>*Đây là lỗi nhỏ, có thể đợi sprint sau.*
- **It affects** all Android users.<br>*Lỗi ảnh hưởng đến toàn bộ người dùng Android.*
- **There's a workaround:** users can log out and log in again.<br>*Có cách tạm thời: người dùng đăng xuất rồi đăng nhập lại.*

### 5. Giving updates during a production incident

- **We're looking into it.** I'll post an update in 30 minutes.<br>*Bọn mình đang kiểm tra. 30 phút nữa mình sẽ cập nhật.*
- **We've found the cause.** It was a wrong config in the last release.<br>*Đã tìm ra nguyên nhân. Do sai cấu hình ở bản release vừa rồi.*
- **We've rolled back** to the previous version.<br>*Bọn mình đã quay lại phiên bản trước.*
- **The issue has been fixed.** Everything is back to normal.<br>*Sự cố đã được khắc phục. Mọi thứ hoạt động bình thường trở lại.*

## A short bug report template

Use it when you create a Jira ticket or post in the bugs channel:

| Field | Meaning | Example |
|---|---|---|
| Title | Tiêu đề: chỗ nào, lỗi gì | **App crashes when saving a profile photo** |
| Steps to reproduce | Các bước tái hiện | 1. Open Profile 2. Tap the photo 3. Choose a photo and tap Save |
| Expected result | Kết quả mong đợi | The new photo is shown. |
| Actual result | Kết quả thực tế | The app closes. |
| Environment | Môi trường | iPhone 13, iOS 17.2, app 3.4.0 |
| Severity | Mức độ | High: affects all iOS 17 users. |

## Common mistakes

::: danger COMMON MISTAKES
| ✗ Wrong | ✓ Right | Why |
|---|---|---|
| The app is crash. | The app **crashes**. / The app **has crashed**. | **crash** is a verb here; it doesn't go after **is**. |
| The bug is fixed yesterday. | The bug **was fixed** yesterday. | With a past time (**yesterday**), the passive uses **was**. |
| It doesn't work. | The Save button **doesn't respond** when I tap it. | Too general: the reader can't tell what the bug is. |
| User can't login. | **Users** can't **log in**. | For users in general, use the plural; the verb is **log in** (two words), **login** is a noun. |
| I have found a bug yesterday. | I **found** a bug yesterday. | With a finished past time (**yesterday**), use the past simple, not the present perfect. |
:::

## Sample dialogue

On Monday morning, Linh (QA) messages Minh about a bug she has just found.

> **Linh:** Minh, **I've found a bug in** the new profile screen. **The app crashes when** I save a photo. \
> **Minh:** Thanks, Linh. **Can you reproduce it** every time? \
> **Linh:** Yes, but **it only happens on** iOS 17. **I've attached** the logs to the ticket. \
> **Minh:** Got it. How serious is it? \
> **Linh:** **It's a blocker.** **It affects** all iOS 17 users, and there's no **workaround**. \
> **Minh:** OK, **I'm looking into it** now. I'll update you in an hour. \
> **Minh:** **I've found the cause.** The image was too large. The fix is in review now.

::: details Vietnamese translation
**Linh:** Minh ơi, mình phát hiện một lỗi ở màn hình hồ sơ mới. App bị crash khi lưu ảnh.<br>
**Minh:** Cảm ơn Linh. Lần nào cũng tái hiện được à?<br>
**Linh:** Ừ, nhưng chỉ xảy ra trên iOS 17. Mình đã đính kèm log vào ticket rồi.<br>
**Minh:** Mình hiểu rồi. Lỗi nghiêm trọng đến mức nào?<br>
**Linh:** Lỗi chặn đấy. Ảnh hưởng toàn bộ người dùng iOS 17, và không có cách xử lý tạm.<br>
**Minh:** Được, mình kiểm tra ngay đây. Một tiếng nữa mình cập nhật nhé.<br>
**Minh:** Mình tìm ra nguyên nhân rồi. Ảnh quá lớn. Bản sửa đang được review.
:::

## Practice

Fill in the missing part of each key phrase from this lesson; the hint is the Vietnamese meaning. When you finish, read the whole sentence out loud.

<PhraseDrill lesson="reporting-bugs" />

## Remember

::: warning SUMMARY
- A bug report has 4 parts: steps to reproduce, expected, actual, environment.
- Be specific: **The app crashes when …** instead of **It doesn't work.**
- Say how serious it is: **blocker**, **minor issue**, **It affects …**, **There's a workaround.**
- During an incident: **We're looking into it.** → **We've found the cause.** → **The issue has been fixed.**
:::

See also: [Present perfect](/tenses/present-perfect) · [The passive in each tense](/passive/by-tense) · [Giving and receiving code review feedback](./code-review)
