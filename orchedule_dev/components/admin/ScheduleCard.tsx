"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import ConfirmModal from "../modals/ConfirmModal";
import type { Schedule } from "@/src/lib/types/schedule";
import { ko } from "date-fns/locale";

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
        <h3 className="text-sm font-semibold text-[#3E3232] mb-4">
          {format(new Date(schedule.date), "yyyy.MM.dd (EEE)", { locale: ko })}
        </h3>

        {/* 특이사항 */}
        {Array.isArray(schedule.specialNotices) &&
          schedule.specialNotices.length > 0 && (
            <div className="mb-2 text-xs text-[#7E6363]">
              <strong className="text-[#3E3232] font-bold">특이사항</strong>
              <ul className="list-disc pl-5 mt-1 space-y-0.5">
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

        {/* 파트레슨 */}
        {Array.isArray(schedule.partSessions) &&
          schedule.partSessions.length > 0 && (
            <div className="mb-2 text-xs text-[#7E6363]">
              <strong className="text-[#3E3232] font-bold">파트레슨</strong>
              <ul className="list-disc pl-5 mt-1 space-y-0.5">
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

        {/* 자리오디션 */}
        {Array.isArray(schedule.auditionSessions) &&
          schedule.auditionSessions.length > 0 && (
            <div className="mb-2 text-xs text-[#7E6363]">
              <strong className="text-[#3E3232] font-bold">자리오디션</strong>
              <ul className="list-disc pl-5 mt-1 space-y-0.5">
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

        {/* 오케스트라 세션 */}
        {schedule.orchestraSession && (
          <div className="mt-2 mb-1 text-xs text-[#7E6363]">
            <strong className="text-[#3E3232] font-bold">오케스트라</strong>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>
                {schedule.orchestraSession.time} –{" "}
                {schedule.orchestraSession.conductor} @{" "}
                {schedule.orchestraSession.location}
              </li>
            </ul>
            <ul className="pl-6 mt-1 space-y-0.5">
              {schedule.orchestraSession.pieces.map((p, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <span className="text-sm text-[#3E3232] leading-5">▸</span>
                  <div>
                    <span>
                      {p.title}
                      {p.movements && p.movements.length > 0 && (
                        <span className="text-[#D97706] font-semibold">
                          ({p.movements.join(", ")})
                        </span>
                      )}
                    </span>

                    {p.note && (
                      <div className="text-gray-400 italic mt-1 ml-2">
                        {p.note}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
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
