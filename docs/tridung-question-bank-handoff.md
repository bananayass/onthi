# Handoff: soạn ngân hàng câu hỏi "Trí Dũng đẹp trai" Ngày 11–14

## Bối cảnh

Đề cũ sinh từ 8 fact/ngày × 8 mẫu câu → một ý bị hỏi 8 lần. Đã thay bằng ngân hàng câu hỏi soạn tay theo PDF + HTML từng ngày.

- Xong: Ngày 2–10 (`scripts/tridung-banks/day2.json` … `day10.json`).
- Còn lại: **Ngày 11, 12, 13, 14**. Chưa có bank thì script giữ nguyên đề cũ của ngày đó.

## Nguồn cho mỗi ngày

| Ngày | HTML (tóm tắt) | PDF (slide gốc) |
|---|---|---|
| 11 | `onthi/Day11_Guardrails_HITL_Responsible_AI_Beginner_Notes.html` | `onthi/day11.pdf` |
| 12 | `onthi/Day12_Deployment_Agent_Cloud_Beginner_Notes.html` | `onthi/day12.pdf` |
| 13 | `onthi/Day13_Monitoring_Logging_Observability_Beginner_Notes.html` | `onthi/day13.pdf` |
| 14 | `onthi/Day14_AI_Evaluation_Benchmarking_Beginner_Notes.html` | `onthi/day14.pdf` (PDF scan, gần như không có text layer → dựa vào HTML, OCR nếu cần) |

Trích text (cần `pypdf`):

```bash
python3 - <<'EOF'
import re, html, pathlib
from pypdf import PdfReader
d = 11
src = pathlib.Path('onthi')
h = next(src.glob(f'Day{d}_*.html')).read_text('utf8')
h = re.sub(r'(?is)<(script|style)[^>]*>.*?</\1>', '', h)
h = re.sub(r'(?i)<(br|/p|/li|/h\d|/tr|/div)[^>]*>', '\n', h)
print(html.unescape(re.sub(r'<[^>]+>', ' ', h)))
for i, p in enumerate(PdfReader(src / f'day{d}.pdf').pages):
    print(f'--- p{i+1}\n', p.extract_text() or '')
EOF
```

## Định dạng file bank

`scripts/tridung-banks/dayN.json`:

```json
{
  "mcq": [
    ["Câu hỏi?", "Đáp án ĐÚNG", "Nhiễu 1", "Nhiễu 2", "Nhiễu 3", "Giải thích ngắn, nêu nguồn ý từ slide"]
  ],
  "essay": [
    ["Đề tự luận (tình huống cụ thể)", "Đáp án mẫu / ý cần có"]
  ]
}
```

- Đúng **60 mcq + 10 essay**. Đáp án đúng luôn ở vị trí thứ 2; script tự xáo A/B/C/D ổn định theo id.
- Rubric tự luận dùng chung, có sẵn trong script.

## Quy tắc soạn (bắt buộc)

1. **70 câu, 70 ý khác nhau.** Không hỏi lại cùng một khái niệm bằng cách đổi chữ. Trải đều mọi section của slide.
2. Bám nội dung PDF/HTML của đúng ngày đó; số liệu, tên, công thức lấy từ slide. Không bịa số.
3. Trộn dạng câu: định nghĩa, tình huống, tính toán nhỏ, phân biệt hai khái niệm, chọn cách sửa lỗi.
4. **Nhiễu phải hợp lý và dài tương đương đáp án đúng.** Lỗi hay mắc nhất: đáp án đúng dài và chi tiết hơn hẳn → nhìn độ dài là đoán được. Viết đáp án đúng gọn, nhiễu đủ dài.
5. Nhiễu không được là một đáp án cũng đúng.
6. Tự luận: tình huống thực tế có yêu cầu rõ (thiết kế / phân tích / tính toán), đáp án mẫu liệt kê ý chấm.
7. Tiếng Việt có dấu; thuật ngữ kỹ thuật giữ tiếng Anh như slide.

## Kiểm tra

```bash
node scripts/generate-tridung-exams.mjs   # tự báo lỗi nếu sai số câu, trùng câu hỏi, trùng đáp án đúng, trùng phương án
```

Kiểm đáp án đúng có lộ do quá dài (mục tiêu ≤ 5 câu/ngày):

```bash
python3 -c "
import json,sys
d=json.load(open('scripts/tridung-banks/day11.json'))
for i,r in enumerate(d['mcq']):
  m=max(len(x) for x in r[2:5])
  if len(r[1])>1.15*m and len(r[1])-m>=8: print(i,len(r[1]),m,r[1])
"
```

Xong thì soát thêm bằng mắt: các câu không trùng ý, không trùng ý quá nhiều với ngày khác.

## Đầu ra sau khi chạy script

- `src/data/exams/tridung-dep-trai/dayN_tridung.json` — đề web đọc (60 mcq × 1 điểm + 10 essay × 4 điểm = 100).
- `onthi/bo-de-tridung/dayN_tridung/trac-nghiem.json`, `tu-luan.json`.

Không sửa tay các file đầu ra; chỉ sửa bank rồi chạy lại script.

## Lưu ý khác

- `src/data/exams/day6_TriDung.json` (course `aicb`, 12 câu) có cùng `id: "day6-tridung"` với đề sinh ra cho Ngày 6. Chưa xử lý; kiểm tra xem app có bị trùng id không.
- `npm run validate` chỉ kiểm file ở thư mục gốc `src/data/exams/`, không kiểm thư mục `tridung-dep-trai/`.
- Commit theo conventional commit, ví dụ `feat(exams): rewrite tridung day 11 question bank`.
