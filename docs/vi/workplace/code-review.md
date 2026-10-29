# Góp ý & nhận góp ý khi review code

Review code là góp ý cho code, không phải cho con người. Tiếng Anh ở công sở nói rất mềm: đặt câu hỏi, gợi ý, dùng **we** thay cho **you**. Khi nhận góp ý, bạn cảm ơn, sửa, hoặc giải thích lý do mình làm vậy.

## Cần biết trước

### Từ vựng

Học 15 từ và cụm từ này trước khi đọc mẫu câu: bấm loa để nghe, rồi dùng **Thẻ ghi nhớ** để tự kiểm tra.

<VocabTopic slug="cong-so-code-review" />

### Ngữ pháp

Góp ý mềm mỏng dựa vào ba điểm ngữ pháp sau.

| Điểm ngữ pháp | Dùng để | Ví dụ |
|---|---|---|
| [Động từ khiếm khuyết cơ bản](/vi/parts-of-speech/modal-verbs) | gợi ý và nhờ lịch sự bằng câu hỏi | **Could we** move this logic into a separate function? |
| [V-ing và to V](/vi/parts-of-speech/gerunds-infinitives) | sau giới từ (**about**, **instead of**) dùng V-ing | What do you think about **using** a map here? |
| [Tương lai đơn & be going to](/vi/tenses/future-simple) | hứa sẽ sửa ngay khi nhận góp ý | Good catch! I'**ll fix** it. |

## Mẫu câu

### 1. Gợi ý nhẹ nhàng

- **Could we** move this logic into a separate function?<br>*Mình tách đoạn logic này ra một hàm riêng được không?*
- **What do you think about** using a map here **instead of** a loop?<br>*Bạn thấy dùng map ở đây thay cho vòng lặp thì sao?*
- **It might be better to** check for null first.<br>*Có lẽ nên kiểm tra null trước thì hơn.*
- **Have you considered** caching this result?<br>*Bạn đã tính đến việc cache kết quả này chưa?*

### 2. Góp ý nhỏ, không bắt buộc

- **Nit:** this variable name could be clearer.<br>*Góp ý nhỏ: tên biến này có thể rõ nghĩa hơn.*
- **Minor:** there's an extra blank line here.<br>*Chuyện nhỏ: ở đây thừa một dòng trống.*
- **Not a blocker, but** we could reuse the existing helper.<br>*Không bắt buộc, nhưng mình có thể dùng lại hàm helper có sẵn.*
- **Feel free to ignore this**, it's just personal preference.<br>*Bỏ qua cũng được, chỉ là sở thích cá nhân thôi.*

### 3. Hỏi để hiểu

- **Can you explain why** you added this delay?<br>*Bạn giải thích giúp vì sao thêm đoạn delay này được không?*
- **I'm not sure I understand** this part. **What happens if** the list is empty?<br>*Mình chưa hiểu lắm phần này. Nếu danh sách rỗng thì sao?*
- **Is there a reason** we're not using the shared component?<br>*Có lý do gì mà mình không dùng component dùng chung không?*

### 4. Nhận góp ý

- **Good catch!** I'll fix it.<br>*Bắt lỗi hay đấy! Mình sẽ sửa.*
- **Thanks, that makes sense.** **Updated.**<br>*Cảm ơn, hợp lý đấy. Đã sửa.*
- **Done.** **Could you take another look?**<br>*Xong rồi. Bạn xem lại giúp mình nhé?*
- **I'll handle that in a separate PR**, if that's OK.<br>*Phần đó mình sẽ làm ở một PR riêng, nếu được nhé.*

### 5. Giải thích lựa chọn của mình

- **I did it this way because** the API returns the data in pages.<br>*Mình làm vậy vì API trả dữ liệu theo từng trang.*
- **I considered that, but** it would make the tests harder to write.<br>*Mình đã tính đến cách đó, nhưng như vậy test sẽ khó viết hơn.*
- **I see your point.** **How about** we keep it for now and refactor later?<br>*Mình hiểu ý bạn. Hay là tạm giữ như vậy rồi refactor sau?*

### 6. Duyệt PR

- **Looks good to me.** **Approved.**<br>*Mình thấy ổn. Đã duyệt.*
- **Nice work!** **Just one small comment**, otherwise good to go.<br>*Làm tốt lắm! Chỉ có một góp ý nhỏ, còn lại merge được rồi.*
- **Approved with minor comments.**<br>*Đã duyệt, kèm vài góp ý nhỏ.*

## Nói sao cho tự nhiên

| Nghe hơi cứng | Tự nhiên hơn | Vì sao |
|---|---|---|
| This is wrong. | **I think** this might cause a bug when the list is empty. | Nói cụ thể vấn đề, kèm **I think** cho mềm hơn. |
| You must use a map. | **What do you think about** using a map here? | Câu hỏi mời ý kiến thay cho mệnh lệnh. |
| Why did you do this? | **Can you explain** the reason for this change? | **Why did you** dễ nghe như trách móc. |
| You forgot the tests. | **Could we** add a test for this case? | Dùng **we**: cả team cùng chịu trách nhiệm cho code. |
| Bad name. | **Nit:** maybe **userList** would be clearer? | Đánh dấu góp ý nhỏ và đưa ra phương án. |

## Lỗi hay gặp

::: danger LỖI HAY GẶP
| ✗ Sai | ✓ Đúng | Vì sao |
|---|---|---|
| Please leave some comment on my PR. | Please leave **some comments** on my PR. | **comment** đếm được, sau **some** dùng số nhiều. |
| I fixed already. | I've **already fixed** it. | Việc vừa xong dùng hiện tại hoàn thành, và **fix** cần tân ngữ **it**. |
| Thank you for your comment, I will fix. | Thanks for the comment. **I'll fix it.** | **fix** là ngoại động từ, cần **it**. |
| What do you think about use a map? | What do you think about **using** a map? | Sau giới từ **about** dùng **V-ing**. |
| You should to add a test. | You **should add** a test. | Sau **should** dùng động từ nguyên mẫu, không có **to**. |
:::

## Hội thoại mẫu

Anna review pull request của Minh trên GitHub, sau đó hai người trao đổi trong phần bình luận.

> **Anna:** **Nice work!** **Could we** move the date formatting into a helper? It's used in three places. \
> **Minh:** **Good catch.** **I'll fix it.** \
> **Anna:** Also, **is there a reason** we're loading all the items at once? \
> **Minh:** **I did it this way because** the list is short, usually under 20 items. \
> **Anna:** **I see your point.** **What do you think about** adding a comment to explain that? \
> **Minh:** **Makes sense.** Done. **Could you take another look?** \
> **Anna:** **Looks good to me.** **Approved.**

::: details Xem bản dịch
**Anna:** Làm tốt lắm! Mình tách phần định dạng ngày ra một hàm helper được không? Nó được dùng ở ba chỗ.<br>
**Minh:** Bắt lỗi hay đấy. Mình sẽ sửa.<br>
**Anna:** Còn nữa, có lý do gì mà mình tải toàn bộ item một lần không?<br>
**Minh:** Mình làm vậy vì danh sách ngắn, thường dưới 20 item.<br>
**Anna:** Mình hiểu ý bạn. Bạn thấy thêm một dòng chú thích để giải thích điều đó thì sao?<br>
**Minh:** Hợp lý. Xong rồi. Bạn xem lại giúp mình nhé?<br>
**Anna:** Mình thấy ổn. Đã duyệt.
:::

## Luyện tập

Điền phần còn thiếu của các mẫu câu trong bài, gợi ý là nghĩa tiếng Việt. Làm xong hãy đọc to cả câu.

<PhraseDrill lesson="code-review" />

## Ghi nhớ

::: warning TÓM TẮT
- Góp ý bằng câu hỏi và **we**: **Could we …?** · **What do you think about + V-ing?**
- Góp ý nhỏ thì ghi **Nit:** hoặc **Not a blocker, but …**
- Nhận góp ý: **Good catch, I'll fix it.** · **Done. Could you take another look?**
- Giữ ý mình một cách lịch sự: **I did it this way because …** · **I see your point, but …**
:::

Xem thêm: [Động từ khiếm khuyết cơ bản](/vi/parts-of-speech/modal-verbs) · [V-ing và to V](/vi/parts-of-speech/gerunds-infinitives) · [Tin nhắn chat & email công việc](./chat-email)
