"use client";

import { useState } from "react";
import { parts } from "@/src/constants/parts";
import ConfirmModal from "../modals/ConfirmModal";
import { useToastStore } from "@/lib/store/toast";

interface Member {
  _id: string;
  name: string;
  part: string;
}

interface MemberListTableProps {
  members: Member[];
  onUpdate: (
    id: string,
    updatedData: { name: string; part: string }
  ) => Promise<void>;
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
  const [savingMemberId, setSavingMemberId] = useState<string | null>(null); // ✅ 추가

  const showToast = useToastStore((state) => state.showToast);

  const startEdit = (member: Member) => {
    setEditingMemberId(member._id);
    setEditForm({ name: member.name, part: member.part });
  };

  const saveEdit = async (id: string) => {
    const original = members.find((m) => m._id === id);
    if (!original) return;

    if (original.part !== editForm.part) {
      showToast({
        message: "파트가 변경되면 좌석 배정이 초기화됩니다.",
        type: "error",
      });

      // ✅ 다음 토스트를 띄우기 전에 잠깐 대기
      await new Promise((res) => setTimeout(res, 1500));
    }

    setSavingMemberId(id); // ✅ 저장 중 시작
    await onUpdate(id, editForm);
    setSavingMemberId(null); // ✅ 저장 완료
    setEditingMemberId(null); // ✅ 편집 종료
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
          {members.map((member, index) => {
            const isEditing = editingMemberId === member._id;
            const isSaving = savingMemberId === member._id;

            return (
              <tr
                key={`${member._id}-${index}`}
                className="border-t border-[#eceae7] hover:bg-[#f7f6f4] transition"
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
                        onClick={() => saveEdit(member._id)}
                        disabled={isSaving}
                        className={`text-xs ${
                          isSaving
                            ? "text-[#a79c90] cursor-not-allowed"
                            : "text-[#7E6363] hover:text-[#3E3232]"
                        }`}
                      >
                        {isSaving ? "저장 중..." : "저장"}
                      </button>
                      <button
                        onClick={() => setEditingMemberId(null)}
                        disabled={isSaving}
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
                        onClick={() => setDeleteTargetId(member._id)}
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

      <ConfirmModal
        open={!!deleteTargetId}
        message="정말 삭제하시겠습니까?"
        confirmLabel="삭제하기"
        cancelLabel="취소"
        confirmColor="red"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}
