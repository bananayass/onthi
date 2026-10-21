import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const examDir = path.join(root, 'src', 'data', 'exams');
const outputRoot = path.join(root, 'onthi', 'bo-de-tridung');
const appOutputRoot = path.join(examDir, 'tridung-dep-trai');

const sourceFiles = {
  2: 'day2_on_thi.html', 3: 'day3_on_thi.html', 4: 'Day4_Context_Loop_Harness_Beginner_Notes.html',
  5: 'Day5_AI_Product_Thinking_Beginner_Notes.html', 6: 'Day6_AI_Product_Project_Management_Beginner_Notes.html',
  7: 'Day7_Data_Foundations_Beginner_Notes.html', 8: 'Day8_RAG_Pipeline_Beginner_Notes.html',
  9: 'Day9_Multi_Agent_MCP_A2A_LangGraph_Beginner_Notes.html', 10: 'Day10_Data_Pipeline_Observability_Beginner_Notes.html',
  11: 'Day11_Guardrails_HITL_Responsible_AI_Beginner_Notes.html', 12: 'Day12_Deployment_Agent_Cloud_Beginner_Notes.html',
  13: 'Day13_Monitoring_Logging_Observability_Beginner_Notes.html', 14: 'Day14_AI_Evaluation_Benchmarking_Beginner_Notes.html'
};

const bankDir = path.join(root, 'scripts', 'tridung-banks');
const MCQ_COUNT = 60;
const ESSAY_COUNT = 10;
const rubric = ['Đúng khái niệm trọng tâm', 'Có lập luận hoặc ví dụ cụ thể', 'Nêu rủi ro/đánh đổi phù hợp', 'Đề xuất hành động có thể kiểm chứng'];

const normalize = (text) => text.toLowerCase().normalize('NFC').replace(/\s+/g, ' ').trim();

/** Băm chuỗi thành số nguyên để xáo đáp án ổn định giữa các lần sinh lại. */
function hash(text) {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ ch.codePointAt(0), 16777619);
  return h >>> 0;
}

/** Ngân hàng soạn tay từ PDF + HTML từng ngày; mỗi câu một ý, chặn trùng câu hỏi và đáp án đúng. */
function loadBank(day) {
  const file = path.join(bankDir, `day${day}.json`);
  const bank = JSON.parse(fs.readFileSync(file, 'utf8'));
  const errors = [];
  if (bank.mcq.length !== MCQ_COUNT) errors.push(`cần ${MCQ_COUNT} câu trắc nghiệm, có ${bank.mcq.length}`);
  if (bank.essay.length !== ESSAY_COUNT) errors.push(`cần ${ESSAY_COUNT} câu tự luận, có ${bank.essay.length}`);
  const prompts = new Set();
  const answers = new Set();
  for (const [index, row] of bank.mcq.entries()) {
    if (row.length !== 6 || row.some((cell) => typeof cell !== 'string' || !cell.trim())) errors.push(`MCQ #${index + 1} sai định dạng`);
    const [prompt, correct] = row;
    if (new Set(row.slice(1, 5).map(normalize)).size !== 4) errors.push(`MCQ #${index + 1} có phương án trùng nhau`);
    if (prompts.has(normalize(prompt))) errors.push(`MCQ #${index + 1} trùng câu hỏi`);
    if (answers.has(normalize(correct))) errors.push(`MCQ #${index + 1} trùng đáp án đúng với câu khác`);
    prompts.add(normalize(prompt));
    answers.add(normalize(correct));
  }
  for (const [index, [prompt, modelAnswer]] of bank.essay.entries()) {
    if (!prompt || !modelAnswer) errors.push(`Tự luận #${index + 1} thiếu prompt hoặc modelAnswer`);
    if (prompts.has(normalize(prompt))) errors.push(`Tự luận #${index + 1} trùng câu hỏi`);
    prompts.add(normalize(prompt));
  }
  if (errors.length) throw new Error(`${path.basename(file)}: ${errors.join('; ')}`);
  return bank;
}

function mcqs(day, bank) {
  return bank.mcq.map(([prompt, correct, wrong1, wrong2, wrong3, explanation], index) => {
    const id = `D${String(day).padStart(2, '0')}-${String(index + 1).padStart(3, '0')}`;
    const choices = [correct, wrong1, wrong2, wrong3];
    const shift = hash(id) % 4;
    const arranged = choices.map((_, i) => choices[(i + shift) % 4]);
    return {
      id,
      type: 'mcq',
      prompt,
      options: arranged.map((text, i) => ({ key: 'ABCD'[i], text })),
      answer: 'ABCD'[arranged.indexOf(correct)],
      explanation,
      source: `onthi/${sourceFiles[day]} + onthi/day${day}.pdf`
    };
  });
}

function essays(day, bank) {
  return bank.essay.map(([prompt, modelAnswer], index) => ({
    id: `D${String(day).padStart(2, '0')}-TL-${String(index + 1).padStart(2, '0')}`,
    type: 'essay',
    prompt,
    modelAnswer,
    rubric
  }));
}

fs.mkdirSync(outputRoot, { recursive: true });
fs.mkdirSync(appOutputRoot, { recursive: true });
for (let day = 2; day <= 14; day += 1) {
  const dir = path.join(outputRoot, `day${day}_tridung`);
  fs.mkdirSync(dir, { recursive: true });
  const bank = loadBank(day);
  const mcqQuestions = mcqs(day, bank);
  const header = {
    id: `day${day}_tridung`,
    title: `Bộ đề ôn tập Ngày ${day} — Trí Dũng`,
    sourceFolder: 'onthi',
    questionCount: mcqQuestions.length,
    questions: mcqQuestions
  };
  const essayQuestions = essays(day, bank);
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
      ...mcqQuestions.map((question) => ({ ...question, module: 'C', points: 1 })),
      ...essayQuestions.map((question) => ({
        id: question.id,
        module: 'D',
        type: 'essay',
        points: 4,
        prompt: question.prompt,
        modelAnswer: question.modelAnswer,
        rubric: question.rubric
      }))
    ]
  };
  fs.writeFileSync(path.join(appOutputRoot, `day${day}_tridung.json`), `${JSON.stringify(appExam, null, 2)}\n`, 'utf8');
}
console.log(`Created Day 2–14 exam folders in ${outputRoot}`);
