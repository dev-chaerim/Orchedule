"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { mockSeasons } from "@/lib/mock/seasons";

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditSeasonPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();

  const season = mockSeasons.find((s) => s.id.toString() === id);

  const [name, setName] = useState(season?.name ?? "");
  const [startDate, setStartDate] = useState(season?.startDate ?? "");
  const [endDate, setEndDate] = useState(season?.endDate ?? "");
  const [pieces, setPieces] = useState<string[]>(season?.pieces ?? []);

  if (!season) return <div>시즌 정보를 찾을 수 없습니다.</div>;

  const handleAddPiece = () => {
    setPieces([...pieces, ""]);
  };

  const handleRemovePiece = (index: number) => {
    setPieces(pieces.filter((_, i) => i !== index));
  };

  const handleChangePiece = (index: number, value: string) => {
    const updated = [...pieces];
    updated[index] = value;
    setPieces(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🛠 수정 완료", { name, startDate, endDate, pieces });
    router.push(`/admin/season/${season.id}`);
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4 text-[#3E3232]">시즌 수정</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="시즌 이름"
          className="w-full bg-white border border-[#D5CAC3] rounded-md px-4 py-2 text-sm focus:outline-[#7E6363]"
        />

        <div className="flex gap-3">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="flex-1 bg-white border border-[#D5CAC3] rounded-md px-4 py-2 text-sm focus:outline-[#7E6363]"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="flex-1 bg-white border border-[#D5CAC3] rounded-md px-4 py-2 text-sm focus:outline-[#7E6363]"
          />
        </div>

        {/* 🎵 곡 섹션 */}
        <div className="space-y-2 pt-2">
          <h2 className="text-sm font-semibold text-[#3E3232]">곡 목록</h2>
          {pieces.map((piece, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                value={piece}
                onChange={(e) => handleChangePiece(index, e.target.value)}
                placeholder={`곡 ${index + 1}`}
                className="flex-1 bg-white border border-[#D5CAC3] rounded-md px-4 py-2 text-sm focus:outline-[#7E6363]"
              />
              <button
                type="button"
                onClick={() => handleRemovePiece(index)}
                className="text-[12px] text-[#A47551] font-semibold bg-[#f5ebe2] px-3 py-[5px] rounded-md hover:bg-[#eaddd1] transition"
              >
                삭제
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddPiece}
            className="text-sm text-[#7E6363] hover:underline mt-2"
          >
            + 곡 추가
          </button>
        </div>

        <div className="text-right mt-6">
          <button
            type="submit"
            className="bg-[#7E6363] text-white px-6 py-2 text-sm rounded-md hover:bg-[#5c4f4f] transition"
          >
            저장하기
          </button>
        </div>
      </form>
    </main>
  );
}
