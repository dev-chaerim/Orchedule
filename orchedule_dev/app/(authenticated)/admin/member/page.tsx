"use client";

import { useState, useEffect } from "react";
import JoinRequestsTable from "@/components/admin/JoinRequestsTable";
import MemberListTable from "@/components/admin/MemberListTable";
import AddMemberForm from "@/components/admin/AddMemberForm";
import { useToastStore } from "@/lib/store/toast";

interface Member {
  _id: string;
  name: string;
  part: string;
}

interface JoinRequest {
  _id: string;
  name: string;
  part: string;
  email: string;
  status: string;
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ✅ 로딩 상태 추가
  const showToast = useToastStore((state) => state.showToast);

  // ✅ 단원 목록 불러오기
  const fetchMembers = async () => {
    setIsLoading(true); // ✅ 로딩 시작
    try {
      const res = await fetch("/api/members");
      if (!res.ok) throw new Error("단원 목록 불러오기 실패");
      const data = await res.json();
      setMembers(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("단원 목록 불러오기 오류:", error.message);
        showToast({ message: error.message, type: "error" });
      } else {
        console.error("단원 목록 불러오기 오류:", error);
        showToast({ message: "단원 목록 불러오기 실패", type: "error" });
      }
    } finally {
      setIsLoading(false); // ✅ 로딩 종료
    }
  };

  // ✅ 가입 요청 목록 불러오기
  const fetchJoinRequests = async () => {
    try {
      const res = await fetch("/api/join-requests");
      if (!res.ok) throw new Error("가입 요청 목록 불러오기 실패");
      const data = await res.json();
      const processedData = data.map((req: JoinRequest) => ({
        ...req,
        status: req.status || "pending",
      }));
      setJoinRequests(processedData);
    } catch (error) {
      console.error("가입 요청 목록 불러오기 오류:", error);
      showToast({ message: "가입 요청 목록 불러오기 실패", type: "error" });
    }
  };

  const handleAddMember = async (newMember: { name: string; part: string }) => {
    try {
      const guestEmail = `guest_${Date.now()}@orchestra.com`;
      const guestPassword = "temporary1234";
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newMember,
          email: guestEmail,
          password: guestPassword,
        }),
      });
      if (!res.ok) throw new Error("단원 추가 실패");
      await fetchMembers();
      setShowAddForm(false);
      showToast({ message: "단원이 추가되었습니다.", type: "success" });
    } catch (error) {
      console.error("단원 추가 오류:", error);
      showToast({ message: "단원 추가 실패", type: "error" });
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      const res = await fetch(`/api/members/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("단원 삭제 실패");
      await fetchMembers();
      showToast({ message: "단원이 삭제되었습니다.", type: "success" });
    } catch (error) {
      console.error("단원 삭제 오류:", error);
      showToast({ message: "단원 삭제 실패", type: "error" });
    }
  };

  const handleApproveRequest = async (id: string) => {
    try {
      const res = await fetch(`/api/join-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });

      if (!res.ok) throw new Error("가입 요청 승인 실패");

      const approvedMember = await res.json();
      console.log("✅ 승인된 단원 데이터:", approvedMember);

      setMembers((prev) => [
        ...prev,
        {
          _id: approvedMember._id,
          name: approvedMember.name,
          part: approvedMember.part,
          email: approvedMember.email,
        },
      ]);

      setJoinRequests((prev) => prev.filter((req) => req._id !== id));

      showToast({ message: "가입 요청이 승인되었습니다.", type: "success" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("가입 요청 승인 오류:", error.message);
        showToast({ message: error.message, type: "error" });
      } else {
        console.error("가입 요청 승인 오류:", error);
        showToast({ message: "가입 요청 승인 실패", type: "error" });
      }
    }
  };

  const handleRejectRequest = async (id: string) => {
    try {
      const res = await fetch(`/api/join-requests/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("가입 요청 거절 실패");
      await fetchJoinRequests();
      showToast({ message: "가입 요청이 거절되었습니다.", type: "error" });
    } catch (error) {
      console.error("가입 요청 거절 오류:", error);
      showToast({ message: "가입 요청 거절 실패", type: "error" });
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchJoinRequests();
  }, []);

  return (
    <div className="relative p-6 max-w-5xl mx-auto">
      <h1 className="text-lg font-bold text-[#3E3232] mb-6">단원 관리</h1>

      {/* 가입 요청 테이블 */}
      <JoinRequestsTable
        requests={joinRequests}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
      />

      {/* 현재 단원 제목 */}
      <div className="flex justify-between items-center mt-10 mb-3">
        <h2 className="text-base font-semibold text-[#3E3232]">현재 단원</h2>
        <button
          onClick={() => setShowAddForm((prev) => !prev)}
          className="px-4 py-2 bg-[#7E6363] text-white text-sm rounded-md hover:bg-[#5c4f4f] transition"
        >
          {showAddForm ? "닫기" : "+ 단원 추가"}
        </button>
      </div>

      {/* 단원 추가 폼 */}
      {showAddForm && (
        <div className="mb-6 p-5 border border-[#e0dada] bg-white rounded-xl">
          <AddMemberForm onAdd={handleAddMember} />
        </div>
      )}

      {/* 로딩 중 표시 */}
      {isLoading ? (
        <div className="text-center text-[#a79c90] text-sm py-6">
          ⏳ 단원 목록을 불러오는 중이에요...
        </div>
      ) : (
        /* 단원 목록 테이블 */
        <MemberListTable
          members={members}
          onUpdate={(id, updatedData) => {
            setMembers((prev) =>
              prev.map((m) =>
                m._id === id
                  ? { ...m, name: updatedData.name, part: updatedData.part }
                  : m
              )
            );
          }}
          onDelete={handleDeleteMember}
        />
      )}
    </div>
  );
}
