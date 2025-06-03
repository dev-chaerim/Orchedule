"use client";

import React, { useState, useEffect, useCallback } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import ScheduleCard from "./ScheduleCard";
import { Schedule } from "@/lib/types/schedule";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const CalendarSelect = () => {
  const [calendarValue, setCalendarValue] = useState<Value>(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/schedules");
        if (!res.ok) throw new Error("서버 오류 발생");
        const data = await res.json();
        setSchedules(data);
      } catch (err) {
        console.log("err", err);
        setError("연습 일정을 불러오는 중 문제가 발생했어요 😢");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const formattedDate =
    calendarValue instanceof Date ? format(calendarValue, "yyyy-MM-dd") : "";

  const schedule = schedules.find((s) => s.date === formattedDate);

  const onChangeCalendar = useCallback((value: Value) => {
    setCalendarValue(value);
  }, []);

  return (
    <div className="w-full flex flex-col xl:flex-row items-start justify-center xl:gap-12 px-4 py-1 xl:py-12">
      {/* 📅 달력 */}
      <div className="w-full xl:w-[500px] flex justify-center mb-6 xl:mb-0">
        <div className="w-full max-w-[500px]">
          <Calendar
            onChange={onChangeCalendar}
            value={calendarValue}
            locale="ko-KR"
            calendarType="gregory"
            formatDay={(locale, date) =>
              date.toLocaleString("en", { day: "numeric" })
            }
            className="w-full rounded-xl shadow-sm border border-[#ece7e2] p-4"
            tileContent={({ date, view }) => {
              if (view === "month") {
                const formatted = format(date, "yyyy-MM-dd");
                const hasSchedule = schedules.some((s) => s.date === formatted);

                const isSelected =
                  calendarValue instanceof Date
                    ? format(calendarValue, "yyyy-MM-dd") === formatted
                    : false;

                if (hasSchedule && !isSelected) {
                  return (
                    <div className="flex flex-col items-center justify-center mt-[-1px] ml-[1px]">
                      <div className="w-1 h-1 bg-[#fa5f5f] rounded-full mb-[1px]" />
                    </div>
                  );
                }

                return null;
              }
              return null;
            }}
          />
        </div>
      </div>

      {/* 🎻 연습 일정 or 로딩 or 에러 */}
      <div className="w-full xl:flex-1 flex justify-center">
        <div className="w-full max-w-[500px]">
          {loading ? (
            <div className="text-center text-[#a79c90] text-sm py-6">
              ⏳ 연습일정을 불러오는 중이에요...
            </div>
          ) : error ? (
            <div className="text-center text-red-500 text-sm py-6">{error}</div>
          ) : schedule ? (
            <div className="space-y-6">
              <p className="text-base font-semibold text-[#3E3232]">
                📅 {schedule.date} 연습일정
              </p>

              {/* 특이사항 */}
              {schedule.specialNotices &&
                schedule.specialNotices?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-[#3E3232] mb-1">
                      📌 특이사항
                    </h3>
                    <ul className="space-y-1 ml-2 text-sm ">
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
              {schedule.partSessions && schedule.partSessions?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-[#3E3232] mb-1">
                    👥 파트레슨
                  </h3>
                  <div className="space-y-2">
                    {schedule.partSessions.map((s, i) => (
                      <ScheduleCard
                        key={i}
                        time={s.time}
                        description={
                          `${s.title} #${s.location}` +
                          (s.conductor ? ` #${s.conductor}` : "")
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 오케스트라 */}
              {schedule.orchestraSession && (
                <div>
                  <h3 className="font-semibold text-[#3E3232] mb-1">
                    🎼 오케스트라
                  </h3>
                  <ScheduleCard
                    time={schedule.orchestraSession.time}
                    description={`${schedule.orchestraSession.conductor} #${schedule.orchestraSession.location}`}
                    pieces={schedule.orchestraSession.pieces}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#fdfbf9] border border-[#e8e0d9] rounded-xl p-6 text-center w-full">
              <p className="text-sm text-[#7e6a5c] font-semibold">
                아직 등록된 연습 일정이 없어요.
              </p>
              <p className="text-xs text-[#a79c90] mt-1">
                다른 날짜를 눌러 확인해보세요!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarSelect;
