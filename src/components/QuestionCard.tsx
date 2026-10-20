import type { AnswerState, Question } from '../types/exam';
import { displayFillAnswer, isFillAnswerCorrect } from '../utils/fillAnswer';
import { RichText } from './RichText';

const TYPE_LABELS: Record<Question['type'], string> = {
  mcq: 'Trắc nghiệm',
  fill: 'Điền khuyết',
  code: 'Code tay / pseudo-code',
  essay: 'Tự luận ngắn'
};

interface Props {
  question: Question;
  index: number;
  total: number;
  answer?: AnswerState;
  mode: 'practice' | 'exam';
  submitted: boolean;
  onAnswer: (answer: AnswerState) => void;
}

export function QuestionCard({ question, index, total, answer, mode, submitted, onAnswer }: Props) {
  const isMcq = question.type === 'mcq';
  const isFill = question.type === 'fill';
  const hasAnswer = isMcq ? Boolean(answer?.selected) : Boolean(answer?.text?.trim());
  // Câu điền khuyết chỉ lộ đáp án khi bấm "Kiểm tra" hoặc khi nộp bài — nếu lộ ngay
  // lúc gõ thì người làm chưa gõ xong đã thấy kết quả.
  const reveal = submitted || (mode === 'practice' && hasAnswer && (!isFill || Boolean(answer?.checked)));
  const fillCorrect = isFill && isFillAnswerCorrect(question, answer?.text);

  return (
    <article className="question-card card">
      <header className="question-header">
        <div>
          <span className="eyebrow">Câu {index + 1}/{total} · Module {question.module}</span>
          <h2>{TYPE_LABELS[question.type]}</h2>
        </div>
        <strong>{question.points} điểm</strong>
      </header>

      <RichText text={question.prompt} />

      {isMcq ? (
        <div className="options">
          {question.options.map((option) => {
            const selected = answer?.selected === option.key;
            const correct = reveal && option.key === question.answer;
            const wrong = reveal && selected && option.key !== question.answer;
            return (
              <button
                key={option.key}
                aria-pressed={selected}
                className={['option', selected ? 'selected' : '', correct ? 'correct' : '', wrong ? 'wrong' : ''].join(' ')}
                onClick={() => onAnswer({ ...answer, selected: option.key })}
              >
                <span>{option.key}</span>
                {option.text}
              </button>
            );
          })}
        </div>
      ) : isFill ? (
        <div className="fill-answer">
          <input
            type="text"
            aria-label="Điền vào chỗ trống"
            placeholder="Điền vào chỗ trống…"
            autoComplete="off"
            spellCheck={false}
            className={reveal ? (fillCorrect ? 'correct' : 'wrong') : ''}
            value={answer?.text ?? ''}
            onChange={(event) => onAnswer({ ...answer, text: event.target.value, checked: false })}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && hasAnswer) onAnswer({ ...answer, checked: true });
            }}
          />
          <button
            className="secondary check-button"
            disabled={!hasAnswer || submitted}
            onClick={() => onAnswer({ ...answer, checked: true })}
          >
            Kiểm tra
          </button>
          {question.hint && <p className="fill-hint">Gợi ý: {question.hint}</p>}
        </div>
      ) : (
        <div className="open-answer">
          <textarea
            aria-label="Câu trả lời của bạn"
            placeholder="Gõ câu trả lời/code/pseudo-code của bạn..."
            value={answer?.text ?? ''}
            onChange={(event) => onAnswer({ ...answer, text: event.target.value })}
          />
        </div>
      )}

      {reveal && isMcq && answer?.selected && (
        <section className="feedback">
          <strong>{answer.selected === question.answer ? 'Đúng' : `Sai. Đáp án đúng là ${question.answer}.`}</strong>
          <p>{question.explanation}</p>
        </section>
      )}

      {reveal && isFill && (
        <section className="feedback">
          <strong>{fillCorrect ? 'Đúng' : `Sai. Đáp án đúng: ${displayFillAnswer(question)}`}</strong>
          {!fillCorrect && question.acceptedAnswers.length > 1 && (
            <p className="accepted-list">Cũng được tính đúng: {question.acceptedAnswers.slice(1).join(' · ')}</p>
          )}
          <p>{question.explanation}</p>
        </section>
      )}

      {reveal && !isMcq && !isFill && (
        <section className="feedback">
          <strong>Đáp án mẫu</strong>
          {/* Đáp án mẫu có rào ``` thì để RichText tách phần code ra <pre> và phần bình
              luận ra văn xuôi. Chỉ khi đáp án là code trần (không rào) mới bọc <pre>
              thẳng, nếu không sẽ mất thụt lề. */}
          {question.type === 'code' && !question.modelAnswer.includes('```')
            ? <pre><code>{question.modelAnswer}</code></pre>
            : <RichText text={question.modelAnswer} />}
          <strong className="rubric-title">Rubric tự chấm — đạt bao nhiêu ý?</strong>
          <ul className="rubric-list">{question.rubric.map((item) => <li key={item}>{item}</li>)}</ul>
          <div className="self-grade">
            <span>Tự chấm:</span>
            <button className={answer?.selfGrade === 'pass' ? 'active' : ''} onClick={() => onAnswer({ ...answer, selfGrade: 'pass' })}>Đạt</button>
            <button className={answer?.selfGrade === 'fail' ? 'active' : ''} onClick={() => onAnswer({ ...answer, selfGrade: 'fail' })}>Chưa đạt</button>
          </div>
        </section>
      )}
    </article>
  );
}
