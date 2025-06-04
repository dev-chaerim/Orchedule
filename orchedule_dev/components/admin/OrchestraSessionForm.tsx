"use client";

import { useSeasonStore } from "@/src/lib/store/season";
import { OrchestraPiece, OrchestraSession } from "@/lib/types/schedule";
import { X } from "lucide-react";
import SimpleSongDropdown from "@/components/admin/SimpleSongDropdown";

interface Props {
  session: OrchestraSession;
  onChange: (value: OrchestraSession) => void;
}

export default function OrchestraSessionForm({ session, onChange }: Props) {
  const selectedSeason = useSeasonStore((state) => state.selectedSeason);

  const updateField = (field: keyof OrchestraSession, val: string) => {
    onChange({ ...session, [field]: val });
  };

  const updatePiece = (
    index: number,
    field: keyof OrchestraPiece,
    val: string
  ) => {
    const updatedPieces = [...session.pieces];

    if (field === "movements") {
      updatedPieces[index].movements = val.split(",").map((s) => s.trim());
    } else if (field === "isEncore" || field === "highlight") {
      updatedPieces[index][field] = val === "true";
    } else {
      updatedPieces[index][field] = val;
    }

    onChange({ ...session, pieces: updatedPieces });
  };

  const addPiece = () => {
    const newPiece: OrchestraPiece = {
      title: "",
      movements: [],
      isEncore: false,
      highlight: false,
      note: "",
    };
    onChange({ ...session, pieces: [...session.pieces, newPiece] });
  };

  const removePiece = (index: number) => {
    const updated = session.pieces.filter((_, i) => i !== index);
    onChange({ ...session, pieces: updated });
  };

  return (
    <div>
      <h3 className="block text-sm font-semibold text-[#3E3232] mb-3">
        오케스트라 전체연습
      </h3>

      <div className="space-y-4 p-4 rounded-md">
        <input
          type="text"
          placeholder="시간 (예: 18:30 ~ 21:30)"
          value={session.time}
          onChange={(e) => updateField("time", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          required
        />

        <input
          type="text"
          placeholder="장소 (예: 아람 1층)"
          value={session.location}
          onChange={(e) => updateField("location", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          required
        />

        <input
          type="text"
          placeholder="지휘자 (예: 김지휘)"
          value={session.conductor}
          onChange={(e) => updateField("conductor", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          required
        />

        <div className="space-y-6">
          {session.pieces.map((piece, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-[#3E3232]">
                  곡 {idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removePiece(idx)}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-[#f3f0ed] text-[#7E6363] hover:bg-[#e2dbd7] transition"
                >
                  <X size={16} />
                </button>
              </div>

              <SimpleSongDropdown
                options={selectedSeason?.pieces || []}
                value={piece.title}
                onChange={(val) => updatePiece(idx, "title", val)}
              />

              <input
                placeholder="악장 입력 (예: 1st, 2nd)"
                value={piece.movements?.join(", ")}
                onChange={(e) => updatePiece(idx, "movements", e.target.value)}
                className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />

              <input
                placeholder="비고 (예: 마지막 rit 주의)"
                value={piece.note || ""}
                onChange={(e) => updatePiece(idx, "note", e.target.value)}
                className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />

              {/* <div className="flex items-center gap-4 mt-2 text-sm text-[#3E3232]">
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={piece.isEncore}
                    onChange={(e) =>
                      updatePiece(idx, "isEncore", e.target.checked.toString())
                    }
                  />
                  앙코르
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={piece.phighlight}
                    onChange={(e) =>
                      updatePiece(idx, "highlight", e.target.checked.toString())
                    }
                  />
                  강조 표시
                </label>
              </div> */}

              {idx < session.pieces.length - 1 && (
                <hr className="my-6 border-dashed border-[#ddd]" />
              )}
            </div>
          ))}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={addPiece}
              className="px-5 py-2 rounded-full bg-[#d2b8b5] text-[#3E3232] font-semibold text-sm hover:bg-[#c2a5a1] transition"
            >
              + 곡 추가
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
