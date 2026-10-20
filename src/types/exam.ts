export type ModuleId = 'A' | 'B' | 'C' | 'D';
export type QuestionType = 'mcq' | 'fill' | 'code' | 'essay';
export type QuizMode = 'practice' | 'exam';

/** Khóa học mà đề thuộc về. Đề không gắn `course` được xếp vào nhóm "Đề khác". */
export type CourseId = 'aicb';

/** Vị trí của đề trong lộ trình khóa học. */
export type ExamKind = 'daily' | 'review';

export interface Option {
  key: string;
  text: string;
}

export interface BaseQuestion {
  id: string;
  module: ModuleId;
  type: QuestionType;
  points: number;
  prompt: string;
  tags?: string[];
}

export interface McqQuestion extends BaseQuestion {
  type: 'mcq';
  options: Option[];
  answer: string;
  explanation: string;
}

/**
 * Câu điền khuyết chấm tự động.
 *
 * `prompt` chứa một hoặc nhiều chỗ trống viết bằng `___` (ba gạch dưới trở lên).
 * Bài làm được so khớp với `acceptedAnswers` sau khi chuẩn hoá (xem
 * `normalizeFillAnswer`): bỏ dấu tiếng Việt, hạ chữ thường, gộp khoảng trắng và
 * bỏ dấu câu ở hai đầu. Phần tử đầu tiên là đáp án hiển thị khi chấm.
 */
export interface FillQuestion extends BaseQuestion {
  type: 'fill';
  acceptedAnswers: string[];
  explanation: string;
  /** Gợi ý ngắn hiển thị dưới ô nhập, ví dụ "một con số" hoặc "tên tiếng Anh". */
  hint?: string;
}

export interface OpenQuestion extends BaseQuestion {
  type: 'code' | 'essay';
  modelAnswer: string;
  rubric: string[];
}

export type Question = McqQuestion | FillQuestion | OpenQuestion;

export interface Exam {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  totalPoints: number;
  disclaimer: string;
  questions: Question[];
  /** Điểm sàn để đạt (%). Có ở phần lớn đề mới. */
  passingScore?: number;
  /** Khóa học chứa đề này. Bỏ trống = đề lẻ, xếp vào nhóm "Đề khác". */
  course?: CourseId;
  /** Đề theo ngày hay đề tổng ôn. */
  kind?: ExamKind;
  /** Số thứ tự buổi học, dùng để sắp xếp trong nhóm khóa học. */
  day?: number;
  /** Nhãn ngắn hiển thị trên thẻ đề, ví dụ "Ngày 18" hoặc "Tổng ôn". */
  label?: string;
}

export interface AnswerState {
  selected?: string;
  text?: string;
  selfGrade?: 'pass' | 'fail';
  /** Câu điền khuyết: người làm đã bấm "Kiểm tra" để xem kết quả chưa. */
  checked?: boolean;
}

export const MODULE_LABELS: Record<ModuleId, string> = {
  A: 'Toán học & tư duy định lượng',
  B: 'Python / NumPy / Pandas',
  C: 'AI & tư duy sản phẩm AI',
  D: 'Logic / đạo đức / hành vi'
};

export const COURSE_LABELS: Record<CourseId, string> = {
  aicb: 'Khóa AICB'
};

/** Tài liệu ôn tập dạng trang HTML tĩnh, đặt trong `public/study/`. */
export interface StudyGuide {
  id: string;
  /** Tên file trong `public/study/`, ví dụ "day18-production-rag.html". */
  file: string;
  title: string;
  summary: string;
  course: CourseId;
  day: number;
  label: string;
  /** Các mục chính có trong tài liệu, hiển thị dạng chip trên thẻ. */
  topics: string[];
  /** Id của đề trắc nghiệm cùng buổi học, nếu có. */
  examId?: string;
}
