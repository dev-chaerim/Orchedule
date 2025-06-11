// components/common/ActionButtons.tsx
"use client";

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;
}

export default function ActionButtons({
  onEdit,
  onDelete,
  editLabel = "수정",
  deleteLabel = "삭제",
}: ActionButtonsProps) {
  return (
    <div className="flex gap-2 mb-3">
      <button
        onClick={onEdit}
        className="text-xs font-semibold cursor-pointer bg-[#ffffff] text-[#7E6363] border border-[#E0DADA] px-3 py-1 rounded-md hover:bg-[#F4ECE7] transition"
      >
        {editLabel}
      </button>
      <button
        onClick={onDelete}
        className="text-xs font-semibold cursor-pointer bg-[#ffffff] text-[#A04B4B] border border-[#E5BFBF] px-3 py-1 rounded-md hover:bg-[#F6DADA] transition"
      >
        {deleteLabel}
      </button>
    </div>
  );
}
