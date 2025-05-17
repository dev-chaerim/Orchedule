"use client";

import { useState } from "react";
import { X } from "lucide-react";
import SimpleSongDropdown from "@/components/admin/SimpleSongDropdown";
import { useSeasonStore } from "@/src/lib/store/season";

interface Piece {
  time: string;
  title: string;
  note?: string;
}

interface ScheduleFormProps {
  defaultDate?: string;
  defaultPieces?: Piece[];
  onSubmit: (data: { date: string; pieces: Piece[] }) => void;
  submitLabel?: string;
}

export default function ScheduleForm({
  defaultDate = "",
  defaultPieces = [{ time: "", title: "", note: "" }],
  onSubmit,
  submitLabel = "저장",
}: ScheduleFormProps) {
  const [date, setDate] = useState(defaultDate);
  const [pieces, setPieces] = useState<Piece[]>(defaultPieces);
  const selectedSeason = useSeasonStore((state) => state.selectedSeason);

  const handlePieceChange = (
    index: number,
    field: keyof Piece,
    value: string
  ) => {
    const updated = [...pieces];
    updated[index][field] = value;
    setPieces(updated);
  };

  const handleAddPiece = () => {
    setPieces([...pieces, { time: "", title: "", note: "" }]);
  };

  const handleRemovePiece = (index: number) => {
    setPieces(pieces.filter((_, i) => i !== index));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ date, pieces });
      }}
      className="space-y-6 bg-white rounded-xl shadow-md p-8 border border-gray-100"
    >
      {/* 날짜 입력 */}
      <div>
        <label className="block text-sm font-semibold text-[#3E3232] mb-1">
          날짜
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A5796E] mt-1"
          required
        />
      </div>

      {/* 곡 리스트 */}
      <div className="space-y-4 mt-6">
        {pieces.map((piece, idx) => (
          <div
            key={idx}
            className="space-y-2 pb-4 border-b border-dashed border-gray-200 last:border-none"
          >
            {/* 삭제 버튼 */}
            <div className="flex justify-end mb-1">
              <button
                type="button"
                onClick={() => handleRemovePiece(idx)}
                className="text-gray-500 hover:text-red-500 bg-[#eeeeee] hover:bg-red-100 hover:border-red-200 border border-gray-300 px-3 py-1 rounded-full text-xs flex items-center gap-1 transition"
                aria-label="곡 삭제"
              >
                <X size={12} />
              </button>
            </div>

            {/* 시간 */}
            <input
              placeholder="예: 3:40~4:05"
              value={piece.time}
              onChange={(e) => handlePieceChange(idx, "time", e.target.value)}
              className="w-full border border-[#C3B9B1] rounded-md px-3 py-2 text-sm focus:ring-[#A5796E] focus:ring-1"
              required
            />

            {/* 곡명 */}
            <SimpleSongDropdown
              options={selectedSeason?.pieces || []}
              value={piece.title}
              onChange={(val) => handlePieceChange(idx, "title", val)}
            />

            {/* 비고 */}
            <input
              placeholder="비고 (선택)"
              value={piece.note ?? ""}
              onChange={(e) => handlePieceChange(idx, "note", e.target.value)}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-[#A5796E] focus:ring-1"
            />
          </div>
        ))}

        {/* 곡 추가 버튼 */}
        <button
          type="button"
          onClick={handleAddPiece}
          className="text-sm text-[#5c4f4f] hover:underline"
        >
          + 시간 추가
        </button>
      </div>

      {/* 저장 버튼 */}
      <button
        type="submit"
        className="px-5 py-2 bg-[#3E3232] text-white text-sm font-semibold rounded-md hover:bg-[#2e2626] transition"
      >
        {submitLabel}
      </button>
    </form>
  );
}
