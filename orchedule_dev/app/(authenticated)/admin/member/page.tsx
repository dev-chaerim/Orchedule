"use client";

import { useState } from "react";
import { mockMembers } from "@/lib/mock/members";
import JoinRequestsTable from "@/components/admin/JoinRequestsTable";
import MemberListTable from "@/components/admin/MemberListTable";
import AddMemberForm from "@/components/admin/AddMemberForm";
import type { PartKey } from "@/lib/mock/members";

export default function AdminMembersPage() {
  const [members, setMembers] = useState(mockMembers);
  const [showAddForm, setShowAddForm] = useState(false);

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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-lg font-bold text-[#3E3232] mb-6">단원 관리</h1>

      {/* 가입 요청 테이블 */}
      <JoinRequestsTable />

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
      <MemberListTable members={members} />
    </div>
  );
}
