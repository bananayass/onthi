import { useEffect, useMemo, useState } from 'react';
import type { AnswerState, Exam, QuizMode } from '../types/exam';
import { saveProgress, loadProgress, clearProgress } from '../utils/storage';
import { QuestionCard } from './QuestionCard';
import { ResultSummary } from './ResultSummary';
import { Disclaimer } from './Disclaimer';
import { AppHeader } from './AppHeader';
import { shuffleExam } from '../utils/shuffleExam';

interface Props {
  exam: Exam;
  mode: QuizMode;
  timerEnabled: boolean;
  onHome: () => void;
}

export function QuizRunner({ exam, mode, timerEnabled, onHome }: Props) {
  const [randomizedExam] = useState(() => shuffleExam(exam));
  const [answers, setAnswers] = useState<Record<string, AnswerState>>(() => loadProgress(exam.id));
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(exam.durationMinutes * 60);
  const [navOpen, setNavOpen] = useState(false);

  const answeredCount = useMemo(() => randomizedExam.questions.filter((q) => {
    const a = answers[q.id];
    if (q.type === 'mcq') return Boolean(a?.selected);
    if (q.type === 'fill') return Boolean(a?.text?.trim());
    return Boolean(a?.text || a?.selfGrade);
  }).length, [answers, randomizedExam.questions]);

  useEffect(() => {
    saveProgress(exam.id, answers);
  }, [answers, exam.id]);

  useEffect(() => {
    if (!timerEnabled || submitted) return;
    const timer = window.setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [timerEnabled, submitted]);

  useEffect(() => {
    if (timerEnabled && secondsLeft === 0) setSubmitted(true);
  }, [timerEnabled, secondsLeft]);

  const currentQuestion = randomizedExam.questions[current];
  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const seconds = (secondsLeft % 60).toString().padStart(2, '0');

  const updateAnswer = (answer: AnswerState) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
  };

  if (submitted) {
    return <ResultSummary exam={randomizedExam} answers={answers} onReview={(idx) => { setSubmitted(false); setCurrent(idx); }} onRestart={() => { clearProgress(exam.id); setAnswers({}); setCurrent(0); setSecondsLeft(exam.durationMinutes * 60); setSubmitted(false); }} onHome={onHome} />;
  }

  return (
    <div className="app-frame quiz-frame">
      <AppHeader title={exam.title} onMenu={() => setNavOpen(true)} />
      {navOpen && <button className="drawer-backdrop" aria-label="Đóng điều hướng" onClick={() => setNavOpen(false)} />}
      <main className="quiz-layout">
      <aside className={`quiz-sidebar card ${navOpen ? 'open' : ''}`}>
        <div className="sidebar-mobile-head"><strong>Điều hướng câu hỏi</strong><button className="icon-button" onClick={() => setNavOpen(false)} aria-label="Đóng">×</button></div>
        <button className="link" onClick={onHome}>← Đổi đề</button>
        <h1>{exam.title}</h1>
        <p>{mode === 'practice' ? 'Practice mode' : 'Exam mode'} · {answeredCount}/{randomizedExam.questions.length} câu đã làm</p>
        {timerEnabled && <div className="timer">{minutes}:{seconds}</div>}
        <div className="question-nav">
          {randomizedExam.questions.map((question, idx) => <button key={question.id} aria-label={`Câu ${idx + 1}${answers[question.id] ? ', đã trả lời' : ''}`} className={`${idx === current ? 'active' : ''} ${answers[question.id] ? 'answered' : ''}`} onClick={() => { setCurrent(idx); setNavOpen(false); }}>{idx + 1}</button>)}
        </div>
        <Disclaimer />
      </aside>

      <section className="quiz-main">
        <QuestionCard question={currentQuestion} index={current} total={randomizedExam.questions.length} answer={answers[currentQuestion.id]} mode={mode} submitted={submitted} onAnswer={updateAnswer} />
        <div className="actions">
          <button className="secondary" disabled={current === 0} onClick={() => setCurrent((x) => Math.max(0, x - 1))}>Câu trước</button>
          <button className="secondary" disabled={current === randomizedExam.questions.length - 1} onClick={() => setCurrent((x) => Math.min(randomizedExam.questions.length - 1, x + 1))}>Câu sau</button>
          <button className="primary" onClick={() => setSubmitted(true)}>Nộp bài</button>
        </div>
      </section>
      </main>
    </div>
  );
}
