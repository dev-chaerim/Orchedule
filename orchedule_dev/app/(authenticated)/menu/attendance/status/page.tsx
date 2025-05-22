"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useAttendance } from "@/context/AttendanceContext";
import SectionChart from "@/components/attendance/SectionChart";
import { orderedParts, partFamilies } from "@/constants/parts";
import { getNearestDate } from "@/src/lib/utils/getNearestDate";

export default function AttendanceStatusPage() {
  const { selectedFamily } = useAttendance();
  const [selectedDate, setSelectedDate] = useState("");

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
