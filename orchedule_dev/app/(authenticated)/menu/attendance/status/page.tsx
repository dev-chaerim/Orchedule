"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useAttendance } from "@/context/AttendanceContext";
import SectionChart from "@/components/attendance/SectionChart";
import { orderedParts, partFamilies } from "@/constants/parts";
import { getNearestDate } from "@/src/lib/utils/getNearestDate";
import { format } from "date-fns";

function AttendanceLegend() {
  const items = [
    { label: "출석", color: "#BCD9B9" },
    { label: "지각", color: "#f7d3ab" },
    { label: "불참", color: "#C2C2C2" },
  ];

  return (
    <div className="flex justify-end mt-4 pr-2">
      <div className="flex gap-4">
        {items.map(({ label, color }) => (
          <div
            key={label}
            className="flex items-center gap-2 text-sm text-[#7e6a5c]"
          >
            <span
              className="inline-block w-3 h-3 rounded-full"
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
  const [selectedDate, setSelectedDate] = useState("");

  const formattedDate = selectedDate
    ? format(new Date(selectedDate), "yyyy년 M월 d일")
    : "";

  useEffect(() => {
    const fetchDates = async () => {
      const res = await fetch("/api/schedules/dates");
      const dates = await res.json();
      const nearest = getNearestDate(dates);
      setSelectedDate(nearest);
    };
    fetchDates();
  }, []);

  return (
    <div className="px-4 bg-[#FAF9F6]">
      <div className="flex items-end justify-between px-1 mt-4 mb-2">
        {/* 왼쪽 날짜 */}
        <p className="text-sm text-[#7e6a5c] flex items-center gap-1">
          <span className="relative top-[1px]">📅</span>
          <strong>{formattedDate}</strong>
        </p>

        {/* 오른쪽 범례 */}
        <AttendanceLegend />
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
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
