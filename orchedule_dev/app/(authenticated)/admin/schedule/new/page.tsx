"use client";

import ScheduleForm from "@/components/admin/ScheduleForm";
import { useRouter } from "next/navigation";
import { useSeasonStore } from "@/lib/store/season";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { useState } from "react";
import BackButton from "@/components/BackButton";
import {
  PracticeSession,
  OrchestraSession,
  SpecialNotice,
} from "@/src/lib/types/schedule";

export default function NewSchedulePage() {
  const router = useRouter();
  const selectedSeason = useSeasonStore((state) => state.selectedSeason);

  const [showModal, setShowModal] = useState(false);
  const [formKey, setFormKey] = useState(0); // 폼 리셋용 키

  const handleSubmit = async (data: {
    date: string;
    auditionSessions: PracticeSession[];
    partSessions: PracticeSession[];
    orchestraSession: OrchestraSession;
    specialNotices?: SpecialNotice[];
  }) => {
    if (!selectedSeason) {
      alert("시즌이 선택되지 않았습니다.");
      return;
    }

    try {
      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seasonId: selectedSeason._id,
          ...data,
        }),
      });

      if (!res.ok) throw new Error("등록 실패");

      setShowModal(true); // 등록 성공 시 모달 띄움
    } catch (err) {
      console.error("등록 실패:", err);
      alert("일정 등록에 실패했습니다.");
    }
  };

  const handleContinue = () => {
    setShowModal(false);
    setFormKey((prev) => prev + 1); // 폼 리셋
  };

  const handleGoToList = () => {
    router.push("/admin/schedule");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <BackButton label="목록으로" fallbackHref="/admin/schedule" />
      <h2 className="text-lg font-bold text-[#3E3232] mb-4">
        새 연습일정 추가
      </h2>

      <ScheduleForm
        key={formKey}
        onSubmit={handleSubmit}
        submitLabel="일정 등록"
      />

      <ConfirmModal
        open={showModal}
        message="일정이 등록되었습니다. 계속 등록하시겠습니까?"
        confirmLabel="계속 등록"
        cancelLabel="목록으로 가기"
        onConfirm={handleContinue}
        onCancel={handleGoToList}
      />
    </div>
  );
}
