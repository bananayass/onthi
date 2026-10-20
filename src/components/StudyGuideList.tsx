import { studyGuides, studyGuideUrl } from '../data/studyGuides';

interface Props {
  /** Chọn đề trắc nghiệm tương ứng với tài liệu, không rời khỏi trang. */
  onOpenExam: (examId: string) => void;
}

/**
 * Mục "Tài liệu ôn tập" — liên kết tới các trang tóm tắt lý thuyết dạng HTML tĩnh.
 * Mỗi trang mở ở tab mới để người dùng vừa đọc vừa làm bài được.
 */
export function StudyGuideList({ onOpenExam }: Props) {
  if (studyGuides.length === 0) return null;

  const sorted = [...studyGuides].sort((a, b) => a.day - b.day);

  return (
    <section className="study-library card">
      <div className="section-heading">
        <div><span className="eyebrow">TÀI LIỆU ÔN TẬP</span><h2>Tóm tắt lý thuyết</h2></div>
        <span className="count-badge">{sorted.length} bài</span>
      </div>
      <p className="study-intro">
        Tài liệu theo buổi gồm ba phần: tóm tắt chi tiết, cheat sheet in được và bộ thẻ ghi nhớ lật hai mặt.
        Riêng bài “Thuật ngữ” là từ điển tra cứu dùng chung cho cả khoá, đặt ở đầu danh sách.
      </p>

      <div className="study-grid">
        {sorted.map((guide) => (
          <article key={guide.id} className="study-card">
            <div className="study-card__head">
              <span className="study-card__badge">{guide.label}</span>
              <h3>{guide.title}</h3>
            </div>
            <p className="study-card__summary">{guide.summary}</p>
            <div className="study-card__topics">
              {guide.topics.map((topic) => <span key={topic}>{topic}</span>)}
            </div>
            <div className="study-card__actions">
              <a className="primary study-open" href={studyGuideUrl(guide)} target="_blank" rel="noreferrer">
                Mở tài liệu <span aria-hidden="true">↗</span>
              </a>
              {guide.examId && (
                <button type="button" className="secondary" onClick={() => onOpenExam(guide.examId as string)}>
                  Chọn đề {guide.label}
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
