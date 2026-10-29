# Giving and receiving code review feedback

Code review is feedback on the code, not on the person. Workplace English keeps it soft: ask questions, make suggestions and say **we** instead of **you**. When you receive feedback, say thanks, make the change, or explain why you did it your way.

## Before you start

### Vocabulary

Learn these 15 words and phrases before you read the key phrases: tap the speaker to hear each one, then use **Flashcards** to test yourself.

<VocabTopic slug="cong-so-code-review" />

### Grammar

Soft feedback relies on these three grammar points.

| Grammar point | Used for | Example |
|---|---|---|
| [Basic modal verbs](/parts-of-speech/modal-verbs) | making polite suggestions and requests as questions | **Could we** move this logic into a separate function? |
| [V-ing and to V](/parts-of-speech/gerunds-infinitives) | using V-ing after a preposition (**about**, **instead of**) | What do you think about **using** a map here? |
| [Future simple and be going to](/tenses/future-simple) | promising to fix something when you get feedback | Good catch! I'**ll fix** it. |

## Key phrases

### 1. Making suggestions gently

- **Could we** move this logic into a separate function?<br>*Mình tách đoạn logic này ra một hàm riêng được không?*
- **What do you think about** using a map here **instead of** a loop?<br>*Bạn thấy dùng map ở đây thay cho vòng lặp thì sao?*
- **It might be better to** check for null first.<br>*Có lẽ nên kiểm tra null trước thì hơn.*
- **Have you considered** caching this result?<br>*Bạn đã tính đến việc cache kết quả này chưa?*

### 2. Small, optional comments

- **Nit:** this variable name could be clearer.<br>*Góp ý nhỏ: tên biến này có thể rõ nghĩa hơn.*
- **Minor:** there's an extra blank line here.<br>*Chuyện nhỏ: ở đây thừa một dòng trống.*
- **Not a blocker, but** we could reuse the existing helper.<br>*Không bắt buộc, nhưng mình có thể dùng lại hàm helper có sẵn.*
- **Feel free to ignore this**, it's just personal preference.<br>*Bỏ qua cũng được, chỉ là sở thích cá nhân thôi.*

### 3. Asking to understand

- **Can you explain why** you added this delay?<br>*Bạn giải thích giúp vì sao thêm đoạn delay này được không?*
- **I'm not sure I understand** this part. **What happens if** the list is empty?<br>*Mình chưa hiểu lắm phần này. Nếu danh sách rỗng thì sao?*
- **Is there a reason** we're not using the shared component?<br>*Có lý do gì mà mình không dùng component dùng chung không?*

### 4. Receiving feedback

- **Good catch!** I'll fix it.<br>*Bắt lỗi hay đấy! Mình sẽ sửa.*
- **Thanks, that makes sense.** **Updated.**<br>*Cảm ơn, hợp lý đấy. Đã sửa.*
- **Done.** **Could you take another look?**<br>*Xong rồi. Bạn xem lại giúp mình nhé?*
- **I'll handle that in a separate PR**, if that's OK.<br>*Phần đó mình sẽ làm ở một PR riêng, nếu được nhé.*

### 5. Explaining your choice

- **I did it this way because** the API returns the data in pages.<br>*Mình làm vậy vì API trả dữ liệu theo từng trang.*
- **I considered that, but** it would make the tests harder to write.<br>*Mình đã tính đến cách đó, nhưng như vậy test sẽ khó viết hơn.*
- **I see your point.** **How about** we keep it for now and refactor later?<br>*Mình hiểu ý bạn. Hay là tạm giữ như vậy rồi refactor sau?*

### 6. Approving a PR

- **Looks good to me.** **Approved.**<br>*Mình thấy ổn. Đã duyệt.*
- **Nice work!** **Just one small comment**, otherwise good to go.<br>*Làm tốt lắm! Chỉ có một góp ý nhỏ, còn lại merge được rồi.*
- **Approved with minor comments.**<br>*Đã duyệt, kèm vài góp ý nhỏ.*

## Sounding natural

| Sounds a bit harsh | More natural | Why |
|---|---|---|
| This is wrong. | **I think** this might cause a bug when the list is empty. | Name the exact problem, and **I think** softens it. |
| You must use a map. | **What do you think about** using a map here? | A question that invites an opinion instead of an order. |
| Why did you do this? | **Can you explain** the reason for this change? | **Why did you** can sound like blame. |
| You forgot the tests. | **Could we** add a test for this case? | **we**: the whole team owns the code. |
| Bad name. | **Nit:** maybe **userList** would be clearer? | Mark it as small and offer an option. |

## Common mistakes

::: danger COMMON MISTAKES
| ✗ Wrong | ✓ Right | Why |
|---|---|---|
| Please leave some comment on my PR. | Please leave **some comments** on my PR. | **comment** is countable, so **some** takes the plural. |
| I fixed already. | I've **already fixed** it. | Something just finished uses the present perfect, and **fix** needs the object **it**. |
| Thank you for your comment, I will fix. | Thanks for the comment. **I'll fix it.** | **fix** needs an object: **it**. |
| What do you think about use a map? | What do you think about **using** a map? | After the preposition **about**, use **V-ing**. |
| You should to add a test. | You **should add** a test. | After **should**, use the base verb without **to**. |
:::

## Sample dialogue

Anna reviews Minh's pull request on GitHub, and they talk in the comments.

> **Anna:** **Nice work!** **Could we** move the date formatting into a helper? It's used in three places. \
> **Minh:** **Good catch.** **I'll fix it.** \
> **Anna:** Also, **is there a reason** we're loading all the items at once? \
> **Minh:** **I did it this way because** the list is short, usually under 20 items. \
> **Anna:** **I see your point.** **What do you think about** adding a comment to explain that? \
> **Minh:** **Makes sense.** Done. **Could you take another look?** \
> **Anna:** **Looks good to me.** **Approved.**

::: details Vietnamese translation
**Anna:** Làm tốt lắm! Mình tách phần định dạng ngày ra một hàm helper được không? Nó được dùng ở ba chỗ.<br>
**Minh:** Bắt lỗi hay đấy. Mình sẽ sửa.<br>
**Anna:** Còn nữa, có lý do gì mà mình tải toàn bộ item một lần không?<br>
**Minh:** Mình làm vậy vì danh sách ngắn, thường dưới 20 item.<br>
**Anna:** Mình hiểu ý bạn. Bạn thấy thêm một dòng chú thích để giải thích điều đó thì sao?<br>
**Minh:** Hợp lý. Xong rồi. Bạn xem lại giúp mình nhé?<br>
**Anna:** Mình thấy ổn. Đã duyệt.
:::

## Practice

Fill in the missing part of each key phrase from this lesson; the hint is the Vietnamese meaning. When you finish, read the whole sentence out loud.

<PhraseDrill lesson="code-review" />

## Remember

::: warning SUMMARY
- Suggest with questions and **we**: **Could we …?** · **What do you think about + V-ing?**
- Mark small comments with **Nit:** or **Not a blocker, but …**
- Receiving feedback: **Good catch, I'll fix it.** · **Done. Could you take another look?**
- Keep your view politely: **I did it this way because …** · **I see your point, but …**
:::

See also: [Basic modal verbs](/parts-of-speech/modal-verbs) · [V-ing and to V](/parts-of-speech/gerunds-infinitives) · [Work chat and email](./chat-email)
