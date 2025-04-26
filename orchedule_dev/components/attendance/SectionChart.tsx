// src/components/attendance/SectionChart.tsx
"use client";

import React from "react";
import { mockMembers, Member, PartKey } from "@/lib/mock/members";
import { partLabels } from "@/constants/parts";

interface Props {
  part: PartKey;
}

const SectionChart: React.FC<Props> = ({ part }) => {
  // 해당 파트의 모든 단원
  const partMembers = mockMembers.filter((m) => m.part === part);

  // 2명씩 한 줄이므로, 총 줄 수는 올림(partMembers.length / 2)
  const rows = Math.ceil(partMembers.length / 2);

  return (
    <div className="w-full max-w-[640px] bg-white rounded-xl p-4 border border-[#ece7e2] mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-[#3e3232]">
          {partLabels[part]}
        </h3>
        <button className="px-3 py-1 text-xs bg-white border border-[#ece7e2] rounded-full text-[#7e6a5c]">
          배치하기
        </button>
      </div>

      {/* 동적 줄 수만큼 반복 */}
      <div className="space-y-3">
        {Array.from({ length: rows }, (_, rowIdx) => {
          // 왼쪽 멤버, 오른쪽 멤버
          const left = partMembers[rowIdx * 2];
          const right = partMembers[rowIdx * 2 + 1];
          return (
            <div key={rowIdx} className="flex justify-center">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#7e6a5c]">{rowIdx + 1}</span>
                <SeatCell member={left} />
                <SeatCell member={right} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SeatCell: React.FC<{ member?: Member }> = ({ member }) => (
  <div className="w-12 h-12 bg-[#FAF9F6] rounded-lg shadow-sm flex items-center justify-center text-sm text-[#3e3232]">
    {member?.name ?? ""}
  </div>
);

export default SectionChart;
