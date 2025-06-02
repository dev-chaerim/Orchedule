"use client";

// import { useState } from "react";
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
      updated[index][field] = value[0]; // parts가 아닌 필드에 배열 들어오면 첫 값만 저장
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
        {sessions.map((session, idx) => (
          <div
            key={idx}
            className="space-y-2 p-4 border border-dashed border-gray-300 rounded-md relative"
          >
            {/* 삭제 버튼 */}
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
            >
              <X size={14} />
            </button>

            <input
              placeholder="시간 (예: 3:00 - 3:30)"
              value={session.time}
              onChange={(e) => handleChange(idx, "time", [e.target.value])}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              required
            />

            <input
              placeholder="세션 제목 (예: 첼로 자리오디션)"
              value={session.title}
              onChange={(e) => handleChange(idx, "title", [e.target.value])}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              required
            />

            <input
              placeholder="장소 (예: 아람 1번방)"
              value={session.location}
              onChange={(e) => handleChange(idx, "location", [e.target.value])}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              required
            />

            <input
              placeholder="담당자 (선택)"
              value={session.conductor ?? ""}
              onChange={(e) => handleChange(idx, "conductor", [e.target.value])}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
          </div>
        ))}

        {/* 추가 버튼 */}
        <button
          type="button"
          onClick={handleAdd}
          className="text-sm text-[#5c4f4f] hover:underline"
        >
          + 세션 추가
        </button>
      </div>
    </div>
  );
}
