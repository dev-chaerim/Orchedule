// ✅ components/admin/SchedulePage.tsx (zustand 버전 + 디자인 개선 + 높이 맞춤)

"use client";

import { useState } from "react";
import { mockSchedules } from "@/lib/mock/schedule";
import ScheduleCard from "@/components/admin/ScheduleCard";
import { useSeasonStore } from "@/lib/store/season";
import { useRouter } from "next/navigation";

export default function SchedulePage() {
  const selectedSeason = useSeasonStore((state) => state.selectedSeason);
  const [schedules, setSchedules] = useState(mockSchedules);
  const router = useRouter();

  const handleDelete = (id: number) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-stretch justify-between mb-6">
        <div className="w-full px-4 py-2 border border-[#e0dada] rounded-lg bg-[#fcfaf9] text-xs text-[#3E3232] flex flex-col justify-center">
          <div className="font-medium text-[#7E6363]">현재 시즌</div>
          <div className="ml-0 font-bold text-sm text-[#3E3232] mt-0.5">
            {selectedSeason?.name}
          </div>
        </div>
        <button
          onClick={() => router.push("/admin/schedule/new")}
          className="ml-4 px-4 py-2 bg-[#7E6363] text-white text-xs font-medium rounded-md hover:bg-[#775656b7]"
        >
          + 새 일정 추가
        </button>
      </div>

      <div className="space-y-4">
        {schedules.map((schedule) => (
          <ScheduleCard
            key={schedule.id}
            schedule={schedule}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
