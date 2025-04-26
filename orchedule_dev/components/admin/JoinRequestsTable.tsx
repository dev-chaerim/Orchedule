"use client";

import { mockJoinRequests } from "@/src/lib/mock/joinRequest";
import { useState } from "react";

export default function JoinRequestsTable() {
  const [requests, setRequests] = useState(mockJoinRequests);
  const [toast, setToast] = useState<string | null>(null); // ✅ 토스트 상태 추가

  const handleApprove = (id: number) => {
    const approved = requests.find((r) => r.id === id);
    if (approved) {
      setToast(`${approved.name} 님이 승인되었습니다.`);
      setTimeout(() => setToast(null), 2000); // ✅ 2초 뒤에 토스트 사라짐
    }
    // 상태는 그대로 유지 (지금은 이동/변경 없음)
  };

  const handleReject = (id: number) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "거절됨" } : r))
    );
    const rejected = requests.find((r) => r.id === id);
    if (rejected) {
      setToast(`${rejected.name} 님이 거절되었습니다.`);
      setTimeout(() => setToast(null), 2000);
    }
  };

  return (
    <section className="mb-10 relative">
      <h2 className="text-base font-semibold text-[#3E3232] mb-3">가입 요청</h2>

      {/* ✅ 토스트 알림 */}
      {toast && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-2 px-4 py-2 bg-[#7E6363] text-white text-xs rounded-md shadow">
          {toast}
        </div>
      )}

      <div className="overflow-x-auto mt-6">
        <table className="w-full text-sm border border-[#e0dada] rounded-md overflow-hidden">
          <thead className="bg-[#f5f4f2]">
            <tr>
              <th className="px-4 py-2 text-left">이름</th>
              <th className="px-4 py-2 text-left">파트</th>
              <th className="px-4 py-2 text-left hidden md:table-cell">단체</th>
              <th className="px-4 py-2 text-left hidden md:table-cell">
                이메일
              </th>
              <th className="px-4 py-2 text-left">상태</th>
              <th className="px-4 py-2 text-left">조치</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {requests.map((r) => (
              <tr key={r.id} className="border-t border-[#f0eeeb]">
                <td className="px-4 py-2">{r.name}</td>
                <td className="px-4 py-2">{r.part}</td>
                <td className="px-4 py-2 hidden md:table-cell">{r.group}</td>
                <td className="px-4 py-2 hidden md:table-cell">{r.email}</td>
                <td className="px-4 py-2 font-medium text-[#7E6363]">
                  {r.status}
                </td>
                <td className="px-4 py-2 space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => handleApprove(r.id)}
                    className="px-3 py-1 text-xs rounded bg-[#C6DCBA] hover:bg-[#b7d1ac] text-[#3E3232]"
                  >
                    승인
                  </button>
                  <button
                    onClick={() => handleReject(r.id)}
                    className="px-3 py-1 text-xs rounded bg-[#f3c6c6] hover:bg-[#eaaaaa] text-[#3E3232]"
                  >
                    거절
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
