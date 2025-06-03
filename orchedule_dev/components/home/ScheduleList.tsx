"use client";

import { useEffect, useState } from "react";
import { useSeasonStore } from "@/lib/store/season";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import MoreLink from "../MoreLink";
import LoadingSkeleton from "../common/LoadingSkeleton";
import { getNearestDate } from "@/lib/utils/getNearestDate";
import { Schedule } from "@/lib/types/schedule";

export default function ScheduleList() {
  const selectedSeason = useSeasonStore((state) => state.selectedSeason);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!selectedSeason) return;
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/schedules?seasonId=${selectedSeason._id}`
        );
        if (!res.ok) throw new Error("Failed to fetch schedules");

        const data: Schedule[] = await res.json();
        if (data.length === 0) {
          setFilteredSchedules([]);
          return;
        }

        const allDates = data.map((s) => s.date);
        const nearestDate = getNearestDate(allDates);
        const filtered = data.filter((s) => s.date === nearestDate);
        setFilteredSchedules(filtered);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [selectedSeason?._id]);

  if (error)
    return (
      <p className="px-4 text-sm text-red-500">
        일정을 불러오는 데 실패했습니다.
      </p>
    );

  return (
    <section className="px-4 py-2">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-semibold">연습 일정</h2>
        <MoreLink href="/menu/notice/schedule" />
      </div>

      {loading ? (
        <div className="mt-3">
          <LoadingSkeleton lines={4} />
        </div>
      ) : filteredSchedules.length === 0 ? (
        <p className="text-sm text-[#7e6a5c] text-center py-10 border border-dashed border-[#e0dada] rounded-md bg-white">
          등록된 연습 일정이 없습니다.
        </p>
      ) : (
        filteredSchedules.map((schedule) => (
          <div
            key={schedule._id}
            className="relative rounded-xl shadow-sm bg-white p-5 mb-4 pt-15  text-sm text-[#3E3232]"
          >
            <div className="absolute top-4 left-4 flex gap-2 items-center">
              {/* 날짜 태그 */}
              <div className="bg-[#a08e8e] text-white text-xs font-semibold rounded-full px-3 py-1 leading-tight">
                {format(new Date(schedule.date), "MMM d", { locale: enUS })}
              </div>

              {/* 요일 태그 */}
              <div className="bg-[#e9e6e3] text-[#5c5048] text-xs font-medium rounded-full px-3 py-1 leading-tight">
                {format(new Date(schedule.date), "EEE", { locale: enUS })}
              </div>
            </div>

            {/* <div className="border-t border-dashed border-[#D5CAC3] mt-1 mb-3" /> */}

            {/* 특이사항 */}
            {schedule.specialNotices && schedule.specialNotices.length > 0 && (
              <div className="mb-5">
                <p className="font-semibold flex items-center mb-1 text-[#3E3232]">
                  <span className="mr-1 text-gray-400 text-sm">📌</span>
                  특이사항
                </p>
                <ul className="space-y-1 ml-4">
                  {schedule.specialNotices.map((notice, i) => (
                    <li
                      key={i}
                      className={
                        notice.level === "important"
                          ? "text-[#b54949] font-semibold"
                          : notice.level === "warning"
                          ? "text-[#cc9900]"
                          : "text-[#3E3232]"
                      }
                    >
                      {notice.content}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 파트레슨 */}
            {schedule.partSessions && schedule.partSessions.length > 0 && (
              <div className="mb-5">
                <p className="font-semibold flex items-center mb-1 text-[#3E3232]">
                  <span className="mr-2 text-gray-400 text-sm">👥</span>
                  파트레슨
                </p>
                <ul className="space-y-1 ml-4">
                  {schedule.partSessions.map((s, i) => (
                    <li key={i}>
                      <span className="text-[#3E3232]">
                        {s.time} – {s.title}
                      </span>{" "}
                      <span className="text-[#7e6a5c]">#{s.location}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 오케스트라 */}
            {schedule.orchestraSession && (
              <div className="mb-2">
                <p className="font-semibold flex items-center mb-1 text-[#3E3232]">
                  <span className="mr-1 text-gray-400 text-sm">🎼</span>
                  오케스트라
                </p>
                <div className="ml-4">
                  <p className="mb-1">
                    {schedule.orchestraSession.time} –{" "}
                    <span className="text-[#3E3232] font-medium">
                      {schedule.orchestraSession.conductor}
                    </span>{" "}
                    <span className="text-[#7e6a5c]">
                      #{schedule.orchestraSession.location}
                    </span>
                  </p>
                  <ul className="space-y-2">
                    {schedule.orchestraSession.pieces.map((piece, idx) => (
                      <li key={idx}>
                        <p className="italic">
                          ▸ {piece.title}
                          {piece.movements && piece.movements.length > 0 && (
                            <span className="ml-1 text-[#b36b5e] font-semibold">
                              ({piece.movements.join(", ")})
                            </span>
                          )}
                        </p>
                        {piece.note && (
                          <p className="text-xs text-[#7e6a5c] italic mt-0.5 ml-4">
                            {piece.note}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </section>
  );
}
