import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const examDir = path.join(root, 'src', 'data', 'exams');
const outputRoot = path.join(root, 'onthi', 'bo-de-tridung');
const appOutputRoot = path.join(examDir, 'tridung-dep-trai');

const sources = {
  2: 'exam-92.json', 3: 'exam-93.json', 4: 'exam-94.json', 5: 'exam-107.json',
  7: 'exam-97.json', 8: 'exam-98.json', 9: 'exam-100.json', 10: 'exam-101.json',
  11: 'exam-102.json', 12: 'exam-109.json', 13: 'exam-110.json', 14: 'exam-111.json'
};

const topics = {
  2: ['Problem Statement', 'Double Diamond', 'PAIR', 'Rule–Workflow–Agent', 'reward function', 'Go / Not Yet / No-Go'],
  3: ['Agentic Fit', 'ReAct loop', 'Thought–Action–Observation', 'function calling', 'trace', 'debug agent'],
  4: ['RTCF', 'few-shot', 'system prompt', 'context engineering', 'prompt injection', 'tool schema'],
  5: ['MVP', 'Wizard of Oz', 'PRD cho AI feature', 'nondeterminism', 'trust calibration', 'evaluation'],
  6: ['AI sprint', 'Definition of Done', 'MVE / MVP / PoC', 'Wizard of Oz', 'PoC Canvas', 'ROI và break-even'],
  7: ['chunking', 'embedding', 'cosine similarity', 'vector store', 'metadata filter', 'ingestion pipeline'],
  8: ['hybrid retrieval', 'RRF', 'reranking', 'MMR', 'grounding', 'RAGAS'],
  9: ['multi-agent', 'supervisor-worker', 'MCP', 'A2A', 'LangGraph', 'trace'],
  10: ['ETL / ELT', 'data quality', 'data contract', 'freshness SLA', 'data drift', 'orchestration'],
  11: ['AI safety', 'prompt injection', 'guardrails', 'HITL', 'red teaming', 'trust UX'],
  12: ['Docker', 'container', 'cloud deployment', 'authentication', 'CI/CD', 'cost guard'],
  13: ['monitoring', 'logging', 'tracing', 'metrics', 'alerting', 'cost observability'],
  14: ['evaluation dataset', 'benchmark', 'LLM-as-a-Judge', 'RAGAS', 'calibration', 'failure analysis']
};

const day6Facts = [
  ['Điểm mạnh của AI sprint là gì?', 'Build, đánh giá, học và điều chỉnh theo bằng chứng', 'Chỉ chốt toàn bộ phạm vi ngay lần đầu'],
  ['AI feature được coi là Done khi nào?', 'Khi đạt tiêu chí chất lượng, latency, fallback và monitoring đã thống nhất', 'Khi code chạy trên máy của người phát triển'],
  ['MVE dùng để kiểm tra điều gì?', 'Liệu người dùng có muốn giá trị đề xuất hay không', 'Liệu toàn bộ hệ thống đã sẵn sàng production hay chưa'],
  ['MVP dùng để kiểm tra điều gì?', 'Workflow tối thiểu có thể dùng được trong thực tế', 'Màu sắc thương hiệu có đẹp hay không'],
  ['PoC ưu tiên trả lời câu hỏi nào?', 'Giải pháp có khả thi và đáng đầu tư tiếp hay không', 'Sản phẩm đã có đủ mọi tính năng tương lai chưa'],
  ['Wizard of Oz phù hợp nhất khi nào?', 'Cần kiểm tra giá trị trải nghiệm trước khi tự động hóa hoàn toàn', 'Cần thay thế vĩnh viễn đội vận hành'],
  ['Time-box experiment cần có gì?', 'Giả định, thời hạn, ngân sách và tiêu chí dừng', 'Cam kết kết quả tích cực trước khi thử nghiệm'],
  ['Low-code/no-code hữu ích nhất cho việc nào?', 'Làm demo và kiểm chứng workflow nhanh', 'Thay thế hoàn toàn quản trị rủi ro'],
  ['PoC Canvas bắt đầu từ nội dung nào?', 'Key hypothesis cần kiểm chứng', 'Danh sách tất cả tính năng mong muốn'],
  ['Vì sao ROI nên có ba kịch bản?', 'Để thể hiện bất định của adoption, chi phí và giá trị', 'Để luôn dùng kịch bản lạc quan khi xin ngân sách'],
  ['Break-even là gì?', 'Mốc giá trị tích lũy bù được chi phí tích lũy', 'Ngày bắt đầu viết mã nguồn'],
  ['Executive deck nên nhấn mạnh gì?', 'ROI, timeline, adoption, rủi ro và quyết định cần phê duyệt', 'Tất cả chi tiết implementation cấp hàm']
];

function optionSet(correct, wrong) {
  const options = [correct, wrong, 'Mở rộng phạm vi trước khi đo kết quả', 'Bỏ qua rủi ro và không cần tiêu chí đánh giá'];
  const index = Math.floor(Math.random() * options.length);
  const arranged = [options[index], ...options.filter((_, i) => i !== index)];
  return {
    options: arranged.map((text, i) => ({ key: 'ABCD'[i], text })),
    answer: 'ABCD'[arranged.indexOf(correct)]
  };
}

function day6Questions() {
  const result = [];
  for (let round = 0; round < 5; round += 1) {
    for (const [basePrompt, correct, wrong] of day6Facts) {
      const suffixes = [
        ' Trong giai đoạn khám phá ban đầu, lựa chọn nào phù hợp nhất?',
        ' Khi cần ra quyết định đầu tư tiếp, cách hiểu nào đúng?',
        ' Trong một tình huống dự án AI còn nhiều bất định, đáp án nào nên được ưu tiên?',
        ' Theo nguyên tắc quản lý sản phẩm AI, phát biểu nào chính xác?',
        ' Nếu là PM của dự án, bạn nên áp dụng nguyên tắc nào?'
      ];
      const { options, answer } = optionSet(correct, wrong);
      result.push({
        id: `D06-${String(result.length + 1).padStart(3, '0')}`,
        type: 'mcq',
        prompt: `${basePrompt}${suffixes[round]}`,
        options,
        answer,
        explanation: `${correct}. Đây là nguyên tắc được nhấn mạnh trong tài liệu Ngày 6 về AI Product & Project Management.`,
        source: 'Day6_AI_Product_Project_Management_Beginner_Notes.html'
      });
    }
  }
  return result;
}

function loadQuestions(day) {
  if (day === 6) return day6Questions();
  const exam = JSON.parse(fs.readFileSync(path.join(examDir, sources[day]), 'utf8'));
  return exam.questions.filter((question) => question.type === 'mcq').slice(0, 60).map((question, index) => ({
    id: `D${String(day).padStart(2, '0')}-${String(index + 1).padStart(3, '0')}`,
    type: 'mcq',
    prompt: question.prompt,
    options: question.options,
    answer: question.answer,
    explanation: question.explanation,
    source: sources[day]
  }));
}

function essays(day) {
  const [a, b, c, d, e, f] = topics[day];
  const prompts = [
    `Giải thích ${a} và nêu một ví dụ áp dụng trong sản phẩm AI.`,
    `So sánh ${a} với ${b}; nêu tiêu chí lựa chọn trong một tình huống thực tế.`,
    `Thiết kế một quy trình ngắn sử dụng ${c} để giảm rủi ro cho người dùng.`,
    `Phân tích một failure mode liên quan đến ${d}, nguyên nhân và cách khắc phục.`,
    `Đề xuất metric đánh giá cho ${e}; giải thích vì sao metric đó hữu ích.`,
    `Lập kế hoạch thử nghiệm nhỏ cho ${f}: giả định, dữ liệu, tiêu chí đạt và tiêu chí dừng.`,
    `Tình huống: kết quả liên quan đến ${a} không đạt kỳ vọng. Bạn sẽ debug theo thứ tự nào?`,
    `Viết khuyến nghị cho stakeholder về lợi ích, giới hạn và rủi ro của ${b}.`,
    `Nêu các đánh đổi khi triển khai ${c} trong production và cách theo dõi sau triển khai.`,
    `Tạo checklist trước khi ship một tính năng AI có dùng ${d} và ${e}.`
  ];
  return prompts.map((prompt, index) => ({
    id: `D${String(day).padStart(2, '0')}-TL-${String(index + 1).padStart(2, '0')}`,
    type: 'essay',
    prompt,
    rubric: ['Đúng khái niệm trọng tâm', 'Có lập luận hoặc ví dụ cụ thể', 'Nêu rủi ro/đánh đổi phù hợp', 'Đề xuất hành động có thể kiểm chứng']
  }));
}

fs.mkdirSync(outputRoot, { recursive: true });
fs.mkdirSync(appOutputRoot, { recursive: true });
for (let day = 2; day <= 14; day += 1) {
  const dir = path.join(outputRoot, `day${day}_tridung`);
  fs.mkdirSync(dir, { recursive: true });
  const mcqs = loadQuestions(day);
  const header = {
    id: `day${day}_tridung`,
    title: `Bộ đề ôn tập Ngày ${day} — Trí Dũng`,
    sourceFolder: 'onthi',
    questionCount: mcqs.length,
    questions: mcqs
  };
  const essayQuestions = essays(day);
  fs.writeFileSync(path.join(dir, 'trac-nghiem.json'), `${JSON.stringify(header, null, 2)}\n`, 'utf8');
  fs.writeFileSync(path.join(dir, 'tu-luan.json'), `${JSON.stringify({ id: `day${day}_tridung_tu_luan`, title: `Tự luận Ngày ${day}`, questionCount: 10, questions: essayQuestions }, null, 2)}\n`, 'utf8');

  const appExam = {
    id: `day${day}-tridung`,
    title: `Trí Dũng đẹp trai · Ngày ${day}`,
    description: `Bộ đề Ngày ${day}: 60 câu trắc nghiệm và 10 câu tự luận, biên soạn từ tài liệu ôn thi cùng ngày.`,
    course: 'tridung',
    kind: 'daily',
    day,
    label: `Ngày ${day}`,
    durationMinutes: 90,
    totalPoints: 100,
    passingScore: 70,
    disclaimer: 'Bộ đề ôn tập Trí Dũng đẹp trai, tham khảo từ tài liệu cùng ngày; không phải đề thi chính thức.',
    questions: [
      ...mcqs.map((question) => ({ ...question, module: 'C', points: 1 })),
      ...essayQuestions.map((question) => ({
        id: question.id,
        module: 'D',
        type: 'essay',
        points: 4,
        prompt: question.prompt,
        modelAnswer: `Bài trả lời cần vận dụng đúng các khái niệm ${topics[day].join(', ')}, đưa ra ví dụ phù hợp, phân tích rủi ro/đánh đổi và đề xuất bước kiểm chứng cụ thể.`,
        rubric: question.rubric
      }))
    ]
  };
  fs.writeFileSync(path.join(appOutputRoot, `day${day}_tridung.json`), `${JSON.stringify(appExam, null, 2)}\n`, 'utf8');
}
console.log(`Created Day 2–14 exam folders in ${outputRoot}`);
