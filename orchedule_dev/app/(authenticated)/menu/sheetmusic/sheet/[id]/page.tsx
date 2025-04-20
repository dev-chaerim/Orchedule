"use client";

import { useParams } from "next/navigation";
import { mockSheets } from "@/lib/mock/sheets";
import BackButton from "@/components/BackButton";

export default function SeasonSheetDetailPage() {
  const { id } = useParams();
  const sheet = mockSheets.find((s) => String(s.id) === String(id));

  if (!sheet) return <div>악보를 찾을 수 없습니다.</div>;

  return (
    <div className="space-y-6">
      {/* 뒤로가기 버튼 */}
      <BackButton fallbackHref="/menu/sheetmusic/sheet" label="목록" />
      <div className="px-2">
        {/* 제목 */}
        <h1 className="text-lg font-bold mb-2">{sheet.title}</h1>

        {/* 작성일, 작성자 */}
        <div className="text-xs text-gray-400">
          {sheet.date} · {sheet.author}
        </div>
      </div>

      {/* 본문 설명, 다운로드, 영상 - 카드 박스 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        {/* 설명 */}
        <div className="whitespace-pre-line text-sm text-gray-700">
          {sheet.content || "파트보를 확인해주세요."}
        </div>

        {/* 다운로드 버튼 */}
        <a
          href={sheet.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 bg-[#7E6363] text-white text-sm px-4 py-2 rounded-md hover:bg-[#5c4f4f] transition"
        >
          <span>📄</span> 악보 다운로드
        </a>

        {/* 참고 영상 */}
        {sheet.youtubeUrl && (
          <div>
            <a
              href={sheet.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 text-sm hover:underline"
            >
              ▶️ 참고 영상 보기
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
