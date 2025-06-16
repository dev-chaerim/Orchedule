"use client";

import { X } from "lucide-react";
import { OrchestraSession } from "@/lib/types/schedule";
import OrchestraSessionForm from "./OrchestraSessionForm";

interface Props {
  sessions: OrchestraSession[];
  onChange: (sessions: OrchestraSession[]) => void;
}

export default function OrchestraSessionListForm({
  sessions,
  onChange,
}: Props) {
  const handleUpdate = (index: number, updated: OrchestraSession) => {
    const newSessions = [...sessions];
    newSessions[index] = updated;
    onChange(newSessions);
  };

  const handleAdd = () => {
    onChange([
      ...sessions,
      {
        time: "",
        location: "",
        conductor: "",
        pieces: [],
      },
    ]);
  };

  const handleRemove = (index: number) => {
    const newSessions = sessions.filter((_, i) => i !== index);
    onChange(newSessions);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-[#3E3232] mb-2">
        오케스트라 전체연습
      </label>

      <div className="space-y-4">
        {sessions.length === 0 ? (
          <>
            <div className="text-sm text-center text-[#a49d9d] mb-2 py-4 pt-6">
              아직 등록된 연습이 없습니다.
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleAdd}
                className="px-6 py-2 rounded-full bg-[#d2b8b5] text-[#3E3232] font-semibold text-sm hover:bg-[#c2a5a1] transition"
              >
                + 연습 추가
              </button>
            </div>
          </>
        ) : (
          <>
            {sessions.map((session, idx) => (
              <div key={idx} className="space-y-2 p-4 relative">
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-[#f3f0ed] text-[#7E6363] hover:bg-[#e2dbd7] transition"
                >
                  <X size={14} />
                </button>

                <OrchestraSessionForm
                  session={session}
                  onChange={(updated) => handleUpdate(idx, updated)}
                />
              </div>
            ))}

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleAdd}
                className="px-6 py-2 rounded-full bg-[#d2b8b5] text-[#3E3232] font-semibold text-sm hover:bg-[#c2a5a1] transition"
              >
                + 연습 추가
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
