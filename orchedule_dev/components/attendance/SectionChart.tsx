"use client";

import React, { useEffect, useState } from "react";
import { partLabels } from "@/constants/parts";
import { useSeasonStore } from "@/lib/store/season";

// 👉 멤버 타입
export interface MemberType {
  _id: string;
  name: string;
  part: string; // 예: "Vn1", "Vn2", "지휘자" 등
}

// 👉 SeatAssignment 타입
interface SeatAssignment {
  _id: string;
  memberId: MemberType;
  seatNumber: number;
  seasonId: string;
}

interface Props {
  part: string;
}

// 👉 part 키 타입 가드
const isPartKey = (key: string): key is keyof typeof partLabels => {
  return key in partLabels;
};

const SectionChart: React.FC<Props> = ({ part }) => {
  const { selectedSeason } = useSeasonStore();
  const [members, setMembers] = useState<MemberType[]>([]);

  useEffect(() => {
    const fetchAssignedMembers = async () => {
      if (!selectedSeason?._id) return;

      try {
        // ✅ part 파라미터 제거
        const res = await fetch(
          `/api/seat-assignments?seasonId=${selectedSeason._id}`
        );
        if (!res.ok) throw new Error("서버 오류");

        const data: SeatAssignment[] = await res.json();
        console.log("seat assignments", data);

        // ✅ 클라이언트에서 part 기준으로 필터링
        const assignedMembers: MemberType[] = data
          .filter((assignment) => assignment.memberId.part === part)
          .map((assignment) => assignment.memberId);

        setMembers(assignedMembers);
      } catch (error) {
        console.error("자리배치 데이터 불러오기 실패", error);
      }
    };

    fetchAssignedMembers();
  }, [selectedSeason?._id, part]);

  const rows = Math.ceil(members.length / 2);

  return (
    <div className="w-full max-w-[640px] bg-white rounded-xl p-4 border border-[#ece7e2] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-[#3e3232]">
          {isPartKey(part) ? partLabels[part] : part}
        </h3>
      </div>

      <div className="space-y-3">
        {Array.from({ length: rows }, (_, rowIdx) => {
          const left = members[rowIdx * 2];
          const right = members[rowIdx * 2 + 1];

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

const SeatCell: React.FC<{ member?: MemberType }> = ({ member }) => (
  <div className="w-12 h-12 bg-[#FAF9F6] rounded-lg shadow-sm flex items-center justify-center text-sm text-[#3e3232]">
    {member?.name ?? ""}
  </div>
);

export default SectionChart;
