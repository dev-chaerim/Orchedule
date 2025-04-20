"use client";

import { useParams } from "next/navigation";
import { mockScoreChecks } from "@/lib/mock/scoreChecks";
import BackButton from "@/components/BackButton";

export default function ScoreCheckDetailPage() {
  const { id } = useParams();
  const sheet = mockScoreChecks.find((s) => String(s.id) === String(id));

  if (!sheet) return <div>악보를 찾을 수 없습니다.</div>;

  return (
    <div className="p-3 space-y-4">
      {/* 뒤로가기 버튼 */}
      <BackButton fallbackHref="/menu/sheetmusic/bowing" label="목록" />

      {/* 본문 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
        <h1 className="text-lg font-bold">{sheet.title}</h1>
        <div className="text-sm text-gray-500">
          {sheet.date} · {sheet.author}
        </div>

        {/* 파트 표시 */}
        <div className="text-sm text-gray-700">
          대상 파트: {sheet.parts.join(", ")}
        </div>

        {/* 태그 */}
        <div className="text-xs text-gray-400">작품: {sheet.tag}</div>

        {/* 다운로드 */}
        <a
          href={sheet.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 bg-[#7E6363] text-white text-sm px-4 py-2 rounded-md hover:bg-[#5c4f4f] transition"
        >
          <span>📄</span> 악보 다운로드
        </a>
      </div>
    </div>
  );
}
