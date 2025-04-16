'use client';

import React from 'react';

const memberData = {
  '1st Violin': ['정혜림', '허주희', '이시원', '최선재', '오주영', 'Eva', '김동수', '권민지', '강보경', '김민지', '최윤원', '유금화', '김수림', '김다비', '한지훈'],
  '2nd Violin': ['정혜림', '허주희', '이시원', '최선재', '오주영', 'Eva', '김동수', '권민지', '강보경', '김민지', '최윤원', '유금화', '김수림', '김다비', '한지훈'],
  Viola: ['유효림', '김정호', '김준용'],
  Cello: [],
  Base: [],
  Flute: [],
  Oboe: [],
  Clarinet: [],
  Bassoon: [],
  Horn: [],
};

const MemberListPage = () => {
  return (
    <div className="px-4 pb-24 bg-[#FAF9F6] min-h-screen">
      <h1 className="text-lg font-bold text-[#3E3232] mb-4 px-1">단원 명단</h1>

      <div className="space-y-6">
        {Object.entries(memberData).map(([part, members]) => (
          <div key={part} className="bg-white rounded-xl p-4 border border-[#ece7e2]">
            <h2 className="text-md font-semibold text-[#5a4a42] mb-2">{part}</h2>
            {members.length > 0 ? (
              <ul className="flex flex-wrap gap-2 text-sm text-[#3E3232]">
                {members.map((name, idx) => (
                  <li key={idx} className="px-2 py-1 bg-[#f3efea] rounded-full">
                    {name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">등록된 단원이 없습니다.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberListPage;
