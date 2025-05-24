"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSeasonStore } from "@/lib/store/season";
import { useUserStore } from "@/lib/store/user";
import MonthlyAttendanceChart from "@/components/attendance/MonthlyAttendanceChart";
import { format } from "date-fns";

interface MyAttendanceSummary {
  attended: number;
  absent: number;
  total: number;
  rate: number;
}

interface AttendanceLog {
  date: string;
  status: "출석" | "지각" | "불참";
}

export default function MyAttendancePage() {
  const [summary, setSummary] = useState<MyAttendanceSummary | null>(null);
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const selectedSeason = useSeasonStore((state) => state.selectedSeason);
  const seasonId = selectedSeason?._id;
  const { user } = useUserStore();

  const attended = summary?.attended ?? 0;
  const absent = summary?.absent ?? 0;
  const total = summary?.total ?? 0;
  const attendanceRate = summary?.rate ?? 0;

  useEffect(() => {
    if (!seasonId || !user) return;

    const fetchSummary = async () => {
      try {
        const res = await fetch(`/api/attendances/me?seasonId=${seasonId}`);
        if (!res.ok) throw new Error("출석 요약 불러오기 실패");
        const data = await res.json();
        setSummary(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchLogs = async () => {
      try {
        const res = await fetch(
          `/api/attendances/me/logs?seasonId=${seasonId}`
        );
        if (!res.ok) throw new Error("출결 로그 불러오기 실패");
        const data = await res.json();
        setLogs(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSummary();
    fetchLogs();
  }, [seasonId, user]);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[640px] px-4 py-3 space-y-8">
        {/* 유저 프로필 + 카운트 */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#f0f0f0] rounded-full overflow-hidden">
            <Image
              src="/icons/userIcon.svg"
              alt="user"
              width={48}
              height={48}
            />
          </div>
          <div className="flex-1 grid grid-cols-3 text-center bg-white rounded-xl shadow p-3">
            <div>
              <div className="text-sm text-[#7e6a5c]">출석</div>
              <div className="text-2xl font-bold text-[#2F76FF]">
                {attended}
              </div>
            </div>
            <div>
              <div className="text-sm text-[#7e6a5c]">결석</div>
              <div className="text-2xl font-bold text-[#3e3232b1]">
                {absent}
              </div>
            </div>
            <div>
              <div className="text-sm text-[#7e6a5c]">총 연습일</div>
              <div className="text-2xl font-bold text-[#3e3232dc]">{total}</div>
            </div>
          </div>
        </div>

        {/* 출석 통계 */}
        <div className="space-y-4">
          <div className="text-sm font-semibold text-[#7e6a5c]">출석 통계</div>
          <div className="flex gap-4">
            <div className="w-1/2 bg-white rounded-xl shadow p-6 grid place-items-center">
              <div>
                <div className="text-sm mb-2 text-[#7e6a5c] text-center">
                  출석률
                </div>
                <div className="relative w-20 h-20">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <circle
                      className="text-gray-200"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="transparent"
                      r="16"
                      cx="18"
                      cy="18"
                    />
                    <circle
                      className="text-[#a88f7d]"
                      strokeWidth="4"
                      strokeDasharray={`${attendanceRate}, 100`}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="16"
                      cx="18"
                      cy="18"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[#3e3232] font-bold text-base">
                    {attendanceRate}%
                  </div>
                </div>
              </div>
            </div>

            <div className="w-1/2 bg-white rounded-xl shadow p-6">
              {user && seasonId ? (
                attended === 0 ? (
                  <div className="text-[#bbb] text-sm text-center py-6 flex items-center justify-center h-full">
                    출석 기록이 없습니다
                  </div>
                ) : (
                  <MonthlyAttendanceChart
                    seasonId={seasonId}
                    userId={user.id}
                  />
                )
              ) : null}
            </div>
          </div>
        </div>

        {/* 이전 출결 */}
        <div>
          <div className="text-sm font-semibold text-[#7e6a5c] mb-3">
            이전 출결
          </div>
          <div className="bg-white rounded-xl shadow p-4 space-y-2 text-sm">
            {logs.length === 0 ? (
              <div className="text-[#bbb] text-sm text-center py-6">
                출결 기록이 없습니다
              </div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="flex justify-between text-[#3e3232]">
                  <span>{format(new Date(log.date), "yyyy년 M월 d일")}</span>
                  <span
                    className={
                      log.status === "출석"
                        ? "text-[#6a94ce]"
                        : log.status === "지각"
                        ? "text-[#d2a955]"
                        : "text-[#cc5c5c]"
                    }
                  >
                    {log.status}
                  </span>
                </div>
              ))
            )}
            <button className="mt-4 w-full bg-[#D7C0AE] text-white rounded-xl py-2 font-semibold hover:opacity-90 transition">
              전체 출결 확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
