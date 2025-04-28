"use client";

import { useState } from "react";
import type { Member } from "@/lib/mock/members";
import { parts } from "@/src/constants/parts";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";

interface MemberListTableProps {
  members: Member[];
  onUpdate: (id: string, updatedData: { name: string; part: string }) => void;
  onDelete: (id: string) => void;
}

export default function MemberListTable({
  members,
  onUpdate,
  onDelete,
}: MemberListTableProps) {
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; part: string }>({
    name: "",
    part: "",
  });
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const startEdit = (member: Member) => {
    setEditingMemberId(member.id);
    setEditForm({ name: member.name, part: member.part });
  };

  const cancelEdit = () => {
    setEditingMemberId(null);
    setEditForm({ name: "", part: "" });
  };

  const saveEdit = (id: string) => {
    onUpdate(id, editForm);
    setEditingMemberId(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      onDelete(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteTargetId(null);
  };

  return (
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
          {members.map((member) => {
            const isEditing = editingMemberId === member.id;
            return (
              <tr
                key={member.id}
                className="border-t border-[#eceae7] last:border-0 hover:bg-[#f7f6f4] transition"
              >
                <td className="px-4 py-3 text-[#3E3232] whitespace-nowrap">
                  {isEditing ? (
                    <input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-28"
                    />
                  ) : (
                    member.name
                  )}
                </td>
                <td className="px-4 py-3 text-[#7E6363] whitespace-nowrap">
                  {isEditing ? (
                    <select
                      value={editForm.part}
                      onChange={(e) =>
                        setEditForm({ ...editForm, part: e.target.value })
                      }
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      {parts.map((p) => (
                        <option key={p.key} value={p.key}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    member.part
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap space-x-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => saveEdit(member.id)}
                        className="text-xs text-[#7E6363] hover:text-[#3E3232]"
                      >
                        저장
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-xs text-[#b14040] hover:underline"
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(member)}
                        className="text-xs text-[#7E6363] hover:text-[#3E3232]"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(member.id)}
                        className="text-xs text-[#b14040] hover:underline"
                      >
                        삭제
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ✅ 삭제 모달 */}
      <DeleteConfirmModal
        open={!!deleteTargetId}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}
