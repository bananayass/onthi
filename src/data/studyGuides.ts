import type { StudyGuide } from '../types/exam';

/**
 * Tài liệu ôn tập dạng trang HTML tĩnh.
 *
 * Mỗi file nằm trong `public/study/` nên được Vite copy nguyên vẹn sang `dist/`.
 * Đường dẫn mở trang được ghép với `import.meta.env.BASE_URL` (xem `studyGuideUrl`)
 * để chạy đúng cả khi dev ở `/` lẫn khi deploy GitHub Pages ở `/AI-TEST/`.
 */
export const studyGuides: StudyGuide[] = [
  {
    // `day: 0` để tài liệu này luôn đứng đầu danh sách — nó là nền cho mọi buổi
    // còn lại chứ không thuộc riêng buổi nào.
    id: 'study-glossary',
    file: 'thuat-ngu-tu-luan.html',
    title: 'Từ điển thuật ngữ cho phần tự luận',
    summary:
      '114 thuật ngữ tiếng Anh xuất hiện trong đề bài và rubric của 40 câu tự luận Ngày 1–14. Mỗi thuật ngữ giải thích theo hướng nó giải quyết vấn đề gì và dùng trong tình huống nào, kèm 20 cặp dễ nhầm và bản đồ câu tự luận nào cần thuật ngữ nào.',
    course: 'aicb',
    day: 0,
    label: 'Thuật ngữ',
    topics: ['114 thuật ngữ', '20 cặp dễ nhầm', 'Bản đồ 40 câu tự luận', 'Flashcard', 'Tìm kiếm nhanh']
  },
  {
    id: 'study-day01',
    file: 'day01-ai-llm-foundation.html',
    title: 'AI & LLM Foundation',
    summary:
      'Nền tảng: phân tầng AI/ML/DL/GenAI/LLM, lịch sử 70 năm và hai mùa đông AI, cơ chế đoán token và attention, token economy, cách chọn model và gọi API.',
    course: 'aicb',
    day: 1,
    label: 'Ngày 1',
    topics: ['Token & context', 'Attention', 'RLHF', 'Chọn model theo tầng', 'Gọi API'],
    examId: 'exam-91'
  },
  {
    id: 'study-day02',
    file: 'day02-xac-dinh-bai-toan-ai.html',
    title: 'Xác định bài toán cho AI',
    summary:
      'Từ yêu cầu mơ hồ đến Problem Statement rõ ràng: Double Diamond, PAIR ba bước, chọn cấp độ Rule/Workflow/Agent, reward function và khung quyết định Go/Not Yet/No-Go.',
    course: 'aicb',
    day: 2,
    label: 'Ngày 2',
    topics: ['Double Diamond', 'Problem Statement', 'PAIR 3 bước', 'Rule/Workflow/Agent', 'Go / Not Yet / No-Go'],
    examId: 'exam-92'
  },
  {
    id: 'study-day03',
    file: 'day03-chatbot-den-agentic-agent.html',
    title: 'Từ Chatbot Đến Agentic Agent',
    summary:
      'Design pattern ReAct: phân biệt bot / chatbot / agent, khung Agentic Fit, vòng lặp Thought–Action–Observation, và bước tiến hóa từ ReAct text sang function calling.',
    course: 'aicb',
    day: 3,
    label: 'Ngày 3',
    topics: ['Agentic Fit', 'ReAct loop', 'Function calling', 'Agent guardrails', 'Chatbot vs Agent'],
    examId: 'exam-93'
  },
  {
    id: 'study-day04',
    file: 'day04-prompt-engineering-tool-calling.html',
    title: 'Prompt Engineering & Tool Calling',
    summary:
      'Làm sao nói để AI hiểu đúng ý: khung RTCF, few-shot và CoT, system prompt production-grade, context engineering, phòng thủ prompt injection và thiết kế tool schema.',
    course: 'aicb',
    day: 4,
    label: 'Ngày 4',
    topics: ['RTCF', 'Few-shot & CoT', 'System prompt', 'Prompt injection', 'Tool schema'],
    examId: 'exam-94'
  },
  {
    id: 'study-day05',
    file: 'day05-thiet-ke-san-pham-ai.html',
    title: 'Thiết kế sản phẩm AI cho sự không chắc chắn',
    summary:
      'Từ prototype rẻ nhất đến trải nghiệm đáng tin: Leap of Faith và Wizard of Oz MVP, khung PRD 6 bước cho AI feature, thiết kế cho nondeterminism, trust calibration và chu trình eval ba giai đoạn.',
    course: 'aicb',
    day: 5,
    label: 'Ngày 5',
    topics: ['MVP & Wizard of Oz', 'PRD cho AI feature', 'Nondeterminism', 'Trust calibration', 'Precision/Recall & Eval flow'],
    examId: 'exam-107'
  },
  {
    id: 'study-day06',
    file: 'day06-ai-product-project-management.html',
    title: 'AI Product & Project Management',
    summary:
      'Quản lý dự án AI trong điều kiện bất định: AI sprint, Definition of Done, PoC/MVE/MVP, thử nghiệm time-box, ROI theo ba kịch bản và cách trình bày để xin quyết định rõ ràng.',
    course: 'aicb',
    day: 6,
    label: 'Ngày 6',
    topics: ['AI sprint & Definition of Done', 'MVE / MVP / PoC', 'Wizard of Oz', 'ROI & break-even', 'Stakeholder deck'],
    examId: 'day6-tridung'
  },
  {
    id: 'study-day07',
    file: 'day07-embedding-vector-store.html',
    title: 'Data Foundations: Embedding & Vector Store',
    summary:
      'Nền tảng dữ liệu cho RAG: chọn In-Context / RAG / Fine-tuning, các chiến lược chunking, embedding và cosine similarity, vector store cùng metadata filter, và ingestion pipeline ba khối.',
    course: 'aicb',
    day: 7,
    label: 'Ngày 7',
    topics: ['RAG vs Fine-tuning', 'Chunking strategies', 'Embedding & Cosine', 'Vector store', 'Ingestion pipeline'],
    examId: 'exam-97'
  },
  {
    id: 'study-day08',
    file: 'day08-rag-pipeline.html',
    title: 'RAG Pipeline: Retrieval · Augmentation · Generation',
    summary:
      'Nâng retrieval pipeline thành RAG hoàn chỉnh: hybrid search với RRF và alpha weighting, rerank và MMR, context injection chống lost-in-the-middle, grounding và abstention, cùng khung RAGAS để chẩn đoán lỗi.',
    course: 'aicb',
    day: 8,
    label: 'Ngày 8',
    topics: ['Hybrid search & RRF', 'Rerank & MMR', 'Context injection', 'Grounding & Abstention', 'RAGAS Triad'],
    examId: 'exam-98'
  },
  {
    id: 'study-day09',
    file: 'day09-multi-agent-mcp-a2a.html',
    title: 'Multi-Agent, MCP & A2A',
    summary:
      'Khi một agent không còn đủ: bốn giới hạn của single-agent, bốn pattern phối hợp, supervisor-worker với contract và state, MCP nối agent với tool, A2A nối agent với agent, và trace để lần ra lỗi.',
    course: 'aicb',
    day: 9,
    label: 'Ngày 9',
    topics: ['4 giới hạn single-agent', '4 pattern multi-agent', 'Phiếu giao việc & State', 'MCP vs A2A', 'LangGraph & Trace'],
    examId: 'exam-100'
  },
  {
    id: 'study-day10',
    file: 'day10-data-pipeline-observability.html',
    title: 'Data Pipeline & Data Observability',
    summary:
      'Biết data hỏng trước khi user biết: data cascade và ETL/ELT, ingestion với CDC · backoff · cursor · DLQ, sáu dimension chất lượng và data contract, năm pillar observability cùng freshness SLA, rồi chính sách halt/quarantine/warn và orchestration.',
    course: 'aicb',
    day: 10,
    label: 'Ngày 10',
    topics: ['Data cascade', 'ETL/ELT & Batch/Streaming', '6 Dimensions & Data contract', '5 Pillars & Freshness SLA', 'HALT/Quarantine/Warn'],
    examId: 'exam-101'
  },
  {
    id: 'study-day11',
    file: 'day11-guardrails-ai-safety.html',
    title: 'Guardrails & AI Safety',
    summary:
      'Agent mạnh rồi — ai kiểm soát nó: sáu loại rủi ro và thuật ngữ AI Safety, alignment/control/governance, attack vector từ prompt injection tới jailbreak, input–LLM–output rails theo defense in depth, red teaming, HITL và Trust UX.',
    course: 'aicb',
    day: 11,
    label: 'Ngày 11',
    topics: ['6 rủi ro & thuật ngữ', 'Alignment & Governance', 'Injection & Jailbreak', 'Input/Output rails', 'Red teaming, HITL & Trust UX'],
    examId: 'exam-102'
  },
  {
    id: 'study-day16',
    file: 'day16-advanced-agent-architectures.html',
    title: 'Advanced Agent Architectures',
    summary:
      'Harness & kiến trúc agent: ba failure mode của ReAct, Reflexion, LATS, self-evolving agent, sáu hook middleware và ma trận chọn lớp.',
    course: 'aicb',
    day: 16,
    label: 'Ngày 16',
    topics: ['Reflexion', 'LATS & PRM', '6 hook middleware', 'Context engineering', 'Guardrails'],
    examId: 'exam-103'
  },
  {
    id: 'study-day17',
    file: 'day17-memory-systems.html',
    title: 'Memory Systems for Agents',
    summary:
      'Bộ nhớ cho agent: phân loại short-term / long-term và semantic / episodic / procedural, kiến trúc lưu trữ, ngân sách token.',
    course: 'aicb',
    day: 17,
    label: 'Ngày 17',
    topics: ['Short-term vs long-term', 'Semantic & episodic', 'Memory store', 'Token budget'],
    examId: 'exam-104'
  },
  {
    id: 'study-day18',
    file: 'day18-production-rag.html',
    title: 'Production RAG',
    summary:
      'Đưa RAG từ demo 60% lên production 85%+: chunking, enrichment, hybrid retrieval, reranking, RAGAS và Error Tree để sửa đúng tầng.',
    course: 'aicb',
    day: 18,
    label: 'Ngày 18',
    topics: ['Chunking', 'Hybrid + RRF', 'Reranking', 'RAGAS', 'Error Tree'],
    examId: 'exam-105'
  },
  {
    id: 'study-day19',
    file: 'day19-graphrag-knowledge-graphs.html',
    title: 'GraphRAG & Knowledge Graphs',
    summary:
      'Khi vector search thất bại: nền tảng knowledge graph, pipeline GraphRAG năm bước, Microsoft GraphRAG và LightRAG, chiến lược chọn kiến trúc.',
    course: 'aicb',
    day: 19,
    label: 'Ngày 19',
    topics: ['Triple & Cypher', 'Extraction bottleneck', 'BFS traversal', 'MS GraphRAG', 'LightRAG'],
    examId: 'exam-106'
  }
];

/** Ghép đường dẫn tuyệt đối tới trang ôn tập, tôn trọng `base` của Vite. */
export function studyGuideUrl(guide: StudyGuide): string {
  return `${import.meta.env.BASE_URL}study/${guide.file}`;
}

/** Tra tài liệu ôn tập gắn với một đề cụ thể. */
export function findGuideByExamId(examId: string): StudyGuide | undefined {
  return studyGuides.find((guide) => guide.examId === examId);
}
