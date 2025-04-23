"use client";

import { todayAttendance } from "@/lib/mock/attendance";
import { members } from "@/lib/mock/members";
import { useSeasonStore } from "@/lib/store/season";

export default function AttendanceStatusPage() {
  const selectedSeason = useSeasonStore((state) => state.selectedSeason);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* 상단 정보 */}
      <div className="mb-6">
        <div className="w-full px-4 py-2 border border-[#e0dada] rounded-lg bg-[#fcfaf9] text-xs text-[#3E3232] flex flex-col justify-center">
          <div className="font-medium text-[#7E6363]">현재 시즌</div>
          <div className="font-bold text-sm text-[#3E3232] mt-0.5">
            {selectedSeason?.name}
          </div>
        </div>
      </div>

      {/* 출석 현황 테이블 */}
      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#F9F7F6] text-[#3E3232] border-b">
            <tr>
              <th className="px-4 py-2">이름</th>
              <th className="px-4 py-2">파트</th>
              <th className="px-4 py-2">출석 상태</th>
            </tr>
          </thead>
          <tbody>
            {todayAttendance.records.map((record) => {
              const member = members.find((m) => m.id === record.memberId);
              return (
                <tr key={record.memberId} className="border-b last:border-0">
                  <td className="px-4 py-2">{member?.name ?? "-"}</td>
                  <td className="px-4 py-2">{member?.part ?? "-"}</td>
                  <td className="px-4 py-2 font-medium text-[#7E6363]">
                    {record.status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
