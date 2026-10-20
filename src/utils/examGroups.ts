import type { Exam } from '../types/exam';

export type GroupId = 'all' | 'aicb' | 'tridung' | 'other';

export interface GroupTab {
  id: GroupId;
  label: string;
  count: number;
}

/** Đề thuộc khóa AICB (đã gắn `course: "aicb"` trong file JSON). */
export function isAicb(exam: Exam): boolean {
  return exam.course === 'aicb';
}

/** Bộ đề do Trí Dũng biên soạn. */
export function isTridung(exam: Exam): boolean {
  return exam.course === 'tridung';
}

/**
 * Số thứ tự trong id dạng `exam-106`, dùng để sắp xếp theo số tự nhiên.
 * `localeCompare` trên chuỗi sẽ xếp exam-100 ngay sau exam-10, không đúng ý.
 */
function examNumber(exam: Exam): number {
  const match = /(\d+)/.exec(exam.id);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

/**
 * Sắp xếp đề trong nhóm khóa học: đề theo ngày trước (tăng dần theo `day`),
 * rồi tới đề tổng ôn. Đề không thuộc khóa nào xếp theo số thứ tự.
 */
export function compareExams(a: Exam, b: Exam): number {
  const aCourse = Boolean(a.course);
  const bCourse = Boolean(b.course);

  if (aCourse && bCourse) {
    const aReview = a.kind === 'review' ? 1 : 0;
    const bReview = b.kind === 'review' ? 1 : 0;
    if (aReview !== bReview) return aReview - bReview;
    const aDay = a.day ?? Number.MAX_SAFE_INTEGER;
    const bDay = b.day ?? Number.MAX_SAFE_INTEGER;
    if (aDay !== bDay) return aDay - bDay;
  }

  return examNumber(a) - examNumber(b);
}

export function filterByGroup(exams: Exam[], group: GroupId): Exam[] {
  if (group === 'aicb') return exams.filter(isAicb);
  if (group === 'tridung') return exams.filter(isTridung);
  if (group === 'other') return exams.filter((exam) => !isAicb(exam) && !isTridung(exam));
  return exams;
}

export function buildGroupTabs(exams: Exam[]): GroupTab[] {
  const aicb = exams.filter(isAicb).length;
  const tridung = exams.filter(isTridung).length;
  return [
    { id: 'all', label: 'Tất cả', count: exams.length },
    { id: 'aicb', label: 'Khóa AICB', count: aicb },
    { id: 'tridung', label: 'Trí Dũng đẹp trai', count: tridung },
    { id: 'other', label: 'Đề khác', count: exams.length - aicb - tridung }
  ];
}

/** Nhãn hiển thị trên thẻ đề: ưu tiên `label` trong JSON, nếu không thì lấy mã đề. */
export function examBadge(exam: Exam): string {
  if (exam.label) return exam.label;
  const match = /(\d+)/.exec(exam.id);
  return match ? `Đề ${match[1]}` : exam.id;
}
