"use client";

import { useState } from "react";
import { mockMembers } from "@/lib/mock/members";
import { mockJoinRequests } from "@/lib/mock/joinRequest";
import JoinRequestsTable from "@/components/admin/JoinRequestsTable";
import MemberListTable from "@/components/admin/MemberListTable";
import AddMemberForm from "@/components/admin/AddMemberForm";
import { useToastStore } from "@/lib/store/toast";
import type { PartKey } from "@/lib/mock/members";

export default function AdminMembersPage() {
  const [members, setMembers] = useState(mockMembers);
  const [joinRequests, setJoinRequests] = useState(mockJoinRequests);
  const [showAddForm, setShowAddForm] = useState(false);
  const { showToast } = useToastStore();

  const handleAddMember = (newMember: {
    name: string;
    part: string;
    email?: string;
  }) => {
    const newId = `${newMember.part}-${String(members.length + 1).padStart(
      2,
      "0"
    )}`;
    const memberData = {
      id: newId,
      name: newMember.name,
      part: newMember.part as PartKey,
    };
    setMembers((prev) => [...prev, memberData]);
    setShowAddForm(false);
  };

  const handleApproveRequest = (id: number) => {
    const approvedRequest = joinRequests.find((r) => r.id === id);
    if (!approvedRequest) return;

    const newId = `${approvedRequest.part}-${String(
      members.length + 1
    ).padStart(2, "0")}`;
    const newMember = {
      id: newId,
      name: approvedRequest.name,
      part: approvedRequest.part as PartKey,
    };

    setMembers((prev) => [...prev, newMember]);
    setJoinRequests((prev) => prev.filter((r) => r.id !== id));

    showToast({ message: "승인 완료!", type: "success" });
  };

  const handleRejectRequest = (id: number) => {
    setJoinRequests((prev) => prev.filter((r) => r.id !== id));
    showToast({ message: "거절 처리되었습니다.", type: "error" });
  };

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

      {/* 단원 목록 테이블 */}
      <MemberListTable
        members={members}
        onUpdate={(id, updatedData) => {
          setMembers((prev) =>
            prev.map((m) =>
              m.id === id
                ? {
                    ...m,
                    name: updatedData.name,
                    part: updatedData.part as PartKey,
                  }
                : m
            )
          );
        }}
        onDelete={(id) => {
          setMembers((prev) => prev.filter((m) => m.id !== id));
        }}
      />
    </div>
  );
}
