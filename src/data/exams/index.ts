import type { Exam } from '../../types/exam';
import { compareExams } from '../../utils/examGroups';

const modules = import.meta.glob('./*.json', { eager: true, import: 'default' }) as Record<string, Exam>;

// Sắp xếp theo số thứ tự tự nhiên (exam-9 trước exam-10) và theo lộ trình khóa học,
// thay cho localeCompare vốn xếp exam-100 ngay sau exam-10.
export const exams: Exam[] = Object.values(modules).sort(compareExams);
