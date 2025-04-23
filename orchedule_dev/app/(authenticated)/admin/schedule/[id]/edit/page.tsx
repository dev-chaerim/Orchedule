"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import ScheduleForm from "@/components/admin/ScheduleForm";
import { mockSchedules } from "@/lib/mock/schedule";

interface Piece {
  time: string;
  title: string;
  note?: string;
}

interface Params {
  id: string;
}

export default function EditSchedulePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const router = useRouter();
  const { id } = use(params); // ✅ use()로 언래핑
  const numericId = Number(id);

  const schedule = mockSchedules.find((s) => s.id === numericId);
  if (!schedule) {
    return <div className="p-6 text-red-500">일정을 찾을 수 없습니다.</div>;
  }

  const handleSubmit = async (data: { date: string; pieces: Piece[] }) => {
    console.log("✏️ 일정 수정됨:", data);
    router.push("/admin/schedule");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-lg font-bold text-[#3E3232] mb-4">연습일정 수정</h2>
      <ScheduleForm
        defaultDate={schedule.date}
        defaultPieces={schedule.pieces}
        onSubmit={handleSubmit}
        submitLabel="수정 저장"
      />
    </div>
  );
}
