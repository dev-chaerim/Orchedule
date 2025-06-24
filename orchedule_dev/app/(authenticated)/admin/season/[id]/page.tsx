"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, notFound } from "next/navigation";
import BackButton from "@/components/ui/BackButton";
import ConfirmModal from "@/components/modals/ConfirmModal";
import ActionButtons from "@/components/common/ActionButtons";
import LoadingText from "@/components/common/LoadingText";

interface Member {
  _id: string;
  name: string;
  part: string;
}

interface Season {
  _id: string;
  name: string;
  startDate: string;
  endDate?: string;
  pieces: string[];
  members: Member[];
}

export default function SeasonDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [season, setSeason] = useState<Season | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  // 시즌 상세 데이터 가져오기
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

  // 삭제 요청 처리
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

  // 로딩 중 표시
  if (isLoading) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <LoadingText message="시즌 정보를 불러오는 중이에요..." />
      </main>
    );
  }

  // 시즌이 없을 때 처리
  if (!season) return notFound();

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <div className="flex justify-between items-center">
        <BackButton fallbackHref="/admin/season" label="목록" />
        <ActionButtons
          onEdit={() => router.push(`/admin/season/${season._id}/edit`)}
          onDelete={() => setShowConfirm(true)}
        />
      </div>

      <div className="bg-white border border-[#E0D6CD] rounded-lg p-5 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-lg font-bold text-[#3E3232]">{season.name}</h1>
            <p className="text-sm text-gray-500">
              기간: {new Date(season.startDate).toLocaleDateString()} ~{" "}
              {season.endDate
                ? new Date(season.endDate).toLocaleDateString()
                : "미정"}
            </p>
          </div>
        </div>

        {/* 등록된 곡 */}
        <div className="mt-4">
          <h2 className="text-sm font-semibold text-[#3E3232] mb-2">
            🎵 등록된 곡
          </h2>
          {season.pieces.length > 0 ? (
            <ul className="list-none text-sm text-gray-700">
              {season.pieces.map((piece, i) => (
                <li key={i} className="flex items-center gap-2 mb-1 ml-1">
                  <span className="text-[#645858] text-base">•</span>
                  <span>{piece}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">등록된 곡이 없습니다.</p>
          )}
        </div>

        {/* 참여 단원 */}
        <div className="mt-4">
          <h2 className="text-sm font-semibold text-[#3E3232] mb-2">
            👥 참여 단원 ({season.members?.length ?? 0}명)
          </h2>
          {season.members && season.members.length > 0 ? (
            <ul className="list-none text-sm text-gray-700">
              {season.members.map((member) => (
                <li
                  key={member._id}
                  className="flex items-center gap-2 mb-1 ml-1"
                >
                  <span className="text-[#645858] text-base">•</span>
                  <span>
                    {member.name} ({member.part})
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">아직 참여 단원이 없습니다.</p>
          )}
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
