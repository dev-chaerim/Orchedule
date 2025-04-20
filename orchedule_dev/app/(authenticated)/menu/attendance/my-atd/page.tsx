'use client';

import Image from 'next/image';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts';
import { useMemo } from 'react';

const previousLogs = [
  { date: 'Apr 20', status: '결석' },
  { date: 'Apr 27', status: '결석' },
  { date: 'May 5', status: '출석' },
];

const chartData = [
  { month: '1월', value: 2 },
  { month: '2월', value: 3 },
  { month: '3월', value: 4 },
  { month: '4월', value: 2 },
  { month: '5월', value: 5 },
];

export default function MyAttendancePage() {
  const attended = 17;
  const absent = 3;
  const total = attended + absent;
  const attendanceRate = useMemo(() => Math.round((attended / total) * 100), [attended, total]);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[640px] px-4 py-3 space-y-8">
        {/* 유저 프로필 + 카운트 */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#f0f0f0] rounded-full overflow-hidden">
            <Image src="/icons/userIcon.svg" alt="user" width={48} height={48} />
          </div>
          <div className="flex-1 grid grid-cols-3 text-center bg-white rounded-xl shadow p-3">
            <div>
              <div className="text-sm text-[#7e6a5c]">출석</div>
              <div className="text-2xl font-bold text-[#2F76FF]">{attended}</div>
            </div>
            <div>
              <div className="text-sm text-[#7e6a5c]">결석</div>
              <div className="text-2xl font-bold text-[#3e3232b1]">{absent}</div>
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
            <div className="w-1/2 flex flex-col items-center justify-center bg-white rounded-xl shadow p-6">
              <div className="text-sm mb-2 text-[#7e6a5c]">출석률</div>
              <div className="relative w-20 h-20">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
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
            <div className="w-1/2 bg-white rounded-xl shadow p-4">
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={chartData} barCategoryGap={10} margin={{ top: 10, bottom: 30 }}>
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 14, fill: '#7e6a5c' }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                  />
                  <YAxis hide />
                  <Bar dataKey="value" fill="#a88f7d" radius={[4, 4, 0, 0]} barSize={18}>
                    <LabelList dataKey="value" position="top" fill="#3e3232" fontSize={12} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 이전 출결 */}
        <div>
          <div className="text-sm font-semibold text-[#7e6a5c] mb-3">이전 출결</div>
          <div className="bg-white rounded-xl shadow p-4 space-y-2 text-sm">
            {previousLogs.map((log, idx) => (
              <div key={idx} className="flex justify-between text-[#3e3232]">
                <span>{log.date}</span>
                <span className={log.status === '출석' ? 'text-[#6a94ce]' : ''}>{log.status}</span>
              </div>
            ))}
            <button className="mt-4 w-full bg-[#D7C0AE] text-white rounded-xl py-2 font-semibold hover:opacity-90 transition">
              전체 출결 확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
