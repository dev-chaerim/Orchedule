"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import ConfirmModal from "../modals/ConfirmModal"; // 경로는 실제 위치에 맞게 수정

interface Piece {
  time: string;
  title: string;
  note?: string;
}

interface Schedule {
  _id: string;
  date: string;
  pieces: Piece[];
}

export default function ScheduleCard({
  schedule,
  onDelete,
}: {
  schedule: Schedule;
  onDelete?: (id: string) => void;
}) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    onDelete?.(schedule._id);
    setShowConfirm(false);
  };

  return (
    <>
      <div
        onClick={() => router.push(`/admin/schedule/${schedule._id}/edit`)}
        className="relative rounded-md p-4 border border-[#e0dada] bg-white shadow-sm hover:shadow transition cursor-pointer"
      >
        {/* 삭제 버튼 */}
        <button
          onClick={handleDeleteClick}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-100 text-[#7E6363] transition"
          aria-label="삭제"
        >
          <Trash2 size={16} />
        </button>

        <h3 className="text-sm font-semibold text-[#3E3232] mb-2">
          {format(new Date(schedule.date), "MMM d")} · {schedule.date}
        </h3>

        <ul className="space-y-1">
          {schedule.pieces.map((piece, idx) => (
            <li key={idx} className="text-xs text-[#7E6363]">
              <span className="font-medium">{piece.time}</span> – {piece.title}
              {piece.note && (
                <span className="ml-1 text-gray-400 italic">{piece.note}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <ConfirmModal
        open={showConfirm}
        message="정말 삭제하시겠습니까?"
        confirmLabel="삭제하기"
        cancelLabel="취소"
        confirmColor="red"
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
