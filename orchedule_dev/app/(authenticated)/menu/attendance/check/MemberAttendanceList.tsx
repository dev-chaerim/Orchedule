"use client";

import { useEffect, useState } from "react";
import { AttendanceStatus } from "@/src/lib/mock/attendance";
import { AttendanceRecord, AttendanceData } from "@/src/lib/types/attendance";
import { useSeasonStore } from "@/lib/store/season";
import { getNearestDate } from "@/src/lib/utils/getNearestDate";

interface Member {
  _id: string;
  name: string;
  part: string;
}

interface MemberAttendanceListProps {
  attendanceRecords: AttendanceRecord[];
  refreshTrigger: number;
  setAttendanceRecords: React.Dispatch<
    React.SetStateAction<AttendanceRecord[]>
  >;
}

const getStatusColor = (status: AttendanceStatus) => {
  switch (status) {
    case "출석":
      return "bg-[#e2d8ce] text-[#3e3232]";
    case "지각":
      return "bg-[#d3c9e7] text-[#453c5c]";
    case "불참":
      return "bg-[#f3c5c5] text-[#5c3c3c]";
    default:
      return "bg-gray-200 text-gray-600";
  }
};

const getPartBgColor = (part: string) => {
  switch (part) {
    case "Vn1":
      return "bg-[#C3C3C3]";
    case "Vn2":
      return "bg-[#BBB3AA]";
    case "Va":
      return "bg-[#C3C3C3]";
    default:
      return "bg-gray-200";
  }
};

export default function MemberAttendanceList({
  attendanceRecords,
  refreshTrigger,
  setAttendanceRecords,
}: MemberAttendanceListProps) {
  const { selectedSeason } = useSeasonStore();
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState("");

  useEffect(() => {
    const fetchDates = async () => {
      const res = await fetch("/api/schedules/dates");
      const data: string[] = await res.json();
      const nearest = getNearestDate(data);
      setDate(nearest);
    };
    fetchDates();
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
      const res = await fetch("/api/members");
      const data: Member[] = await res.json();
      setMembers(data);
      setIsLoading(false);
    };
    fetchMembers();
  }, []);

  useEffect(() => {
    if (!selectedSeason?._id || !date) return;

    const fetchAttendance = async () => {
      const res = await fetch(
        `/api/attendances?date=${date}&seasonId=${selectedSeason._id}`
      );
      const data: AttendanceData = await res.json();
      setAttendanceRecords(data.records);
    };

    fetchAttendance();

    const interval = setInterval(() => {
      fetchAttendance();
    }, 5000);

    return () => clearInterval(interval);
  }, [refreshTrigger, selectedSeason, date, setAttendanceRecords]);

  const absentOrLate = members.filter((m) => {
    const found = (attendanceRecords || []).find((r) => r.memberId === m._id);
    const status = found?.status ?? "출석";
    return status !== "출석";
  });

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[640px] p-4">
        <div className="text-sm font-semibold text-[#7e6a5c] mb-4">결원</div>

        {isLoading ? (
          <div className="text-center text-[#a79c90] text-sm py-6">
            ⏳ 결원 리스트를 불러오는 중이에요...
          </div>
        ) : (
          <div className="space-y-3">
            {absentOrLate.map((member) => {
              const found = (attendanceRecords || []).find(
                (r) => r.memberId === member._id
              );
              const status = found?.status ?? "출석";

              return (
                <div
                  key={member._id}
                  className="flex items-center justify-between bg-white shadow-sm rounded-xl overflow-hidden"
                >
                  <div
                    className={`px-3 py-2 text-sm font-semibold text-white min-w-[48px] text-center ${getPartBgColor(
                      member.part
                    )}`}
                  >
                    {member.part}
                  </div>
                  <div className="flex-1 text-sm text-[#3e3232] px-4">
                    {member.name}
                  </div>
                  <div
                    className={`px-3 py-1 text-xs font-semibold rounded-full mr-3 ${getStatusColor(
                      status
                    )}`}
                  >
                    {status}
                  </div>
                </div>
              );
            })}

            {absentOrLate.length === 0 && (
              <p className="mb-6 text-sm text-[#7e6a5c] text-center py-10 border border-[#e0dada] rounded-md">
                결석한 단원이 없습니다.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
