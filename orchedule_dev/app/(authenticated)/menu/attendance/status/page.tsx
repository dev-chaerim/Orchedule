"use client";

import React, { useEffect, useState } from "react";
import { useAttendance } from "@/context/AttendanceContext";
import SectionChart from "@/components/attendance/SectionChart";
import { orderedParts, partFamilies } from "@/constants/parts";
import { getNearestDate } from "@/src/lib/utils/getNearestDate";
import { format } from "date-fns";
import { useSeasonStore } from "@/lib/store/season";
import { Schedule } from "@/src/lib/types/schedule";
import LoadingText from "@/components/common/LoadingText";
import FilterDropdown from "@/components/dropdown/FilterDropdown"; // 경로는 프로젝트 구조에 따라 조정

function AttendanceLegend() {
  const items = [
    { label: "출석", color: "#BCD9B9" },
    { label: "지각", color: "#f7d3ab" },
    { label: "불참", color: "#C2C2C2" },
  ];

  return (
    <div className="flex justify-end mt-4 pr-1">
      <div className="flex gap-3">
        {items.map(({ label, color }) => (
          <div
            key={label}
            className="flex items-center gap-1 text-sm text-[#7e6a5c]"
          >
            <span
              className="inline-block w-2 h-2 rounded-full text-xs"
              style={{ backgroundColor: color }}
            />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AttendanceStatusPage() {
  const { selectedFamily } = useAttendance();
  const { setSelectedFamily } = useAttendance();
  const { selectedSeason } = useSeasonStore();

  const [selectedDate, setSelectedDate] = useState("");
  const [nearestSchedule, setNearestSchedule] = useState<Schedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const today = new Date();
  const start = new Date(selectedSeason?.startDate ?? "");
  const end = selectedSeason?.endDate ? new Date(selectedSeason.endDate) : null;

  const isNotCurrentSeason =
    !selectedSeason || start > today || (end !== null && end < today);

  useEffect(() => {
    setIsLoading(true);
    setNearestSchedule(null);
    setSelectedDate("");

    const fetchSchedules = async () => {
      try {
        const res = await fetch(
          `/api/schedules${
            selectedSeason?._id ? `?seasonId=${selectedSeason._id}` : ""
          }`
        );
        const data: Schedule[] = await res.json();

        if (!data || data.length === 0) {
          return;
        }

        const dateStrings = data.map((s) => s.date);
        const nearestDateStr = getNearestDate(dateStrings);
        const nearest = data.find((s) => s.date === nearestDateStr) ?? null;

        setNearestSchedule(nearest);
        setSelectedDate(nearest?.date || "");
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

  const formattedDate = selectedDate
    ? format(new Date(selectedDate), "yyyy년 M월 d일")
    : "";

  const isCancelled = nearestSchedule?.isCancelled;

  const renderNotice = (text: string, highlight?: string) => (
    <div className="bg-[#ffffff] border border-[#e0dada] rounded-xl p-5 py-10 text-center w-full">
      <p className="text-sm text-[#5e5246] leading-relaxed">
        {highlight ? (
          <>
            {text} <strong className="text-[#dd6b60]">{highlight}</strong>
            입니다.
          </>
        ) : (
          text
        )}
      </p>
    </div>
  );

  // ✅ 1. 로딩 중
  if (isLoading) {
    return <LoadingText message="출석 정보를 불러오는 중입니다..." />;
  }

  // ✅ 2. 현재 시즌 아님
  if (isNotCurrentSeason) {
    return renderNotice(
      "현재 시즌이 아닐 경우 출석 기능을 사용할 수 없습니다."
    );
  }

  // ✅ 3. 일정 없음
  if (!nearestSchedule) {
    return renderNotice("등록된 연습일정이 없습니다.");
  }

  // ✅ 4. 휴강일
  if (isCancelled) {
    return renderNotice("다음 연습일은", "휴강일");
  }

  // ✅ 5. 정상 렌더링
  return (
    <div className="px-2 -mt-3 bg-[#FAF9F6]">
      <FilterDropdown
        options={Object.keys(partFamilies)} // 예: ["현악", "목관", ...]
        selected={selectedFamily}
        onChange={(value) => setSelectedFamily(value)}
        buttonClassName="mb-4 min-w-[80px] max-w-[100px] bg-white text-[#3e3232d4] truncate"
        optionClassName="bg-[#ede5de] hover:bg-[#dfd7d0] text-[#3e3232]"
      />
      <div className="flex items-end justify-between px-1 pt-2">
        <p className="text-sm text-[#7e6a5c] flex items-center gap-1 mb-2">
          <span className="relative top-[1px]">📅</span>
          <strong>{formattedDate}</strong>
        </p>

        {/* 오른쪽 범례 */}
      </div>
      <AttendanceLegend />

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {selectedDate &&
          orderedParts
            .filter((part) => partFamilies[selectedFamily].includes(part))
            .map((part) => (
              <SectionChart
                key={part}
                part={part}
                selectedDate={selectedDate}
              />
            ))}
      </div>
    </div>
  );
}
