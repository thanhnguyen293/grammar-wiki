# Hỏi lại & làm rõ yêu cầu

Nhận một ticket mô tả mơ hồ, hay nghe product owner giải thích tính năng mới mà chưa chắc đã hiểu đúng, cách an toàn nhất là hỏi lại ngay. Hỏi sớm một câu tốt hơn sửa lại cả tuần code.

## Cần biết trước

### Từ vựng

Học 15 từ và cụm từ này trước khi đọc mẫu câu: bấm loa để nghe, dùng **Thẻ ghi nhớ** để tự kiểm tra.

<VocabTopic slug="cong-so-clarifying" />

### Ngữ pháp

Các mẫu câu trong bài dựa trên những điểm ngữ pháp sau. Chưa chắc điểm nào thì mở bài đó ôn lại trước.

| Điểm ngữ pháp | Dùng để | Ví dụ |
|---|---|---|
| [Mệnh đề danh từ](/vi/clauses-and-phrases/noun-clauses) | đặt câu hỏi lồng trong câu khác | Could you clarify **what "fast" means** here? |
| [Các loại câu điều kiện](/vi/conditionals/types) | hỏi về trường hợp đặc biệt | What should happen **if the user has** no internet? |
| [Động từ khiếm khuyết cơ bản](/vi/parts-of-speech/modal-verbs) | nhờ người khác lịch sự | **Could** you give me an example? |

## Mẫu câu

### 1. Nhờ giải thích rõ hơn

- **Could you clarify what** "fast" **means here?**<br>*Bạn làm rõ giúp "nhanh" ở đây nghĩa là sao được không?*
- **I'm not sure I understand** the second requirement.<br>*Mình chưa chắc đã hiểu yêu cầu thứ hai.*
- **Could you explain** how the discount **works**?<br>*Bạn giải thích giúp mã giảm giá hoạt động thế nào được không?*
- **What exactly do you mean by** "sync"?<br>*Chính xác thì "sync" ở đây bạn muốn nói gì?*

### 2. Xác nhận mình hiểu đúng

- **So, if I understand correctly,** users can only edit their own posts.<br>*Vậy nếu mình hiểu đúng thì người dùng chỉ sửa được bài của mình.*
- **Just to confirm,** the deadline is next Friday, right?<br>*Cho mình xác nhận lại, deadline là thứ Sáu tuần sau đúng không?*
- **Let me make sure I've got this right.** We need two buttons, not one.<br>*Để mình chắc là mình hiểu đúng nhé. Mình cần hai nút chứ không phải một.*
- **Does that mean** we don't support tablets?<br>*Vậy có nghĩa là mình không hỗ trợ máy tính bảng à?*

### 3. Hỏi các trường hợp đặc biệt

- **What should happen if** the user has no internet?<br>*Nếu người dùng mất mạng thì app nên xử lý thế nào?*
- **What if** the list is empty?<br>*Nếu danh sách trống thì sao?*
- **Is there a limit on** the file size?<br>*Có giới hạn dung lượng file không?*
- **How should we handle** expired sessions?<br>*Mình xử lý phiên đăng nhập hết hạn thế nào?*

### 4. Hỏi tiêu chí hoàn thành

- **What are the acceptance criteria** for this ticket?<br>*Tiêu chí nghiệm thu của ticket này là gì?*
- **How will we know** it's done?<br>*Làm sao biết là việc này đã xong?*
- **Is this in scope** for this sprint?<br>*Việc này có nằm trong phạm vi sprint này không?*

### 5. Xin ví dụ, tài liệu

- **Could you give me an example?**<br>*Bạn cho mình một ví dụ được không?*
- **Do you have a mockup** for this screen?<br>*Bạn có bản mockup cho màn hình này không?*
- **Is there any documentation** for this API?<br>*API này có tài liệu nào không?*
- **Who should I ask about** the payment rules?<br>*Mình nên hỏi ai về quy tắc thanh toán?*

## Lỗi hay gặp

::: danger LỖI HAY GẶP
| ✗ Sai | ✓ Đúng | Vì sao |
|---|---|---|
| Can you explain me this? | Can you **explain this to me**? | **explain** không có tân ngữ người ngay sau; dùng **explain sth to sb**. |
| Could you tell me what does it mean? | Could you tell me what **it means**? | Câu hỏi nằm trong câu khác thì giữ trật tự câu kể, bỏ **does**. |
| What happen if the user logs out? | What **happens** if the user logs out? | **what** làm chủ ngữ số ít nên động từ thêm **-s**. |
| I don't understand clearly your idea. | I don't **fully understand** your idea. | Trạng từ đứng trước động từ chính, không đứng giữa động từ và tân ngữ. |
| Can I ask you some question? | Can I ask you **a question**? / … **some questions**? | **question** đếm được: số ít cần **a**, sau **some** dùng số nhiều. |
:::

## Hội thoại mẫu

Lan (product owner) giao cho Minh ticket thêm tính năng tải ảnh đại diện.

> **Lan:** This ticket is about uploading a profile photo. \
> **Minh:** Okay. **Is there a limit on** the photo size? \
> **Lan:** Yes, 5 MB. \
> **Minh:** **What should happen if** the photo is bigger? \
> **Lan:** Show an error message. The text is in the mockup. \
> **Minh:** Got it. **Just to confirm,** users can choose a photo from the camera or the gallery, **right?** \
> **Lan:** Only the gallery for now. The camera is **out of scope**. \
> **Minh:** **So, if I understand correctly,** gallery only, 5 MB max, and an error for bigger files. I'll add that to the **acceptance criteria**.

::: details Xem bản dịch
**Lan:** Ticket này là để tải ảnh đại diện lên.<br>
**Minh:** Vâng. Có giới hạn dung lượng ảnh không chị?<br>
**Lan:** Có, 5 MB.<br>
**Minh:** Nếu ảnh lớn hơn thì app nên xử lý thế nào ạ?<br>
**Lan:** Hiện thông báo lỗi. Nội dung có trong mockup.<br>
**Minh:** Em hiểu rồi. Cho em xác nhận lại, người dùng chọn ảnh từ camera hoặc thư viện ảnh, đúng không ạ?<br>
**Lan:** Hiện tại chỉ thư viện ảnh thôi. Camera nằm ngoài phạm vi.<br>
**Minh:** Vậy nếu em hiểu đúng thì: chỉ thư viện ảnh, tối đa 5 MB, file lớn hơn thì báo lỗi. Em sẽ thêm vào tiêu chí nghiệm thu.
:::

## Luyện tập

Điền phần còn thiếu của các mẫu câu trong bài, gợi ý là nghĩa tiếng Việt. Làm xong hãy đọc to cả câu.

<PhraseDrill lesson="clarifying" />

## Ghi nhớ

::: warning TÓM TẮT
- Chưa rõ thì hỏi ngay: **Could you clarify…?**, **What exactly do you mean by…?**
- Nhắc lại bằng lời của mình để xác nhận: **So, if I understand correctly, …**
- Hỏi trường hợp đặc biệt: **What should happen if…?**
- Câu hỏi lồng trong câu khác giữ trật tự câu kể: **Could you tell me what it means?**
:::

Xem thêm: [Mệnh đề danh từ](/vi/clauses-and-phrases/noun-clauses) · [Các loại câu điều kiện](/vi/conditionals/types) · [Nhận việc, ước lượng & deadline](./tasks-deadlines)
