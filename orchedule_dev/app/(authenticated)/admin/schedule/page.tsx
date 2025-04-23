"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ScheduleCard from "@/components/admin/ScheduleCard";
import SeasonDropdown from "@/components/dropdown/SeasonDropdown";
import { mockSchedules } from "@/lib/mock/schedule"; // 현재는 시즌 정보 없이 사용

export default function AdminSchedulePage() {
  const [selectedSeason, setSelectedSeason] = useState("2025");
  const router = useRouter();

  // 현재는 season 필터 없지만 구조 유지
  const schedules = mockSchedules;

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <SeasonDropdown
          seasons={[{ id: 1, name: "2025" }]}
          selectedSeason={selectedSeason}
          onSelect={setSelectedSeason}
        />
        <button
          className="px-3 py-2 text-sm bg-[#3E3232] text-white rounded hover:bg-[#5c4f4f] transition"
          onClick={() => router.push("/admin/schedule/new")}
        >
          + 새 일정 추가
        </button>
      </div>

      {schedules.length === 0 ? (
        <p className="text-center text-sm text-gray-400 mt-10">
          등록된 연습일정이 없습니다.
        </p>
      ) : (
        <div className="space-y-3">
          {schedules.map((schedule) => (
            <ScheduleCard key={schedule.id} schedule={schedule} />
          ))}
        </div>
      )}
    </div>
  );
}
