// components/admin/MemberListTable.tsx

"use client";

interface Member {
  id: string;
  name: string;
  part: string;
}

export default function MemberListTable({ members }: { members: Member[] }) {
  return (
    <section>
      <table className="w-full text-sm border border-[#e0dada] rounded-md overflow-hidden">
        <thead className="bg-[#f5f4f2]">
          <tr>
            <th className="px-4 py-2 text-left">이름</th>
            <th className="px-4 py-2 text-left">파트</th>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">관리</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {members.map((m) => (
            <tr key={m.id} className="border-t border-[#f0eeeb]">
              <td className="px-4 py-2">{m.name}</td>
              <td className="px-4 py-2">{m.part}</td>
              <td className="px-4 py-2">{m.id}</td>
              <td className="px-4 py-2 space-x-2">
                <button className="text-xs text-[#7E6363] hover:text-[#3E3232]">
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
    </section>
  );
}
