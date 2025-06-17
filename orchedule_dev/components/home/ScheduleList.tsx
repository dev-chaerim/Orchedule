"use client";

import { useEffect, useState } from "react";
import { useSeasonStore } from "@/lib/store/season";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import MoreLink from "../MoreLink";
import LoadingSkeleton from "../common/LoadingSkeleton";
import { getNearestDate } from "@/lib/utils/getNearestDate";
import { Schedule } from "@/lib/types/schedule";
import ErrorMessage from "../common/ErrorMessage";

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

  if (error) return <ErrorMessage />;

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
            className="relative rounded-xl shadow-sm bg-white p-4 mb-4 pt-15  text-sm text-[#3E3232]"
          >
            <div className="absolute top-4 left-4 flex gap-2 items-center">
              <div className="bg-[#a08e8e] text-white text-xs font-semibold rounded-full px-3 py-1 leading-tight">
                {format(new Date(schedule.date), "MMM d", { locale: enUS })}
              </div>
              <div className="bg-[#e9e6e3] text-[#5c5048] text-xs font-medium rounded-full px-3 py-1 leading-tight">
                {format(new Date(schedule.date), "EEE", { locale: enUS })}
              </div>
              {schedule.isCancelled && (
                <div className="px-3 py-1 ml-0.5 rounded-full border border-[#f8e5e5] bg-[#f8e5e5] text-[#B00020] text-[11px] font-semibold  leading-tight">
                  휴강일
                </div>
              )}
            </div>

            {/* 특이사항 */}
            {schedule.specialNotices && schedule.specialNotices.length > 0 && (
              <div className="mb-5 mt-1">
                <p className="font-semibold flex items-center mb-1 text-sm">
                  <span className="mr-1 text-gray-400">📌</span> 특이사항
                </p>
                <ul className="space-y-1 ml-4">
                  {schedule.specialNotices.map((notice, i) => (
                    <li
                      key={i}
                      className={`whitespace-pre-line text-xs ${
                        notice.level === "important"
                          ? "text-[#b54949] font-semibold"
                          : notice.level === "warning"
                          ? "text-[#cc9900]"
                          : ""
                      }`}
                    >
                      {notice.content}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* 자리오디션 */}
            {schedule.auditionSessions &&
              schedule.auditionSessions.length > 0 && (
                <div className="mb-5">
                  <p className="font-semibold flex items-center mb-1 text-sm">
                    <span className="mr-1 text-gray-400">🪑</span> 자리오디션
                  </p>
                  <ul className="space-y-1 ml-4 text-sm">
                    {schedule.auditionSessions.map((s, i) => (
                      <li key={i}>
                        <p className="mb-1">
                          ▸{s.time}
                          {/* <span className="text-xs">{session.conductor}</span>{" "} */}
                          <span className="block sm:inline text-xs text-[#7e6a5c] ml-2">
                            #{s.conductor} #{s.location}
                          </span>
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* 파트레슨 */}
            {schedule.partSessions && schedule.partSessions.length > 0 && (
              <div className="mb-5">
                <p className="font-semibold flex items-center mb-1 text-sm">
                  <span className="mr-1 pb-1 text-gray-400">👥</span> 파트레슨
                </p>
                <ul className="space-y-1 ml-4 text-sm">
                  {schedule.partSessions.map((s, i) => (
                    <li key={i}>
                      <p className="mb-1">
                        ▸{s.time}
                        {/* <span className="text-xs">{session.conductor}</span>{" "} */}
                        <span className="block sm:inline text-xs text-[#7e6a5c] ml-2">
                          #{s.conductor} #{s.location}
                        </span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 오케스트라 */}
            {schedule.orchestraSessions &&
              schedule.orchestraSessions.length > 0 && (
                <div className="mb-2">
                  <p className="font-semibold flex items-center mb-1 text-[#3E3232]">
                    <span className="mr-1 text-gray-400 text-sm">🎼</span>
                    오케스트라
                  </p>

                  {schedule.orchestraSessions.map((session, i) => (
                    <div key={i} className="ml-4 mb-3 text-sm">
                      <p className="mb-1">
                        ▸{session.time}
                        {/* <span className="text-xs">{session.conductor}</span>{" "} */}
                        <span className="block sm:inline text-xs text-[#7e6a5c] ml-2">
                          #{session.conductor} #{session.location}
                        </span>
                      </p>
                      <ul className="space-y-2">
                        {session.pieces.map((piece, idx) => (
                          <li key={idx}>
                            <p className="italic text-xs">
                              - {piece.title}
                              {piece.movements &&
                                piece.movements?.length > 0 && (
                                  <span className="block sm:inline  ml-1 text-[#b36b5e] font-semibold">
                                    ({piece.movements.join(", ")})
                                  </span>
                                )}
                            </p>
                            {piece.note && (
                              <p className="text-xs text-[#7e6a5c] italic mt-0.5 ml-4 leading-snug">
                                {piece.note}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
          </div>
        ))
      )}
    </section>
  );
}
