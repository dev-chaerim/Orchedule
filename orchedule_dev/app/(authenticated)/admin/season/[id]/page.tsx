"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { mockSeasons } from "@/lib/mock/seasons";
import BackButton from "@/components/BackButton";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { useState } from "react";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default function SeasonDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const season = mockSeasons.find((s) => s.id.toString() === id);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!season) return notFound();

  const handleDelete = () => {
    // 삭제 로직은 여기에 실제 API로 연결 예정
    console.log("삭제된 시즌 ID:", season.id);
    router.push("/admin/season");
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <BackButton fallbackHref="/admin/season" label="목록" />

      <div className="bg-white border border-[#E0D6CD] rounded-lg p-5 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-lg font-bold text-[#3E3232]">{season.name}</h1>
            <p className="text-sm text-gray-500">
              기간: {season.startDate} ~ {season.endDate}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/season/${season.id}/edit`}>
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
