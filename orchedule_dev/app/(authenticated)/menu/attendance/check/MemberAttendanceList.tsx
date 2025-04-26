"use client";

import { mockMembers, PartKey } from "@/src/lib/mock/members";
import { todayAttendance, AttendanceStatus } from "@/src/lib/mock/attendance";

const getStatusColor = (status: AttendanceStatus) => {
  switch (status) {
    case "출석":
      return "bg-[#e2d8ce] text-[#3e3232]";
    case "지각":
      return "bg-[#d3c9e7] text-[#453c5c]";
    case "불참":
      return "bg-[#f3c5c5] text-[#5c3c3c]";
    default:
      return "bg-gray-200 text-gray-600";
  }
};

const getPartBgColor = (part: PartKey) => {
  switch (part) {
    case "Vn1":
      return "bg-[#C3C3C3]";
    case "Vn2":
      return "bg-[#BBB3AA]";
    case "Va":
      return "bg-[#C3C3C3]";
    // …다른 파트도 추가…
    default:
      return "bg-gray-200";
  }
};

const MemberAttendanceList = () => {
  // 오늘 출석 기록을 Map<memberId, status> 로 만듭니다.
  const statusMap = new Map<string, AttendanceStatus>(
    todayAttendance.records.map((r) => [r.memberId, r.status])
  );

  // 출석(기본)인 경우를 제외하고 지각/불참인 멤버만 추려냅니다.
  const absentOrLate = mockMembers.filter((member) => {
    const status = statusMap.get(member.id) ?? "출석";
    return status !== "출석";
  });

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[640px] p-4">
        <div className="text-sm font-semibold text-[#7e6a5c] mb-4">결원</div>

        <div className="space-y-3">
          {absentOrLate.map((member) => {
            const status = statusMap.get(member.id)!; // 필터로 인해 '출석'이 아닌 값만 남음

            return (
              <div
                key={member.id}
                className="flex items-center justify-between bg-white shadow-sm rounded-xl overflow-hidden"
              >
                {/* 파트 라벨 */}
                <div
                  className={`
                    px-3 py-2 text-sm font-semibold text-white 
                    min-w-[48px] text-center
                    ${getPartBgColor(member.part)}
                  `}
                >
                  {member.part}
                </div>

                {/* 이름 */}
                <div className="flex-1 text-sm text-[#3e3232] px-4">
                  {member.name}
                </div>

                {/* 출석 상태 */}
                <div
                  className={`
                    px-3 py-1 text-xs font-semibold rounded-full mr-3
                    ${getStatusColor(status)}
                  `}
                >
                  {status}
                </div>
              </div>
            );
          })}

          {absentOrLate.length === 0 && (
            <div className="text-center text-sm text-gray-500">
              오늘 결원이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberAttendanceList;
