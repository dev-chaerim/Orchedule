// /app/(authenticated)/admin/season/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton";
import ConfirmModal from "@/components/modals/ConfirmModal";
import Link from "next/link";

interface Season {
  _id: string;
  name: string;
  startDate: string;
  endDate?: string;
  pieces: string[];
}

export default function SeasonDetailPage() {
  // ✅ useParams로 URL 파라미터 가져오기
  const { id } = useParams();
  const router = useRouter();
  const [season, setSeason] = useState<Season | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  // ✅ 시즌 상세 데이터 가져오기
  useEffect(() => {
    if (!id) return;

    const fetchSeason = async () => {
      try {
        const res = await fetch(`/api/seasons/${id}`);
        if (!res.ok) throw new Error("시즌 정보를 불러오지 못했습니다.");
        const data = await res.json();
        setSeason(data);
      } catch (error) {
        console.error("시즌 상세 정보 불러오기 실패:", error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };
    fetchSeason();
  }, [id]);

  // ✅ 삭제 요청 처리
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/seasons/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("시즌 삭제 실패");
      router.push("/admin/season");
    } catch (error) {
      console.error("시즌 삭제 오류:", error);
      alert("시즌 삭제에 실패했습니다.");
    }
  };

  // ✅ 로딩 중 표시
  if (isLoading) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <p className="text-gray-500">로딩 중...</p>
      </main>
    );
  }

  // ✅ 시즌이 없을 때 처리
  if (!season) return notFound();

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <BackButton fallbackHref="/admin/season" label="목록" />

      <div className="bg-white border border-[#E0D6CD] rounded-lg p-5 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-lg font-bold text-[#3E3232]">{season.name}</h1>
            <p className="text-sm text-gray-500">
              기간: {season.startDate} ~ {season.endDate || "미정"}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/season/${season._id}/edit`}>
              <button className="text-xs font-semibold bg-[#F4ECE7] text-[#3E3232] px-3 py-1 rounded-md hover:bg-[#e3dcd7] transition">
                수정
              </button>
            </Link>
            <button
              onClick={() => setShowConfirm(true)}
              className="text-xs font-semibold bg-red-50 text-red-400 px-3 py-1 rounded-md hover:bg-red-100 transition"
            >
              삭제
            </button>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-sm font-semibold text-[#3E3232] mb-2">
            🎵 등록된 곡
          </h2>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {season.pieces.map((piece, i) => (
              <li key={i}>{piece}</li>
            ))}
          </ul>
        </div>
      </div>

      <ConfirmModal
        open={showConfirm}
        message="정말 이 시즌을 삭제하시겠습니까?"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </main>
  );
}
