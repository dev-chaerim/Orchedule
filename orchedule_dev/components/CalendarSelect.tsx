'use client';

import React, { useState, useCallback } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import { mockSchedules } from '@/lib/mock/schedule';
import ScheduleCard from './ScheduleCard';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const CalendarSelect = () => {
  const [calendarValue, setCalendarValue] = useState<Value>(new Date());

  const formattedDate =
    calendarValue instanceof Date ? format(calendarValue, 'yyyy-MM-dd') : '';

  const schedule = mockSchedules.find((s) => s.date === formattedDate);

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
          formatDay={(locale, date) => date.toLocaleString('en', { day: 'numeric' })}
          className="w-full rounded-xl shadow-sm border border-[#ece7e2] p-4"
        />
      </div>
    </div>
  
    {/* 🎻 연습 일정 */}
    <div className="w-full xl:flex-1 flex justify-center">
      <div className="w-full max-w-[500px]">
        {schedule ? (
          <div>
            <p className="text-base font-semibold text-[#3E3232] mb-4">
              📅 {schedule.displayDate} 연습곡
            </p>
            <div className="space-y-2">
              {schedule.pieces.map(({ time, title, note }, idx) => (
                <ScheduleCard
                  key={idx}
                  time={time}
                  description={`${title}${note ? ` ${note}` : ''}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-[#fdfbf9] border border-[#e8e0d9] rounded-xl p-6 text-center w-full">
            <p className="text-sm text-[#7e6a5c] font-semibold">
              이 날에는 연습 일정이 없습니다.
            </p>
            <p className="text-xs text-[#a79c90] mt-1">
              다음 일정을 확인해보세요!
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
  
  
  );
};

export default CalendarSelect;
