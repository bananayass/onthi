import type { FillQuestion } from '../types/exam';

/**
 * Chuẩn hoá một câu trả lời điền khuyết để so khớp "rộng tay" nhưng vẫn chặt về nội dung:
 *
 * - hạ chữ thường và tách dấu tiếng Việt (NFD) rồi bỏ dấu, nên "Đúng" ≡ "dung";
 * - đưa mọi biến thể gạch ngang/nháy về dạng ASCII, nên "–" ≡ "-" và "’" ≡ "'";
 * - gộp mọi khoảng trắng liên tiếp thành một dấu cách;
 * - bỏ dấu câu thừa ở hai đầu chuỗi (dấu chấm, phẩy, ngoặc, nháy…).
 *
 * Không bỏ dấu câu ở giữa vì những thứ như `tools/list`, `hit@k` hay `0.7`
 * mang ý nghĩa và cần giữ nguyên.
 */
export function normalizeFillAnswer(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[\u2010-\u2015]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\s+/g, ' ')
    .replace(/^[\s.,;:!?"'()[\]{}]+|[\s.,;:!?"'()[\]{}]+$/g, '')
    .trim();
}

/** Bài làm có khớp một trong các đáp án được chấp nhận không? */
export function isFillAnswerCorrect(question: FillQuestion, text?: string): boolean {
  if (!text?.trim()) return false;
  const submitted = normalizeFillAnswer(text);
  if (!submitted) return false;
  return question.acceptedAnswers.some((accepted) => normalizeFillAnswer(accepted) === submitted);
}

/** Đáp án hiển thị khi chấm — quy ước là phần tử đầu của `acceptedAnswers`. */
export function displayFillAnswer(question: FillQuestion): string {
  return question.acceptedAnswers[0] ?? '';
}
