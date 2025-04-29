"use client";

import React from "react";

interface ScheduleCardProps {
  time: string;
  description: string;
  color?: string;
}

export default function ScheduleCard({
  time,
  description,
  color = "#a5796e",
}: ScheduleCardProps) {
  return (
    <div className="flex flex-col items-start mb-4">
      {/* 시간 박스 (독립) */}
      <div
        className="text-white text-xs font-semibold px-3 py-1 rounded-md mb-2"
        style={{ backgroundColor: color }}
      >
        {time}
      </div>

      {/* 곡 제목 박스 (하얀색) */}
      <div className="bg-white w-full text-sm text-[#3E3232] rounded-md px-4 py-3 shadow-sm">
        {description}
      </div>
    </div>
  );
}
