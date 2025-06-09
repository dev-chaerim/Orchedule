"use client";

import { useEffect, useState } from "react";
import { AttendanceStatus } from "@/src/lib/mock/attendance"; // 또는 실제 enum/type
import { useSeasonStore } from "@/lib/store/season";
import { getNearestDate } from "@/lib/utils/getNearestDate";

interface Member {
  _id: string;
  name: string;
  part: string;
}

interface AttendanceRecord {
  memberId: string;
  status: AttendanceStatus;
}

interface AttendanceData {
  date: string;
  records: AttendanceRecord[];
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

export default function MemberAttendanceList() {
  const { selectedSeason } = useSeasonStore();
  const [members, setMembers] = useState<Member[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<
    Map<string, AttendanceStatus>
  >(new Map());
  const [isLoading, setIsLoading] = useState(true); // ⭐️ 추가

  const [date, setDate] = useState(""); // 가장 가까운 연습일

  // ✅ 날짜 계산
  useEffect(() => {
    const fetchDates = async () => {
      const res = await fetch("/api/schedules/dates");
      const data: string[] = await res.json();
      const nearest = getNearestDate(data);
      setDate(nearest);
    };
    fetchDates();
  }, []);

  // ✅ 멤버 불러오기
  useEffect(() => {
    const fetchMembers = async () => {
      const res = await fetch("/api/members");
      const data: Member[] = await res.json();
      setMembers(data);
    };
    fetchMembers();
  }, []);

  // ✅ 출석 상태 불러오기
  useEffect(() => {
    if (!date || !selectedSeason?._id || members.length === 0) return;

    const fetchAttendance = async () => {
      setIsLoading(true); // ⭐️ 로딩 시작
      try {
        const res = await fetch(
          `/api/attendances?date=${date}&seasonId=${selectedSeason._id}`
        );
        const data: AttendanceData = await res.json();

        const map = new Map<string, AttendanceStatus>();
        members.forEach((m) => {
          const found = data.records?.find((r) => r.memberId === m._id);
          map.set(m._id, found?.status || "출석");
        });
        setAttendanceMap(map);
      } catch (err) {
        console.error("출석 데이터 불러오기 오류:", err);
      } finally {
        setIsLoading(false); // ⭐️ 로딩 끝
      }
    };

    fetchAttendance();
  }, [date, selectedSeason, members]);

  // ✅ 결원 (지각/불참만)
  const absentOrLate = members.filter((m) => {
    const status = attendanceMap.get(m._id) ?? "출석";
    return status !== "출석";
  });

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[640px] p-4">
        <div className="text-sm font-semibold text-[#7e6a5c] mb-4">결원</div>

        {isLoading ? ( // ⭐️ 로딩 표시
          <div className="text-center text-[#a79c90] text-sm py-6">
            ⏳ 결원 리스트를 불러오는 중이에요...
          </div>
        ) : (
          <div className="space-y-3">
            {absentOrLate.map((member) => {
              const status = attendanceMap.get(member._id)!;
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
              <div className="text-center text-sm text-gray-500">
                오늘 결원이 없습니다.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
