// app/(authenticated)/admin/members/page.tsx
"use client";

import { mockMembers } from "@/lib/mock/members";
import { useState } from "react";

export default function AdminMembersPage() {
  const [members] = useState(mockMembers);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-lg font-bold text-[#3E3232] mb-6">단원 관리</h1>

      <div className="flex justify-end mb-4">
        <button className="px-4 py-2 bg-[#3E3232] text-white text-sm rounded-md hover:bg-[#2e2626]">
          + 단원 추가
        </button>
      </div>

      <div className="border border-[#e4e0dc] rounded-xl overflow-x-auto">
        <table className="min-w-full text-sm text-center">
          <thead className="bg-[#f5f4f2] text-[#3E3232]">
            <tr>
              <th className="px-4 py-3 font-semibold">이름</th>
              <th className="px-4 py-3 font-semibold">파트</th>
              <th className="px-4 py-3 font-semibold">관리</th>
            </tr>
          </thead>
          <tbody className="bg-[#fdfcfa]">
            {members.map((member) => (
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
                  <button className="text-xs text-[#7E6363] hover:text-[#3E3232] mr-2">
                    수정
                  </button>
                  <button className="text-xs text-[#b14040] hover:underline">
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
