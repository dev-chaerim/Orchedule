"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface Piece {
  time: string;
  title: string;
  note?: string;
}

interface Schedule {
  id: number;
  date: string;
  displayDate: string;
  pieces: Piece[];
}

export default function ScheduleCard({
  schedule,
  onDelete,
}: {
  schedule: Schedule;
  onDelete?: (id: number) => void;
}) {
  const router = useRouter();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 막기
    if (confirm("정말 삭제하시겠습니까?")) {
      onDelete?.(schedule.id);
    }
  };

  return (
    <div
      onClick={() => router.push(`/admin/schedule/${schedule.id}/edit`)}
      className="relative rounded-md p-4 border border-[#e0dada] bg-white shadow-sm hover:shadow transition cursor-pointer"
    >
      {/* 삭제 버튼 */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-100 text-[#7E6363] transition"
        aria-label="삭제"
      >
        <Trash2 size={16} />
      </button>

      <h3 className="text-sm font-semibold text-[#3E3232] mb-2">
        {schedule.displayDate} · {schedule.date}
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
  );
}
