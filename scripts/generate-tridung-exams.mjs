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

/** Facts biên soạn trực tiếp theo tài liệu trong onthi, không đọc lại đề JSON có sẵn. */
const factsByDay = {
  2: [
    ['Problem Statement', 'Nêu rõ người dùng, nỗi đau, bối cảnh và kết quả cần thay đổi', 'Bắt đầu bằng việc chọn model lớn nhất'],
    ['Double Diamond', 'Mở rộng để khám phá rồi thu hẹp để xác định vấn đề và giải pháp', 'Chọn ngay giải pháp đầu tiên mà không cần nghiên cứu'],
    ['PAIR', 'Dùng dữ liệu và nghiên cứu để kiểm tra tính phù hợp của cơ hội AI', 'Chỉ đánh giá tốc độ viết code'],
    ['Rule–Workflow–Agent', 'Chọn mức tự động hóa theo độ ổn định và mức cần suy luận của công việc', 'Luôn dùng agent cho mọi tác vụ đơn giản'],
    ['Reward function', 'Biến mục tiêu mong muốn thành tín hiệu có thể đánh giá', 'Thay thế hoàn toàn phản hồi người dùng'],
    ['Data readiness', 'Kiểm tra dữ liệu có sẵn, hợp pháp, đủ chất lượng và đại diện', 'Giả định có dữ liệu rồi mới xác minh sau'],
    ['Success metric', 'Phải gắn với kết quả người dùng hoặc kinh doanh cụ thể', 'Chỉ đo số lượng slide đã trình bày'],
    ['Go / Not Yet / No-Go', 'Ra quyết định dựa trên bằng chứng về giá trị, khả thi và rủi ro', 'Luôn chọn Go để không chậm tiến độ']
  ],
  3: [
    ['Agentic Fit', 'Chỉ nên dùng agent khi nhiệm vụ có mục tiêu, phản hồi và cần nhiều bước quyết định', 'Dùng agent cho mọi câu hỏi tra cứu đơn giản'],
    ['ReAct', 'Luân phiên suy luận, hành động và quan sát kết quả tool', 'Sinh một câu trả lời duy nhất mà không kiểm tra'],
    ['Observation', 'Là tín hiệu từ tool hoặc môi trường để agent cập nhật bước tiếp theo', 'Là prompt hệ thống cố định'],
    ['Function calling', 'Cho model gọi tool theo schema có cấu trúc thay vì tự viết hành động mơ hồ', 'Cho model tự chạy mọi lệnh không giới hạn'],
    ['Tool boundary', 'Tool cần có phạm vi quyền hạn, input và output rõ ràng', 'Tool nên nhận câu lệnh tự do không kiểm tra'],
    ['Trace', 'Ghi lại các bước suy luận, tool call và kết quả để debug', 'Chỉ lưu câu trả lời cuối cùng'],
    ['Stop condition', 'Đặt giới hạn vòng lặp, ngân sách và điều kiện dừng an toàn', 'Cho agent chạy đến khi tự thấy hài lòng'],
    ['Retry', 'Chỉ retry lỗi tạm thời với giới hạn và quan sát rõ ràng', 'Retry vô hạn mọi lỗi']
  ],
  4: [
    ['RTCF', 'Làm rõ Role, Task, Context và Format trong prompt', 'Chỉ viết một câu lệnh càng dài càng tốt'],
    ['Few-shot', 'Cung cấp ví dụ đầu vào–đầu ra để định hướng định dạng hoặc cách suy luận', 'Thay thế hoàn toàn việc nêu yêu cầu'],
    ['System prompt', 'Đặt quy tắc, vai trò và ràng buộc ổn định cho toàn phiên', 'Là nơi để người dùng ghi mọi dữ liệu bí mật'],
    ['Context engineering', 'Chọn lọc, tổ chức và làm mới đúng ngữ cảnh cần cho nhiệm vụ', 'Nhồi mọi tài liệu vào prompt'],
    ['Prompt injection', 'Là chỉ dẫn không tin cậy cố gắng đổi mục tiêu hoặc vượt quyền hệ thống', 'Là lỗi chính tả bình thường của người dùng'],
    ['Tool schema', 'Xác định tham số, kiểu dữ liệu và ràng buộc khi gọi tool', 'Cho phép tool nhận bất kỳ chuỗi nào'],
    ['Output validation', 'Kiểm tra format và dữ liệu trước khi dùng đầu ra của model', 'Tin đầu ra vì model trả lời tự tin'],
    ['Prompt iteration', 'Cải thiện prompt dựa trên tập eval và failure case cụ thể', 'Chỉnh prompt theo cảm giác sau một ví dụ']
  ],
  5: [
    ['Leap of Faith assumption', 'Là giả định quan trọng nhưng chưa được chứng minh, cần kiểm thử sớm', 'Là tính năng đã chắc chắn có người dùng'],
    ['Prototype fidelity', 'Bắt đầu mức rẻ nhất đủ để trả lời giả định cần kiểm tra', 'Luôn làm giao diện hoàn chỉnh trước'],
    ['MVP', 'Là phiên bản tối thiểu người dùng có thể dùng để kiểm tra workflow', 'Là bản có nhiều tính năng nhất'],
    ['Wizard of Oz', 'Dùng con người phía sau để kiểm tra trải nghiệm trước khi tự động hóa', 'Che giấu rủi ro cho người dùng production'],
    ['PRD for AI', 'Nêu rõ job-to-be-done, dữ liệu, metric, fallback và giới hạn AI', 'Chỉ mô tả giao diện'],
    ['Nondeterminism', 'Đầu ra AI có thể thay đổi nên cần eval và xử lý lỗi dự kiến', 'AI luôn cho cùng một đáp án'],
    ['Trust calibration', 'Thiết kế để người dùng tin đúng mức vào năng lực và giới hạn AI', 'Làm AI trông chắc chắn trong mọi trường hợp'],
    ['Evaluation flow', 'Đi từ kiểm tra nhanh sang offline eval rồi theo dõi khi triển khai', 'Chỉ đánh giá sau khi có khiếu nại']
  ],
  6: [],
  7: [
    ['RAG versus fine-tuning', 'RAG phù hợp khi cần kiến thức thay đổi và truy xuất nguồn; fine-tuning phù hợp để đổi hành vi ổn định', 'Fine-tuning luôn thay thế mọi nhu cầu truy xuất'],
    ['Chunking', 'Chia tài liệu thành đơn vị đủ nghĩa và phù hợp retrieval', 'Cắt văn bản đúng số ký tự bất kể ngữ nghĩa'],
    ['Chunk overlap', 'Giảm mất ngữ cảnh ở ranh giới giữa các chunk', 'Làm mô hình không cần embedding'],
    ['Embedding', 'Biểu diễn nội dung bằng vector để so sánh ngữ nghĩa', 'Lưu văn bản dưới dạng ảnh'],
    ['Cosine similarity', 'Đo mức gần nhau về hướng của các vector', 'Đo số ký tự trong tài liệu'],
    ['Vector store', 'Lưu, lập chỉ mục và truy vấn embedding hiệu quả', 'Thay thế hệ quản trị người dùng'],
    ['Metadata filter', 'Thu hẹp kết quả theo thuộc tính như quyền truy cập hoặc thời gian', 'Bỏ mọi điều kiện bảo mật trước retrieval'],
    ['Ingestion pipeline', 'Đọc, làm sạch, chunk, embed và index dữ liệu có kiểm soát', 'Đưa tài liệu thẳng vào prompt mỗi lần hỏi']
  ],
  8: [
    ['Hybrid retrieval', 'Kết hợp sparse và dense retrieval để bao phủ cả từ khóa lẫn ngữ nghĩa', 'Chỉ lấy kết quả đầu tiên của một nguồn'],
    ['RRF', 'Hợp nhất nhiều bảng xếp hạng dựa trên thứ hạng thay vì so trực tiếp score khác thang', 'Bỏ các nguồn có kết quả khác nhau'],
    ['Reranking', 'Dùng mô hình mạnh hơn sắp lại một tập ứng viên nhỏ', 'Thay thế hoàn toàn bước retrieval'],
    ['MMR', 'Cân bằng độ liên quan và tính đa dạng của context', 'Luôn lấy các chunk giống hệt nhau'],
    ['Grounding', 'Buộc câu trả lời dựa trên bằng chứng được truy xuất', 'Khuyến khích model suy đoán khi thiếu nguồn'],
    ['Abstention', 'Từ chối hoặc hỏi thêm khi bằng chứng không đủ', 'Tự tin trả lời mọi câu hỏi'],
    ['Lost in the middle', 'Thông tin ở giữa context dài dễ bị model chú ý kém hơn', 'Chỉ xảy ra khi không có chunk nào'],
    ['RAGAS', 'Nhóm metric chẩn đoán chất lượng retrieval, context và câu trả lời RAG', 'Một vector database']
  ],
  9: [
    ['Multi-agent', 'Phân chia vai trò khi một agent không đủ khả năng hoặc khó kiểm soát', 'Tạo nhiều agent cho mọi tác vụ đơn giản'],
    ['Supervisor-worker', 'Supervisor phân công, kiểm tra và tổng hợp kết quả của worker', 'Mọi worker tự đổi quyền của nhau'],
    ['Pipeline pattern', 'Chuyển đầu ra qua các bước chuyên môn theo thứ tự rõ ràng', 'Cho mọi agent tranh luận vô thời hạn'],
    ['MCP', 'Chuẩn kết nối model với tools, resources và prompts bên ngoài', 'Giao thức chỉ để chat giữa hai người dùng'],
    ['A2A', 'Chuẩn giao tiếp giữa các agent độc lập với năng lực được công bố', 'Cơ chế thay thế database'],
    ['AgentCard', 'Mô tả năng lực, endpoint và cách tương tác của một agent', 'Là lịch sử chat bí mật'],
    ['LangGraph state', 'Lưu trạng thái luồng điều phối giữa các node agent', 'Xóa mọi thông tin sau mỗi tool call'],
    ['Trace', 'Theo dõi route, trạng thái và tool call để xác định lỗi hệ thống', 'Chỉ hiển thị thời gian bắt đầu']
  ],
  10: [
    ['ETL / ELT', 'Tổ chức ingest, biến đổi và lưu dữ liệu theo kiến trúc phù hợp', 'Đồng nghĩa với việc chỉ copy file'],
    ['Data quality', 'Kiểm tra dữ liệu đủ, hợp lệ, nhất quán, không trùng và kịp thời', 'Chỉ kiểm tra file có tồn tại'],
    ['Data contract', 'Thống nhất schema, ownership và kỳ vọng giữa producer với consumer', 'Lời hứa miệng không cần kiểm thử'],
    ['Freshness SLA', 'Đặt ngưỡng dữ liệu được cập nhật kịp thời cho use case', 'Đo dung lượng file lớn hay nhỏ'],
    ['Schema drift', 'Phát hiện cấu trúc dữ liệu thay đổi so với kỳ vọng', 'Là việc vector thay đổi độ dài'],
    ['Data drift', 'Phân phối hoặc đặc điểm dữ liệu thay đổi theo thời gian', 'Là lỗi UI đổi màu'],
    ['Idempotency', 'Chạy lại job không làm nhân bản hoặc làm sai kết quả', 'Không cho phép retry job'],
    ['Quarantine', 'Cô lập dữ liệu đáng ngờ để điều tra thay vì đưa ngay vào phục vụ', 'Xóa dữ liệu không cần kiểm tra']
  ],
  11: [
    ['AI safety', 'Giảm nguy cơ AI gây hại hoặc hành động vượt ý định của con người', 'Chỉ làm UI trông hiện đại hơn'],
    ['Prompt injection', 'Input độc hại cố thay đổi chỉ dẫn hoặc lấy dữ liệu ngoài phạm vi', 'Một cách hợp lệ để đổi quyền tool'],
    ['Indirect injection', 'Chỉ dẫn độc hại ẩn trong tài liệu hoặc trang web mà agent đọc', 'Lỗi người dùng gõ sai mật khẩu'],
    ['Defense in depth', 'Dùng nhiều lớp kiểm soát thay vì tin vào một guardrail duy nhất', 'Tắt các lớp kiểm tra để giảm latency'],
    ['Input guardrail', 'Sàng lọc input nguy hiểm, ngoài phạm vi hoặc chứa dữ liệu nhạy cảm', 'Chỉ sửa lỗi chính tả đầu vào'],
    ['Output guardrail', 'Kiểm tra đầu ra trước khi gửi người dùng hoặc kích hoạt hành động', 'Cho phép output tự thực thi'],
    ['Human in the loop', 'Yêu cầu con người duyệt các hành động có rủi ro cao', 'Loại bỏ trách nhiệm của con người'],
    ['Red teaming', 'Chủ động tấn công thử hệ thống để tìm lỗ hổng và failure mode', 'Chỉ kiểm thử đường đi thành công']
  ],
  12: [
    ['Container', 'Đóng gói ứng dụng cùng dependency để chạy nhất quán giữa môi trường', 'Là một virtual machine đầy đủ hệ điều hành'],
    ['Docker image', 'Là mẫu bất biến dùng để tạo container', 'Là log runtime thay đổi liên tục'],
    ['Secrets management', 'Lưu credential ngoài source code và cấp theo quyền tối thiểu', 'Ghi API key trực tiếp trong frontend'],
    ['Async request', 'Dùng job queue hoặc streaming khi tác vụ dài vượt timeout HTTP', 'Giữ kết nối đồng bộ vô hạn'],
    ['Authentication', 'Xác thực danh tính trước khi cho dùng agent hoặc tool', 'Chỉ ẩn URL endpoint'],
    ['CI/CD', 'Tự động kiểm tra và triển khai có kiểm soát qua các môi trường', 'Deploy thủ công không cần test'],
    ['Rollback', 'Quay về phiên bản ổn định khi phát hiện lỗi production', 'Xóa toàn bộ log để làm lại'],
    ['Cost guard', 'Đặt quota, ngân sách và cảnh báo để kiểm soát chi phí model', 'Chờ hóa đơn cuối tháng rồi mới xem']
  ],
  13: [
    ['Monitoring', 'Theo dõi metric để biết hệ thống có đang đạt mục tiêu vận hành hay không', 'Chỉ lưu văn bản hội thoại thô'],
    ['Logging', 'Ghi sự kiện có cấu trúc phục vụ điều tra và audit', 'Chỉ vẽ biểu đồ tổng quan'],
    ['Tracing', 'Liên kết các bước của một request qua nhiều dịch vụ hoặc tool', 'Xóa request ID để bảo mật'],
    ['Latency percentile', 'Dùng p95/p99 để nhìn trải nghiệm chậm ở đuôi phân phối', 'Chỉ dùng trung bình để bỏ qua outlier'],
    ['Quality metric', 'Đo tính đúng, groundedness hoặc mức hài lòng chứ không chỉ uptime', 'Chỉ đếm số request'],
    ['Alert rule', 'Kết hợp ngưỡng, thời gian kéo dài và mức độ ảnh hưởng để cảnh báo hữu ích', 'Báo động cho mọi dao động nhỏ'],
    ['Cardinality', 'Kiểm soát số lượng giá trị label để hệ quan sát không quá tải', 'Tăng vô hạn label theo user ID'],
    ['Runbook', 'Nêu bước triage, ownership và xử lý khi alert kích hoạt', 'Chỉ liệt kê tên dashboard']
  ],
  14: [
    ['Evaluation objective', 'Xác định rõ hành vi hoặc kết quả cần chứng minh trước khi chọn metric', 'Chọn metric dễ đẹp nhất rồi mới tìm mục tiêu'],
    ['Benchmark', 'Tập case và cách chấm chuẩn để so sánh nhất quán', 'Một demo gồm vài ví dụ thành công'],
    ['Evaluation dataset', 'Phải đại diện các use case, edge case và rủi ro quan trọng', 'Chỉ gồm các ví dụ model trả lời đúng'],
    ['LLM-as-a-Judge', 'Dùng model chấm theo rubric rõ ràng và cần kiểm chứng độ tin cậy', 'Chấp nhận điểm chấm không cần rubric'],
    ['RAGAS', 'Đánh giá các khía cạnh như faithfulness, relevance và context của RAG', 'Thay thế hoàn toàn đánh giá con người'],
    ['Slice evaluation', 'Phân tích metric theo nhóm tình huống để không che lỗi cục bộ', 'Gộp tất cả điểm thành một số duy nhất'],
    ['Calibration', 'Độ tự tin của hệ thống cần phù hợp với xác suất nó đúng', 'Làm model luôn trả lời chắc chắn'],
    ['Failure analysis', 'Phân loại và ưu tiên lỗi để sửa đúng tầng nguyên nhân', 'Chỉ đọc các câu trả lời hay nhất']
  ]
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

factsByDay[6] = day6Facts;

function generatedQuestions(day) {
  const facts = factsByDay[day];
  const result = [];
  const forms = [
    (term) => `Phát biểu nào mô tả đúng nhất về ${term}?`,
    (term) => `Trong một dự án AI, cách áp dụng ${term} nào là phù hợp nhất?`,
    (term) => `Khi đội ngũ bỏ qua ${term}, rủi ro nào cần được phòng tránh? Chọn nguyên tắc đúng.`,
    (term) => `Mục tiêu chính của ${term} trong hệ thống AI là gì?`,
    (term) => `Tình huống nào thể hiện cách hiểu đúng về ${term}?`,
    (term) => `Nếu cần ra quyết định về ${term}, tiêu chí nào nên được ưu tiên?`,
    (term) => `Lựa chọn nào KHÔNG phải là cách làm đúng khi vận dụng ${term}?`,
    (term) => `Trong vận hành thực tế, ${term} giúp đội ngũ làm điều gì?`
  ];

  for (let round = 0; round < forms.length; round += 1) {
    for (const [term, correct, wrong] of facts) {
      const { options, answer } = optionSet(correct, wrong);
      result.push({
        id: `D${String(day).padStart(2, '0')}-${String(result.length + 1).padStart(3, '0')}`,
        type: 'mcq',
        prompt: forms[round](term),
        options,
        answer,
        explanation: `${correct}. Nội dung được biên soạn từ tài liệu ${sourceFiles[day]} của Ngày ${day}.`,
        source: `onthi/${sourceFiles[day]}`
      });
    }
  }
  return result.slice(0, 60);
}

function loadQuestions(day) {
  return generatedQuestions(day);
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
