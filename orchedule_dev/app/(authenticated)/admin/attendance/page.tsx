"use client";

import { todayAttendance } from "@/lib/mock/attendance";
import { mockMembers, PartKey } from "@/lib/mock/members";
import { useState } from "react";

export default function AttendanceDashboardPage() {
  const [attendance, setAttendance] = useState(() => {
    const map = new Map(
      todayAttendance.records.map((r) => [r.memberId, r.status])
    );
    return map;
  });

  const [selectedDate, setSelectedDate] = useState("2025-04-29");
  const [selectedPart, setSelectedPart] = useState<PartKey | "전체">("전체");

  const handleChange = (memberId: string, status: "출석" | "지각" | "불참") => {
    setAttendance((prev) => new Map(prev).set(memberId, status));
  };

  const counts = Array.from(attendance.values()).reduce(
    (acc, status) => {
      acc[status]++;
      return acc;
    },
    { 출석: 0, 지각: 0, 불참: 0 }
  );

  const hasNextSchedule = true;

  const filteredMembers =
    selectedPart === "전체"
      ? mockMembers
      : mockMembers.filter((m) => m.part === selectedPart);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-lg font-bold text-[#3E3232] mb-6">출석현황 관리</h1>

      {hasNextSchedule ? (
        <div className="mb-6 p-5 border border-[#dfd8d2] rounded-xl bg-white text-sm text-[#3E3232]">
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

      <div className="flex items-center gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <label className="text-[#7E6363] font-medium">출석 날짜:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-[#A5796E] focus:border-[#A5796E]"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[#7E6363] font-medium">파트:</label>
          <select
            value={selectedPart}
            onChange={(e) =>
              setSelectedPart(e.target.value as PartKey | "전체")
            }
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-[#A5796E] focus:border-[#A5796E]"
          >
            <option value="전체">전체</option>
            <option value="Vn1">Vn1</option>
            <option value="Vn2">Vn2</option>
            <option value="Va">Va</option>
            <option value="Vc">Vc</option>
            <option value="Ba">Ba</option>
            <option value="Fl">Fl</option>
            <option value="Ob">Ob</option>
            <option value="Cl">Cl</option>
            <option value="Bs">Bs</option>
            <option value="Hr">Hr</option>
            <option value="Perc">Perc</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border-2 border-[#d8d2c4] rounded-xl p-5 text-center">
          <div className="text-xs text-[#7E6363] mb-1 tracking-wide">출석</div>
          <div className="text-xl font-bold text-[#3E3232]">
            {counts.출석}명
          </div>
        </div>
        <div className="bg-white border-2 border-[#ccb997] rounded-xl p-5 text-center">
          <div className="text-xs text-[#7E6363] mb-1 tracking-wide">지각</div>
          <div className="text-xl font-bold text-[#a96d00]">
            {counts.지각}명
          </div>
        </div>
        <div className="bg-white border-2 border-[#e4b3b3] rounded-xl p-5 text-center">
          <div className="text-xs text-[#7E6363] mb-1 tracking-wide">불참</div>
          <div className="text-xl font-bold text-[#B00020]">
            {counts.불참}명
          </div>
        </div>
      </div>

      <div className="border border-[#e4e0dc] rounded-xl overflow-x-auto">
        <table className="min-w-full text-sm text-center">
          <thead className="bg-[#f5f4f2] text-[#3E3232]">
            <tr>
              <th className="px-4 py-3 font-semibold">이름</th>
              <th className="px-4 py-3 font-semibold">파트</th>
              <th className="px-4 py-3 font-semibold">출결 상태</th>
            </tr>
          </thead>
          <tbody className="bg-[#fdfcfa]">
            {filteredMembers.map((member) => (
              <tr
                key={member.id}
                className="border-t border-[#eceae7] last:border-0 hover:bg-[#f7f6f4] transition"
              >
                <td className="px-4 py-3 text-[#3E3232] whitespace-nowrap">
                  {member.name}
                </td>
                <td className="px-4 py-3 text-[#7E6363] whitespace-nowrap">
                  {member.part}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={attendance.get(member.id) || "출석"}
                    onChange={(e) =>
                      handleChange(
                        member.id,
                        e.target.value as "출석" | "지각" | "불참"
                      )
                    }
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-white focus:ring-2 focus:ring-[#A5796E] focus:border-[#A5796E]"
                  >
                    <option value="출석">출석</option>
                    <option value="지각">지각</option>
                    <option value="불참">불참</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
