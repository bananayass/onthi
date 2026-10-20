import { Fragment, type ReactNode } from 'react';

interface Props {
  text: string;
}

/**
 * Định dạng inline tối giản, đủ cho đề bài và đáp án mẫu:
 * `code` → thẻ <code>, **đậm** → thẻ <strong>.
 *
 * Cố ý KHÔNG dựng cả một bộ Markdown: chỉ hai cú pháp này xuất hiện trong dữ liệu đề,
 * và mỗi cú pháp thêm vào là thêm một cách làm vỡ nội dung do người soạn gõ nhầm.
 */
function inline(text: string, keyPrefix: string): ReactNode[] {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean).map((token, index) => {
    const key = `${keyPrefix}-${index}`;
    if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
      return <code key={key}>{token.slice(1, -1)}</code>;
    }
    if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
      return <strong key={key}>{token.slice(2, -2)}</strong>;
    }
    return <Fragment key={key}>{token}</Fragment>;
  });
}

export function RichText({ text }: Props) {
  const parts = text.split(/```/g);
  return (
    <div className="rich-text">
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          const cleaned = part.replace(/^\w+\n/, '').trim();
          return <pre key={index}><code>{cleaned}</code></pre>;
        }
        return part.split('\n').filter(Boolean).map((line, lineIndex) => (
          <p key={`${index}-${lineIndex}`}>{inline(line, `${index}-${lineIndex}`)}</p>
        ));
      })}
    </div>
  );
}
