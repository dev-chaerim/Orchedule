"use client";

import React, { useEffect, useState } from "react";
import { partLabels } from "@/constants/parts";
import { useSeasonStore } from "@/lib/store/season";

// 멤버 타입
export interface MemberType {
  _id: string;
  name: string;
  part: string;
}

// SeatAssignment 타입
interface SeatAssignment {
  _id: string;
  memberId: MemberType;
  seatNumber: number;
  seasonId: string;
}

// AttendanceRecord 타입
interface AttendanceRecord {
  memberId: string;
  status: "출석" | "지각" | "불참";
}

// Attendance 응답 타입
interface AttendanceData {
  date: string;
  seasonId: string;
  records: AttendanceRecord[];
}

interface Props {
  part: string;
  selectedDate: string; // 날짜 props 필요
}

// partKey 확인 함수
const isPartKey = (key: string): key is keyof typeof partLabels => {
  return key in partLabels;
};

const SectionChart: React.FC<Props> = ({ part, selectedDate }) => {
  const { selectedSeason } = useSeasonStore();
  const [members, setMembers] = useState<
    (MemberType & { attendanceStatus: string })[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedSeason?._id || !selectedDate) return;

      try {
        const seatRes = await fetch(
          `/api/seat-assignments?seasonId=${selectedSeason._id}`
        );
        const seatData: SeatAssignment[] = await seatRes.json();

        const attendanceRes = await fetch(
          `/api/attendances?seasonId=${selectedSeason._id}&date=${selectedDate}`
        );
        const attendanceData: AttendanceData = await attendanceRes.json();

        const assignedMembers = seatData
          .filter((assignment) => assignment?.memberId?.part === part)
          .map((assignment) => {
            const record = attendanceData.records.find(
              (r) => r.memberId === assignment.memberId._id
            );
            return {
              ...assignment.memberId,
              attendanceStatus: record?.status || "출석",
            };
          });

        setMembers(assignedMembers);
      } catch (error) {
        console.error("자리배치 또는 출석 데이터 불러오기 실패", error);
      }
    };

    // 초기 1회 실행
    fetchData();

    // 5초마다 새로고침
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval); // 언마운트 시 인터벌 제거
  }, [selectedSeason?._id, selectedDate, part]);

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

const SeatCell: React.FC<{
  member?: MemberType & { attendanceStatus?: string };
}> = ({ member }) => {
  const status = member?.attendanceStatus;

  let bgColor = "#FAF9F6";
  let border = "1px solid #DDD5CC";
  let color = "#3e3232";

  if (status === "출석") {
    bgColor = "#F3F9F1"; // 부드러운 민트
    border = "1.5px solid #BCD9B9";
    color = "#3B5742";
  }

  if (status === "지각") {
    bgColor = "#FFF7ED"; // 연한 크림
    border = "1.5px dotted #E6AA64";
    color = "#8B5E2F";
  }

  if (status === "불참") {
    bgColor = "#F3F3F3"; // 연회색
    border = "1.5px dashed #C2C2C2";
    color = "#999999";
  }

  return (
    <div
      className="w-12 h-12 rounded-lg shadow-sm flex items-center justify-center text-sm text-center"
      style={{
        backgroundColor: bgColor,
        border,
        color,
        lineHeight: "1.1",
        padding: "2px",
      }}
      title={status}
    >
      {member?.name ?? ""}
    </div>
  );
};

export default SectionChart;
