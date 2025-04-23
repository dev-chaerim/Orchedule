"use client";

import { useRouter } from "next/navigation";

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

export default function ScheduleCard({ schedule }: { schedule: Schedule }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/admin/schedule/${schedule.id}/edit`)}
      className="rounded-md p-4 border border-[#e0dada] bg-white shadow-sm hover:shadow transition cursor-pointer"
    >
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
