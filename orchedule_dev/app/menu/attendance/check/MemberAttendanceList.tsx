'use client';

const mockMembers = [
  { part: 'Vn1', name: '허주희', status: '지각' },
  { part: 'Vn2', name: '권채림', status: '불참' },
  { part: 'Va', name: '김정효', status: '불참' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case '출석':
      return 'bg-[#e2d8ce] text-[#3e3232]';
    case '지각':
      return 'bg-[#d3c9e7] text-[#453c5c]';
    case '불참':
      return 'bg-[#f3c5c5] text-[#5c3c3c]';
    default:
      return 'bg-gray-200 text-gray-600';
  }
};

const getPartBgColor = (part: string) => {
  switch (part) {
    case 'Vn1':
      return 'bg-[#C3C3C3]';
    case 'Vn2':
      return 'bg-[#BBB3AA]';
    case 'Va':
      return 'bg-[#C3C3C3]';
    default:
      return 'bg-gray-200';
  }
};

const MemberAttendanceList = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[640px] p-4">
        <div className="text-sm font-semibold text-[#7e6a5c] mb-4">결원</div>

        <div className="space-y-3">
          {mockMembers.map((member, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-white shadow-sm rounded-xl overflow-hidden"
            >
              {/* 파트 라벨 */}
              <div
                className={`px-3 py-2 text-sm font-semibold text-white min-w-[48px] text-center ${getPartBgColor(
                  member.part
                )}`}
              >
                {member.part}
              </div>

              {/* 이름 */}
              <div className="flex-1 text-sm text-[#3e3232] px-4">{member.name}</div>

              {/* 출석 상태 */}
              <div
                className={`px-3 py-1 text-xs font-semibold rounded-full mr-3 ${getStatusColor(
                  member.status
                )}`}
              >
                {member.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberAttendanceList;
