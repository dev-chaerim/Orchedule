"use client";

// import { useState } from "react";
import { useToastStore } from "@/lib/store/toast";

interface Request {
  _id: string;
  name: string;
  part: string;
  email: string;
  status: string;
}

interface JoinRequestsTableProps {
  requests: Request[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function JoinRequestsTable({
  requests,
  onApprove,
  onReject,
}: JoinRequestsTableProps) {
  const { showToast } = useToastStore();

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/join-requests/${id}/approve`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("승인 실패");
      onApprove(id);
      showToast({ message: "가입 요청 승인 완료!", type: "success" });
    } catch (error) {
      console.error("가입 요청 승인 오류:", error);
      showToast({ message: "가입 요청 승인 실패", type: "error" });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`/api/join-requests/${id}/reject`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("거절 실패");
      onReject(id);
      showToast({ message: "가입 요청 거절 완료!", type: "success" });
    } catch (error) {
      console.error("가입 요청 거절 오류:", error);
      showToast({ message: "가입 요청 거절 실패", type: "error" });
    }
  };

  return (
    <section className="mb-10">
      <h2 className="text-base font-semibold text-[#3E3232] mb-3">가입 요청</h2>

      {requests.length === 0 ? (
        <div className="text-sm text-[#7E6363] p-4 border border-[#e0dada] rounded-md bg-[#fdfcfa] text-center">
          가입 요청이 없습니다.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-[#e0dada] rounded-md overflow-hidden">
            <thead className="bg-[#f5f4f2]">
              <tr>
                <th className="px-4 py-2 text-center">이름</th>
                <th className="px-4 py-2 text-center">파트</th>
                <th className="px-4 py-2 text-center hidden md:table-cell">
                  이메일
                </th>
                <th className="px-4 py-2 text-center">조치</th>
              </tr>
            </thead>
            <tbody className="bg-white text-center">
              {requests.map((r) => (
                <tr key={r._id} className="border-t border-[#f0eeeb]">
                  <td className="px-4 py-2">{r.name}</td>
                  <td className="px-4 py-2">{r.part}</td>
                  <td className="px-4 py-2 hidden md:table-cell">{r.email}</td>
                  <td className="px-4 py-2 space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleApprove(r._id)}
                      className="px-3 py-1 text-xs rounded bg-[#C6DCBA] hover:bg-[#b7d1ac] text-[#3E3232]"
                    >
                      승인
                    </button>
                    <button
                      onClick={() => handleReject(r._id)}
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
      )}
    </section>
  );
}
