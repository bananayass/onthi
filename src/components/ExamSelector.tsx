import type { Exam, ModuleId, QuizMode } from '../types/exam';
import { MODULE_LABELS } from '../types/exam';
import { Disclaimer } from './Disclaimer';
import { AppHeader } from './AppHeader';
import { StudyGuideList } from './StudyGuideList';
import { findGuideByExamId, studyGuideUrl } from '../data/studyGuides';
import { buildGroupTabs, compareExams, examBadge, filterByGroup } from '../utils/examGroups';
import type { GroupId } from '../utils/examGroups';
import { useEffect, useMemo, useRef, useState } from 'react';

const COMMUNITY_URL = 'https://www.facebook.com/groups/1450219003271674';

interface Props {
  exams: Exam[];
  selectedExamId: string;
  mode: QuizMode;
  timerEnabled: boolean;
  onExamChange: (id: string) => void;
  onModeChange: (mode: QuizMode) => void;
  onTimerChange: (enabled: boolean) => void;
  onStart: () => void;
}

export function ExamSelector({ exams, selectedExamId, mode, timerEnabled, onExamChange, onModeChange, onTimerChange, onStart }: Props) {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<GroupId>('all');
  const listRef = useRef<HTMLDivElement>(null);

  const groupTabs = useMemo(() => buildGroupTabs(exams), [exams]);

  const visibleExams = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase('vi');
    const scoped = filterByGroup(exams, group);
    const matched = keyword
      ? scoped.filter((exam) => `${exam.title} ${exam.description}`.toLocaleLowerCase('vi').includes(keyword))
      : scoped;
    return [...matched].sort(compareExams);
  }, [exams, group, query]);

  const selected = exams.find((exam) => exam.id === selectedExamId) ?? exams[0];
  const selectedVisible = visibleExams.some((exam) => exam.id === selectedExamId);

  // Khi lọc/tìm kiếm làm đề đang chọn biến mất khỏi danh sách, tự chọn đề đầu tiên
  // để nút "Bắt đầu làm bài" không chạy một đề người dùng không còn nhìn thấy.
  useEffect(() => {
    if (!selectedVisible && visibleExams.length > 0) onExamChange(visibleExams[0].id);
  }, [selectedVisible, visibleExams, onExamChange]);

  const moduleRows = (Object.keys(MODULE_LABELS) as ModuleId[])
    .map((module) => ({ module, label: MODULE_LABELS[module], count: selected.questions.filter((question) => question.module === module).length }))
    .filter((item) => item.count > 0);

  const selectedGuide = findGuideByExamId(selected.id);

  const handleGroupChange = (next: GroupId) => {
    setGroup(next);
    listRef.current?.scrollTo({ top: 0 });
  };

  return (
    <div className="app-frame">
      <AppHeader title="Luyện thi AI" />
      <main className="home page-shell">
        <section className="welcome-heading">
          <span className="eyebrow">AI TEST · OPEN SOURCE</span>
          <h1>Sẵn sàng cho buổi luyện tập?</h1>
          <p>Chọn một đề phù hợp và bắt đầu củng cố kiến thức AI thực chiến của bạn.</p>
        </section>

        <StudyGuideList onOpenExam={onExamChange} />

        <section className="exam-library card">
          <div className="section-heading">
            <div><span className="eyebrow">THƯ VIỆN ĐỀ THI</span><h2>Chọn bài kiểm tra</h2></div>
            <span className="count-badge">{exams.length} đề</span>
          </div>

          <div className="group-tabs" role="tablist" aria-label="Nhóm đề thi">
            {groupTabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={group === tab.id}
                className={group === tab.id ? 'group-tab active' : 'group-tab'}
                onClick={() => handleGroupChange(tab.id)}
              >
                {tab.label}<small>{tab.count}</small>
              </button>
            ))}
          </div>

          <label className="search-field">
            <span>Tìm kiếm đề thi</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nhập tên hoặc nội dung đề..." />
          </label>

          {visibleExams.length === 0 ? (
            <div className="empty-state"><strong>Không tìm thấy đề phù hợp</strong><span>Thử tìm bằng từ khóa khác hoặc đổi nhóm đề.</span></div>
          ) : (
            <>
              <div className="exam-grid" ref={listRef}>
                {visibleExams.map((exam) => {
                  const isActive = exam.id === selectedExamId;
                  return (
                    <button
                      key={exam.id}
                      type="button"
                      aria-pressed={isActive}
                      className={isActive ? 'exam-card active' : 'exam-card'}
                      onClick={() => onExamChange(exam.id)}
                    >
                      <span className="exam-card__badge">{examBadge(exam)}</span>
                      <strong className="exam-card__title">{exam.title}</strong>
                      <span className="exam-card__meta">{exam.questions.length} câu · {exam.durationMinutes} phút</span>
                    </button>
                  );
                })}
              </div>
              <p className="list-note">Đang hiển thị {visibleExams.length} đề.</p>

              <div className="exam-overview">
                <div className="exam-overview__header">
                  <div><strong>{selected.title}</strong><span>{selected.description}</span></div>
                  <div className="meta-chips"><span>{selected.questions.length} câu hỏi</span><span>{selected.durationMinutes} phút</span></div>
                </div>
                {selectedGuide && (
                  <a className="guide-inline" href={studyGuideUrl(selectedGuide)} target="_blank" rel="noreferrer">
                    Xem tóm tắt lý thuyết {selectedGuide.label} <span aria-hidden="true">↗</span>
                  </a>
                )}
                <div className="module-list">
                  {moduleRows.map((item) => <div key={item.module}><b>{item.module}</b><span><strong>{item.label}</strong><small>{item.count} câu hỏi</small></span></div>)}
                </div>
              </div>
            </>
          )}
        </section>

        <section className="setup card">
          <div className="section-heading"><div><span className="eyebrow">CẤU HÌNH</span><h2>Thiết lập bài làm</h2></div></div>

        <div className="mode-grid">
          <button className={mode === 'practice' ? 'active mode-card' : 'mode-card'} onClick={() => onModeChange('practice')}>
            <strong>Luyện tập</strong>
            <span>Xem đáp án và giải thích ngay sau khi chọn.</span>
          </button>
          <button className={mode === 'exam' ? 'active mode-card' : 'mode-card'} onClick={() => onModeChange('exam')}>
            <strong>Thi thử</strong>
            <span>Chỉ xem đáp án sau khi hoàn tất bài thi.</span>
          </button>
        </div>

        <label className="toggle-row">
          <span><strong>Bật đồng hồ đếm ngược</strong><small>Thời gian làm bài: {selected.durationMinutes} phút</small></span>
          <input type="checkbox" checked={timerEnabled} onChange={(event) => onTimerChange(event.target.checked)} />
        </label>
        <div className="setup-action-bar">
          <button className="primary start-button" disabled={visibleExams.length === 0} onClick={onStart}>Bắt đầu làm bài <span aria-hidden="true">→</span></button>
          <p className="setup-note">Tiến độ được lưu tự động trên thiết bị này.</p>
        </div>
        </section>

        <footer className="home-footer">
          <a className="community-cta" href={COMMUNITY_URL} target="_blank" rel="noreferrer">Cộng đồng AI Thực Chiến <span aria-hidden="true">↗</span></a>
          <Disclaimer />
        </footer>
      </main>
    </div>
  );
}
