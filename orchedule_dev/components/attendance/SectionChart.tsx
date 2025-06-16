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
  seatSide: "left" | "right";
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

  const [seatRows, setSeatRows] = useState<
    { seatNumber: number; left?: MemberType; right?: MemberType }[]
  >([]);
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState(true);

  // ✅ 1. 좌석 배치
  useEffect(() => {
    if (!selectedSeason?._id) return;
    setIsLoading(true);

    const fetchSeatAssignments = async () => {
      try {
        const res = await fetch(
          `/api/seat-assignments?seasonId=${selectedSeason._id}`
        );
        const seatData: SeatAssignment[] = await res.json();

        const partAssignments = seatData.filter(
          (a) => a.memberId?.part === part
        );

        // 좌석이 아예 없을 때는 안내 메시지
        if (partAssignments.length === 0) {
          setSeatRows([]);
          setIsLoading(false);
          return;
        }

        // 좌석 데이터 정리
        const seatMap: Record<
          number,
          { seatNumber: number; left?: MemberType; right?: MemberType }
        > = {};

        partAssignments.forEach((assignment) => {
          const { seatNumber, seatSide, memberId } = assignment;
          if (!seatMap[seatNumber]) {
            seatMap[seatNumber] = { seatNumber };
          }
          seatMap[seatNumber][seatSide] = memberId;
        });

        const maxSeat = Math.max(...partAssignments.map((a) => a.seatNumber));

        for (let i = 1; i <= maxSeat; i++) {
          if (!seatMap[i]) {
            seatMap[i] = { seatNumber: i };
          }
        }

        const sortedRows = Object.values(seatMap).sort(
          (a, b) => a.seatNumber - b.seatNumber
        );

        setSeatRows(sortedRows);
      } catch (error) {
        console.error("자리배치 데이터 불러오기 실패", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeatAssignments();
  }, [selectedSeason?._id, part]);

  // ✅ 2. 출석 데이터 polling
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

  // ✅ 3. 출석 상태 조회
  const getMemberStatus = (memberId: string): "출석" | "지각" | "불참" => {
    const found = attendanceRecords.find((r) => r.memberId === memberId);
    return found?.status ?? "출석";
  };

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
      ) : !seatRows.length ? (
        <p className="text-sm text-[#a79c90] text-center py-6">
          아직 이 파트의 자리 배치가 등록되지 않았어요.
        </p>
      ) : (
        <div className="space-y-3">
          {seatRows.map((row) => (
            <div key={row.seatNumber} className="flex justify-center">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#7e6a5c]">{row.seatNumber}</span>
                <SeatCell
                  member={row.left}
                  status={row.left ? getMemberStatus(row.left._id) : undefined}
                />
                <SeatCell
                  member={row.right}
                  status={
                    row.right ? getMemberStatus(row.right._id) : undefined
                  }
                />
              </div>
            </div>
          ))}
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
