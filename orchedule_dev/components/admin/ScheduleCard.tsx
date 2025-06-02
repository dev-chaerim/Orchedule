"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import ConfirmModal from "../modals/ConfirmModal";

// ✅ 타입은 무조건 동일한 경로로 import!
import type { Schedule } from "@/src/lib/types/schedule";

interface ScheduleCardProps {
  schedule: Schedule;
  onDelete?: (id: string) => void;
}

export default function ScheduleCard({
  schedule,
  onDelete,
}: ScheduleCardProps) {
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

        {/* 날짜 표시 */}
        <h3 className="text-sm font-semibold text-[#3E3232] mb-2">
          {format(new Date(schedule.date), "MMM d")} · {schedule.date}
        </h3>

        {/* 특이사항 */}
        {Array.isArray(schedule.specialNotices) &&
          schedule.specialNotices.length > 0 && (
            <div className="mb-2 text-xs text-[#7E6363]">
              <strong>특이사항</strong>
              <ul className="list-disc pl-4 mt-1">
                {schedule.specialNotices.map((notice, idx) => (
                  <li
                    key={idx}
                    className={
                      notice.level === "important"
                        ? "text-red-500 font-bold"
                        : notice.level === "warning"
                        ? "text-yellow-600"
                        : ""
                    }
                  >
                    {notice.content}
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* 자리오디션 */}
        {Array.isArray(schedule.auditionSessions) &&
          schedule.auditionSessions.length > 0 && (
            <div className="mb-2 text-xs text-[#7E6363]">
              <strong>자리오디션</strong>
              <ul className="list-disc pl-4 mt-1">
                {schedule.auditionSessions.map((s, idx) => (
                  <li key={idx}>
                    {s.time} – {s.title} @ {s.location}
                    {s.note && (
                      <span className="ml-1 text-gray-400 italic">
                        ({s.note})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* 파트레슨 */}
        {Array.isArray(schedule.partSessions) &&
          schedule.partSessions.length > 0 && (
            <div className="mb-2 text-xs text-[#7E6363]">
              <strong>파트레슨</strong>
              <ul className="list-disc pl-4 mt-1">
                {schedule.partSessions.map((s, idx) => (
                  <li key={idx}>
                    {s.time} – {s.title} @ {s.location}
                    {s.note && (
                      <span className="ml-1 text-gray-400 italic">
                        ({s.note})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* 오케스트라 세션 */}
        {schedule.orchestraSession && (
          <div className="text-xs text-[#7E6363]">
            <strong>오케스트라</strong>
            <div className="ml-2">
              <div>{schedule.orchestraSession.time}</div>
              <div>지휘자: {schedule.orchestraSession.conductor}</div>
              <div>장소: {schedule.orchestraSession.location}</div>
              <ul className="list-disc pl-4 mt-1">
                {schedule.orchestraSession.pieces.map((p, idx) => (
                  <li key={idx}>
                    {p.title}
                    {p.movements?.length ? ` (${p.movements.join(", ")})` : ""}
                    {p.note && (
                      <span className="ml-1 text-gray-400 italic">
                        ({p.note})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
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
