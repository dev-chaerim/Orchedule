"use client";

import { useEffect, useState } from "react";
import { useSeasonStore } from "@/lib/store/season";
import { useRouter } from "next/navigation";
import ScheduleCard from "@/components/admin/ScheduleCard";
import type { Schedule } from "@/src/lib/types/schedule"; // ✅ 공통 Schedule 타입 import
import ErrorMessage from "@/components/common/ErrorMessage";

export default function SchedulePage() {
  const selectedSeason = useSeasonStore((state) => state.selectedSeason);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(false); // ✅ 로딩 상태 추가
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSchedules = async () => {
      setIsLoading(true); // ✅ 로딩 시작
      try {
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
        setError(true);
      } finally {
        setIsLoading(false); // ✅ 로딩 종료
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

  if (error) return <ErrorMessage />;

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
        {isLoading ? (
          <div className="text-center text-[#a79c90] text-sm py-6">
            ⏳ 연습일정을 불러오는 중이에요...
          </div>
        ) : schedules.length > 0 ? (
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
