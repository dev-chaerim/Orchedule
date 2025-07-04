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
  tardy: number;
  notParticipated: number;
  notMarked: number;
  total: number;
  effectiveTotal: number;
  rate: number;
  joinedAt: string;
}

interface AttendanceLog {
  date: string;
  status: "출석" | "지각" | "불참";
}

export default function MyAttendancePage() {
  const [summary, setSummary] = useState<MyAttendanceSummary | null>(null);
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [nextDateText, setNextDateText] = useState("");

  const selectedSeason = useSeasonStore((state) => state.selectedSeason);
  const seasonId = selectedSeason?._id;
  const { user } = useUserStore();

  const attended = summary?.attended ?? 0;
  const absent = summary?.absent ?? 0;
  const total = summary?.total ?? 0;
  const attendanceRate = summary?.rate ?? 0;

  function getLastOpenDate(dates: string[]): string | null {
    const today = new Date();
    const pastDates = dates
      .filter((d) => new Date(d) <= today)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    return pastDates.length > 0 ? pastDates[0] : null;
  }

  useEffect(() => {
    const fetchLastDate = async () => {
      if (!seasonId) return;
      const res = await fetch(`/api/schedules/dates?seasonId=${seasonId}`);
      const dates: string[] = await res.json();
      const last = getLastOpenDate(dates);
      if (last) {
        const formatted = format(new Date(last), "yyyy년 M월 d일");
        setNextDateText(formatted);
      }
    };
    fetchLastDate();
  }, [seasonId]);

  useEffect(() => {
    if (!seasonId || !user) return;

    const fetchSummary = async () => {
      try {
        const res = await fetch(`/api/attendances/me?seasonId=${seasonId}`);
        if (!res.ok) throw new Error("출석 요약 불러오기 실패");
        const data = await res.json();
        console.log("출석요약", data);
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
        console.log("출석로그", data);
        setLogs(data);
      } catch (error) {
        console.error(error);
      }
    };

    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchSummary(), fetchLogs()]);
      setIsLoading(false);
    };

    loadData();
  }, [seasonId, user]);

  useEffect(() => {
    if (attended > 0) {
      setIsChartLoading(true);
      const timeout = setTimeout(() => {
        setIsChartLoading(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [attended, seasonId, user?.id]);

  const today = new Date();
  const filteredLogs = logs
    .filter((log) => new Date(log.date) < today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const visibleLogs = isExpanded ? filteredLogs : filteredLogs.slice(0, 3);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-10 text-[#a79c90] text-sm">
        ⏳ 출석 데이터를 불러오는 중이에요...
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[640px] py-1 -mt-3 space-y-8">
        <div className="flex items-center gap-4 pb-2">
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
              <div className="text-sm text-[#3E3232] font-semibold">출석</div>
              <div className="text-2xl font-bold text-[#2F76FF]">
                {attended}
              </div>
            </div>
            <div>
              <div className="text-sm text-[#3E3232]  font-semibold">지각</div>
              <div className="text-2xl font-bold text-[#C8B28E]">
                {summary?.tardy ?? 0}
              </div>
            </div>
            <div>
              <div className="text-sm text-[#3E3232] font-semibold">결석</div>
              <div className="text-2xl font-bold text-[#A9A9A9]">{absent}</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-sm font-semibold text-[#7e6a5c]">
            출석 통계
            {nextDateText && (
              <span className="text-xs text-[#a79c90] ml-2">
                ({nextDateText} 기준)
              </span>
            )}
          </div>
          <div className="flex gap-4">
            <div className="w-1/2 bg-white rounded-xl shadow p-6 grid place-items-center">
              <div>
                <div className="text-sm mb-2 text-[#7e6a5c] text-center">
                  출석률
                </div>
                <div className="relative w-full aspect-square max-w-[112px]">
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

            <div className="w-1/2 bg-white rounded-xl shadow p-6 flex items-center justify-center">
              {user && seasonId ? (
                attended === 0 ? (
                  <div className="text-[#bbb] text-sm text-center py-6 flex items-center justify-center h-full">
                    출석 기록이 없습니다
                  </div>
                ) : isChartLoading ? (
                  <div className="text-[#a79c90] text-sm">
                    ⏳불러오는 중이에요...
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

        <div className="bg-white rounded-xl shadow p-4 text-sm text-[#3e3232] space-y-2">
          {summary?.joinedAt && (
            <div className="flex justify-between">
              <span className="text-[#7e6a5c]">가입일</span>
              <span>
                {new Date(summary.joinedAt).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-[#7e6a5c]">시즌 전체 연습 횟수</span>
            <span>{total} 회</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7e6a5c]">가입 기준 연습 횟수</span>
            <span>{summary?.effectiveTotal ?? 0} 회</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7e6a5c]">제외된 연습 횟수</span>
            <span>{summary?.notParticipated ?? 0} 회</span>
          </div>
        </div>

        {/* 이전 출결 */}
        <div>
          <div className="text-sm font-semibold text-[#7e6a5c] mb-3">
            이전 출결
          </div>
          <div className="bg-white rounded-xl shadow p-4 space-y-2 text-sm">
            {filteredLogs.length === 0 ? (
              <div className="text-[#bbb] text-sm text-center py-6">
                출결 기록이 없습니다
              </div>
            ) : (
              <>
                {visibleLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-[#3e3232]"
                  >
                    <span>{format(new Date(log.date), "yyyy년 M월 d일")}</span>
                    <span
                      className={
                        log.status === "출석"
                          ? "text-[#6a94ce]"
                          : log.status === "지각"
                          ? "text-[#d2a955]"
                          : "text-[#777676]"
                      }
                    >
                      {log.status}
                    </span>
                  </div>
                ))}
                {filteredLogs.length > 3 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-4 w-full bg-[#D7C0AE] text-white rounded-xl py-2 font-semibold hover:opacity-90 transition"
                  >
                    {isExpanded ? "접기" : "전체 출결 확인"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
