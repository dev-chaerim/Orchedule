'use client';

import React from 'react';
import { members, PartKey } from '@/src/lib/mock/members';

const orderedParts: PartKey[] = [
  'Vn1', 'Vn2', 'Va', 'Vc', 'Ba', 'Fl', 'Ob', 'Cl', 'Bs', 'Hr'
];

const partLabels: Record<PartKey, string> = {
  Vn1: '1st Violin',
  Vn2: '2nd Violin',
  Va:  'Viola',
  Vc:  'Cello',
  Ba:  'Base',
  Fl:  'Flute',
  Ob:  'Oboe',
  Cl:  'Clarinet',
  Bs:  'Bassoon',
  Hr:  'Horn',
  Perc: 'Perc'
};

const MemberListPage = () => {
  return (
    <div className="px-4 pb-24 bg-[#FAF9F6]">
      <h1 className="text-lg font-bold text-[#3E3232] mb-4 px-1">
        단원 명단
      </h1>

      <div className="space-y-6">
        {orderedParts.map((part) => {
          const partMembers = members.filter((m) => m.part === part);

          return (
            <div
              key={part}
              className="bg-white rounded-xl p-4 border border-[#ece7e2]"
            >
              <h2 className="text-md font-semibold text-[#5a4a42] mb-2">
                {partLabels[part]}
              </h2>

              {partMembers.length > 0 ? (
                <ul className="flex flex-wrap gap-2 text-sm text-[#3E3232]">
                  {partMembers.map((m) => (
                    <li
                      key={m.id}
                      className="px-2 py-1 bg-[#f3efea] rounded-full"
                    >
                      {m.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">
                  등록된 단원이 없습니다.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemberListPage;
