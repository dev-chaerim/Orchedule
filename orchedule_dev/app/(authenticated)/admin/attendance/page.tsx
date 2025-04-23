"use client";

import SectionTabs from "@/components/SectionTabs";
import { todayAttendance } from "@/lib/mock/attendance";

const attendanceTabs = [
  { name: "출석부", href: "/admin/attendance/check" },
  { name: "출석현황", href: "/admin/attendance/status" },
];

export default function AttendanceDashboardPage() {
  const counts = todayAttendance.records.reduce(
    (acc, record) => {
      acc[record.status]++;
      return acc;
    },
    { 출석: 0, 지각: 0, 불참: 0 }
  );

  const hasNextSchedule = true; // 추후 실제 데이터로 대체

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <SectionTabs tabs={attendanceTabs} />

      {/* 다음 연습일 정보 또는 등록 유도 */}
      {hasNextSchedule ? (
        <div className="mb-6 mt-8 p-5 border border-[#e0dada] rounded-xl bg-[#fdfcfa] text-sm text-[#3E3232] shadow-sm">
          <div className="font-semibold text-base mb-2 flex items-center gap-2">
            <span className="text-[#2c2c2c]">🎼 다음 연습일</span>
          </div>
          <div className="text-sm font-medium">2025년 4월 29일 (화)</div>
          <ul className="list-disc list-inside text-xs mt-2 text-[#7E6363] space-y-0.5">
            <li>Mozart Symphony No.40 1st mov</li>
            <li>Beethoven 5번 3,4악장</li>
          </ul>
        </div>
      ) : (
        <div className="mb-6 p-5 border border-[#f2c7c7] rounded-xl bg-[#fff5f5] text-sm text-[#b14040]">
          <div className="mb-2 font-medium">등록된 다음 연습일이 없습니다.</div>
          <a
            href="/admin/schedule/new"
            className="inline-block px-4 py-2 bg-[#3E3232] text-white text-xs font-medium rounded-md hover:bg-[#2e2626]"
          >
            연습일정 등록하러 가기
          </a>
        </div>
      )}

      {/* 출결 부제목 */}
      <h2 className="text-sm font-semibold text-[#3E3232] mb-3 mx-1">출결</h2>

      {/* 출석 요약 (누르면 출석현황으로 이동) */}
      <div
        className="grid grid-cols-3 gap-4 mb-6 cursor-pointer"
        onClick={() => (window.location.href = "/admin/attendance/status")}
      >
        <div className="bg-white border-2 border-[#ded8d2] rounded-xl p-5 text-center hover:bg-[#f8f6f4] transition">
          <div className="text-xs text-[#7E6363] mb-1 tracking-wide">출석</div>
          <div className="text-xl font-bold text-[#3E3232]">
            {counts.출석}명
          </div>
        </div>
        <div className="bg-white border-2 border-[#d5c3a2] rounded-xl p-5 text-center hover:bg-[#f8f6f4] transition">
          <div className="text-xs text-[#7E6363] mb-1 tracking-wide">지각</div>
          <div className="text-xl font-bold text-[#a96d00]">
            {counts.지각}명
          </div>
        </div>
        <div className="bg-white border-2 border-[#e4a0a0] rounded-xl p-5 text-center hover:bg-[#f8f6f4] transition">
          <div className="text-xs text-[#7E6363] mb-1 tracking-wide">불참</div>
          <div className="text-xl font-bold text-[#B00020]">
            {counts.불참}명
          </div>
        </div>
      </div>
    </div>
  );
}
