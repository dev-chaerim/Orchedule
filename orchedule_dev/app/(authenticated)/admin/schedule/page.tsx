"use client";

import { useEffect, useState } from "react";
import { useSeasonStore } from "@/lib/store/season";
import { useRouter } from "next/navigation";
import ScheduleCard from "@/components/admin/ScheduleCard";

interface Piece {
  time: string;
  title: string;
  note?: string;
}

interface Schedule {
  _id: string;
  seasonId: string;
  date: string;
  pieces: Piece[];
}

export default function SchedulePage() {
  const selectedSeason = useSeasonStore((state) => state.selectedSeason);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        // ✅ 전체 시즌일 경우 seasonId 파라미터를 제거
        const url = selectedSeason
          ? `/api/schedules?seasonId=${selectedSeason._id}`
          : `/api/schedules`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("일정 불러오기 실패");
        const data = await res.json();
        setSchedules(data);
        console.log("관리자 연습일정 data", data);
      } catch (err) {
        console.error("일정 불러오기 실패:", err);
      }
    };

    fetchSchedules();
  }, [selectedSeason]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/schedules/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("삭제 실패");

      setSchedules((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("삭제 오류:", err);
      alert("삭제에 실패했습니다.");
    }
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
        {schedules.length > 0 ? (
          schedules.map((schedule) => (
            <ScheduleCard
              key={schedule._id}
              schedule={schedule}
              onDelete={() => handleDelete(schedule._id)}
            />
          ))
        ) : (
          <div className="text-sm text-[#7e6a5c] text-center py-10 border border-dashed border-[#e0dada] rounded-md bg-[#fcfaf9]">
            등록된 연습일정이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
