"use client";

import { useEffect, useState } from "react";
import AttendanceForm from "./AttendanceForm";
import MemberAttendanceList from "./MemberAttendanceList";
import { AttendanceRecord } from "@/src/lib/types/attendance";
import { Schedule } from "@/src/lib/types/schedule";
import { useSeasonStore } from "@/lib/store/season";
import { getNearestDate } from "@/src/lib/utils/getNearestDate";
import LoadingText from "@/components/common/LoadingText";

export default function AttendanceCheckPage() {
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [nearestSchedule, setNearestSchedule] = useState<Schedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const selectedSeason = useSeasonStore((state) => state.selectedSeason);

  const today = new Date();
  const start = new Date(selectedSeason?.startDate ?? "");
  const end = selectedSeason?.endDate ? new Date(selectedSeason.endDate) : null;

  const isNotCurrentSeason =
    !selectedSeason || start > today || (end !== null && end < today);

  useEffect(() => {
    setIsLoading(true);
    setNearestSchedule(null);

    const fetchSchedules = async () => {
      try {
        const res = await fetch(
          `/api/schedules${
            selectedSeason?._id ? `?seasonId=${selectedSeason._id}` : ""
          }`
        );
        const data: Schedule[] = await res.json();

        if (!data || data.length === 0) {
          setNearestSchedule(null);
          return;
        }

        const dateStrings = data.map((s) => s.date);
        const nearestDateStr = getNearestDate(dateStrings);
        const nearest = data.find((s) => s.date === nearestDateStr) ?? null;

        setNearestSchedule(nearest);
      } catch (err) {
        console.error("일정 조회 실패", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedSeason?._id && !isNotCurrentSeason) {
      fetchSchedules();
    } else {
      setIsLoading(false);
    }
  }, [selectedSeason]);

  if (isLoading) {
    return <LoadingText message="출석부를 불러오는 중입니다..." />;
  }

  if (isNotCurrentSeason) {
    return (
      <div className="bg-[#ffffff] border border-[#e0dada] rounded-xl p-5 py-10 text-center w-full">
        <p className="text-sm text-[#5e5246] leading-relaxed">
          현재 시즌이 아닐 경우 출석 기능을 사용할 수 없습니다.
        </p>
      </div>
    );
  }

  if (!nearestSchedule) {
    return (
      <div className="bg-[#ffffff] border border-[#e0dada] rounded-xl p-5 py-10 text-center w-full">
        <p className="text-sm text-[#5e5246] leading-relaxed">
          등록된 연습일정이 없습니다.
        </p>
      </div>
    );
  }

  const isCancelled = nearestSchedule.isCancelled;

  if (isCancelled) {
    return (
      <div className="bg-[#ffffff] border border-[#e0dada] rounded-xl p-5 py-10 text-center w-full">
        <p className="text-[#5e5246] text-base leading-relaxed">
          다음 연습일은{" "}
          <strong className="font-semibold text-[#dd6b60]">휴강일</strong>
          입니다.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AttendanceForm
        setAttendanceRecords={setAttendanceRecords}
        setRefreshTrigger={setRefreshTrigger}
      />
      <MemberAttendanceList
        attendanceRecords={attendanceRecords}
        refreshTrigger={refreshTrigger}
        setAttendanceRecords={setAttendanceRecords}
      />
    </div>
  );
}
