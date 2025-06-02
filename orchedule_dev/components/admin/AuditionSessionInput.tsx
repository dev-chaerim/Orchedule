"use client";

import { X } from "lucide-react";
import { orderedParts, partLabels, PartKey } from "@/src/constants/parts"; // part 목록 불러오기
import MultiSelectDropdown from "../dropdown/MultiSelectDropdown";

interface PracticeSession {
  time: string;
  title: string;
  location: string;
  conductor?: string;
  parts?: string[];
  note?: string;
}

interface Props {
  session: PracticeSession;
  onChange: (field: keyof PracticeSession, value: string | string[]) => void;
  onDelete?: () => void;
}

export default function AuditionSessionInput({
  session,
  onChange,
  onDelete,
}: Props) {
  return (
    <div className="space-y-2 pb-4 border-b border-dashed border-gray-200 last:border-none">
      {/* 삭제 버튼 */}
      {onDelete && (
        <div className="flex justify-end mb-1">
          <button
            type="button"
            onClick={onDelete}
            className="text-gray-500 hover:text-red-500 bg-[#eeeeee] hover:bg-red-100 hover:border-red-200 border border-gray-300 px-3 py-1 rounded-full text-xs flex items-center gap-1 transition"
            aria-label="오디션 삭제"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* 시간 */}
      <input
        placeholder="시간 예: 14:00~15:00"
        value={session.time}
        onChange={(e) => onChange("time", e.target.value)}
        className="w-full border border-[#C3B9B1] rounded-md px-3 py-2 text-sm"
        required
      />

      {/* 제목 */}
      <input
        placeholder="제목 예: 첼로 오디션"
        value={session.title}
        onChange={(e) => onChange("title", e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        required
      />

      {/* 장소 */}
      <input
        placeholder="장소 예: 아람 1번방"
        value={session.location}
        onChange={(e) => onChange("location", e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        required
      />

      {/* 지휘자 */}
      <input
        placeholder="지휘자 (선택)"
        value={session.conductor || ""}
        onChange={(e) => onChange("conductor", e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
      />

      {/* 대상 파트 */}
      <MultiSelectDropdown
        label="대상 파트"
        options={orderedParts}
        value={session.parts || []}
        onChange={(value) => onChange("parts", value)}
        getLabel={(val: string) => partLabels[val as PartKey] ?? val}
      />

      {/* 비고 */}
      <input
        placeholder="비고 (선택)"
        value={session.note || ""}
        onChange={(e) => onChange("note", e.target.value)}
        className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
      />
    </div>
  );
}
