"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import BackButton from "@/components/BackButton";

interface ScoreCheck {
  _id: string;
  title: string;
  date: string; // ISO 문자열
  author: string;
  parts: string[];
  tag: string;
  fileUrl: string;
}

export default function ScoreCheckDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [sheet, setSheet] = useState<ScoreCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/score-checks/${id}`);
        if (!res.ok) throw new Error("악보를 찾을 수 없습니다.");
        const data = await res.json();
        setSheet(data);
      } catch (err) {
        console.error(err);
        setError("악보를 찾을 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("정말로 이 악보를 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`/api/score-checks/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("삭제되었습니다.");
        router.push("/menu/sheetmusic/bowing");
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  if (loading)
    return <div className="p-4 text-sm text-gray-500">로딩 중...</div>;
  if (error || !sheet)
    return <div className="p-4 text-sm text-red-500">{error}</div>;

  const formattedDate = new Date(sheet.date).toLocaleString("ko-KR");

  return (
    <div className="p-3 space-y-4">
      <BackButton fallbackHref="/menu/sheetmusic/bowing" label="목록" />

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <div className="space-y-2">
          <h1 className="text-lg font-bold">{sheet.title}</h1>
          <div className="text-sm text-gray-500">
            {formattedDate} · {sheet.author}
          </div>
          <div className="text-sm text-gray-700">
            대상 파트: {sheet.parts.join(", ")}
          </div>
          <div className="text-xs text-gray-400">작품: {sheet.tag}</div>

          <a
            href={sheet.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 bg-[#7E6363] text-white text-sm px-4 py-2 rounded-md hover:bg-[#5c4f4f] transition"
          >
            <span>📄</span> 악보 다운로드
          </a>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-dashed border-gray-200 pt-4">
          <Link
            href={`/menu/sheetmusic/bowing/${id}/edit`}
            className="inline-flex items-center gap-1 text-sm text-[#7E6363] border border-[#e0dada] px-4 py-2 rounded-md hover:bg-[#f8f6f5] transition"
          >
            ✏️ 수정
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-1 text-sm text-[#7E6363] border border-[#e0dada] px-4 py-2 rounded-md hover:bg-[#f8f6f5] transition"
          >
            🗑 삭제
          </button>
        </div>
      </div>
    </div>
  );
}
