"use client";

import { X } from "lucide-react";
import { PracticeSession } from "@/lib/types/schedule";

interface SessionListFormProps {
  label: string;
  sessions: PracticeSession[];
  onChange: (sessions: PracticeSession[]) => void;
}

export default function SessionListForm({
  label,
  sessions,
  onChange,
}: SessionListFormProps) {
  const handleChange = (
    index: number,
    field: keyof PracticeSession,
    value: string[]
  ) => {
    const updated = [...sessions];

    if (field === "parts") {
      updated[index].parts = value;
    } else {
      updated[index][field] = value[0];
    }

    onChange(updated);
  };

  const handleAdd = () => {
    onChange([
      ...sessions,
      { time: "", title: "", location: "", conductor: "" },
    ]);
  };

  const handleRemove = (index: number) => {
    onChange(sessions.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-[#3E3232] mb-2">
        {label}
      </label>

      <div className="space-y-4">
        {sessions.length === 0 ? (
          <>
            <div className="text-center text-sm text-[#a49d9d] mb-4 py-2">
              아직 등록된 일정이 없습니다.
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleAdd}
                className="px-6 py-2 rounded-full bg-[#d2b8b5] text-[#3E3232] font-semibold text-sm hover:bg-[#c2a5a1] transition"
              >
                + 일정 추가
              </button>
            </div>
          </>
        ) : (
          <>
            {sessions.map((session, idx) => (
              <div key={idx} className="space-y-2 p-4 rounded-md relative">
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-[#f3f0ed] text-[#7E6363] hover:bg-[#e2dbd7] transition"
                  aria-label="삭제"
                >
                  <X size={14} />
                </button>

                <input
                  placeholder="시간 (예: 3:00 - 3:30)"
                  value={session.time}
                  onChange={(e) => handleChange(idx, "time", [e.target.value])}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-6 text-sm"
                  required
                />

                <input
                  placeholder={`세션 제목 (예: 첼로 ${label})`}
                  value={session.title}
                  onChange={(e) => handleChange(idx, "title", [e.target.value])}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  required
                />

                <input
                  placeholder="장소 (예: 아람 1번방)"
                  value={session.location}
                  onChange={(e) =>
                    handleChange(idx, "location", [e.target.value])
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  required
                />

                <input
                  placeholder="담당자 (선택)"
                  value={session.conductor ?? ""}
                  onChange={(e) =>
                    handleChange(idx, "conductor", [e.target.value])
                  }
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                />
              </div>
            ))}

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleAdd}
                className="px-6 py-2 rounded-full bg-[#d2b8b5] text-[#3E3232] font-semibold text-sm hover:bg-[#c2a5a1] transition"
              >
                + 일정 추가
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
