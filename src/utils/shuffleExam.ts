import type { Exam, McqQuestion, Question } from '../types/exam';

const DISPLAY_KEYS = ['A', 'B', 'C', 'D'];

function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function shuffleMcq(question: McqQuestion, random: () => number): McqQuestion {
  const correctText = question.options.find((option) => option.key === question.answer)?.text;
  const options = shuffle(question.options, random).map((option, index) => ({
    ...option,
    key: DISPLAY_KEYS[index] ?? option.key,
  }));
  return {
    ...question,
    options,
    answer: options.find((option) => option.text === correctText)?.key ?? question.answer,
  };
}

export function shuffleExam(exam: Exam, random: () => number = Math.random): Exam {
  return { ...exam, questions: exam.questions.map((question: Question) => (
    question.type === 'mcq' ? shuffleMcq(question, random) : question
  )) };
}
