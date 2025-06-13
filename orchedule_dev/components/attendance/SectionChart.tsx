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
  selectedDate: string;
}

// partKey 확인 함수
const isPartKey = (key: string): key is keyof typeof partLabels => {
  return key in partLabels;
};

const SectionChart: React.FC<Props> = ({ part, selectedDate }) => {
  const { selectedSeason } = useSeasonStore();

  const [members, setMembers] = useState<MemberType[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState(true);

  // ✅ 1. 좌석 배치 멤버는 최초 한번만 고정 세팅
  useEffect(() => {
    const fetchMembers = async () => {
      if (!selectedSeason?._id) return;
      setIsLoading(true);

      try {
        const seatRes = await fetch(
          `/api/seat-assignments?seasonId=${selectedSeason._id}`
        );
        const seatData: SeatAssignment[] = await seatRes.json();

        const assignedMembers = seatData
          .filter((assignment) => assignment?.memberId?.part === part)
          .map((assignment) => assignment.memberId);

        setMembers(assignedMembers);
      } catch (error) {
        console.error("자리배치 데이터 불러오기 실패", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [selectedSeason?._id, part]);

  // ✅ 2. 출석 데이터는 별도 상태로 polling
  useEffect(() => {
    if (!selectedSeason?._id || !selectedDate) return;

    const fetchAttendance = async (showLoading = false) => {
      if (showLoading) setAttendanceLoading(true);

      try {
        const res = await fetch(
          `/api/attendances?seasonId=${selectedSeason._id}&date=${selectedDate}`
        );
        const data: AttendanceData = await res.json();

        setAttendanceRecords(data.records);
      } catch (error) {
        console.error("출석 데이터 불러오기 실패", error);
      } finally {
        if (showLoading) setAttendanceLoading(false);
      }
    };

    fetchAttendance(true);

    const interval = setInterval(() => {
      fetchAttendance(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedSeason?._id, selectedDate, part]);

  // ✅ 3. 렌더링 시 해당 member 의 출석 상태만 attendanceRecords 에서 찾아서 표시
  const getMemberStatus = (memberId: string): "출석" | "지각" | "불참" => {
    const found = attendanceRecords.find((r) => r.memberId === memberId);
    return found?.status ?? "출석";
  };

  const rows = Math.ceil(members.length / 2);

  return (
    <div className="w-full max-w-[640px] bg-white rounded-xl p-4 border border-[#ece7e2] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-[#3e3232]">
          {isPartKey(part) ? partLabels[part] : part}
        </h3>
      </div>

      {isLoading || attendanceLoading ? (
        <div className="text-center text-[#a79c90] text-sm py-6">
          ⏳ 정보를 불러오는 중이에요...
        </div>
      ) : (
        <div className="space-y-3">
          {Array.from({ length: rows }, (_, rowIdx) => {
            const left = members[rowIdx * 2];
            const right = members[rowIdx * 2 + 1];

            return (
              <div key={rowIdx} className="flex justify-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#7e6a5c]">{rowIdx + 1}</span>
                  <SeatCell
                    member={left}
                    status={left ? getMemberStatus(left._id) : undefined}
                  />
                  <SeatCell
                    member={right}
                    status={right ? getMemberStatus(right._id) : undefined}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const SeatCell: React.FC<{
  member?: MemberType;
  status?: "출석" | "지각" | "불참";
}> = ({ member, status }) => {
  let bgColor = "#FAF9F6";
  let border = "1px solid #DDD5CC";
  let color = "#3e3232";

  if (status === "출석") {
    bgColor = "#F3F9F1";
    border = "1.5px solid #BCD9B9";
    color = "#3B5742";
  }

  if (status === "지각") {
    bgColor = "#FFF7ED";
    border = "1.5px dotted #E6AA64";
    color = "#8B5E2F";
  }

  if (status === "불참") {
    bgColor = "#F3F3F3";
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
