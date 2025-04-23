"use client";

import ScheduleForm from "@/components/admin/ScheduleForm";
import { useRouter } from "next/navigation";

interface Piece {
  time: string;
  title: string;
  note?: string;
}

export default function NewSchedulePage() {
  const router = useRouter();

  const handleSubmit = async (data: { date: string; pieces: Piece[] }) => {
    console.log("✅ 새 일정 등록됨:", data);
    router.push("/admin/schedule");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-lg font-bold text-[#3E3232] mb-4">
        새 연습일정 추가
      </h2>
      <ScheduleForm onSubmit={handleSubmit} submitLabel="일정 등록" />
    </div>
  );
}
