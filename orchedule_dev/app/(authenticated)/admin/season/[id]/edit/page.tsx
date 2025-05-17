"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditSeasonPage() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pieces, setPieces] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ✅ 시즌 데이터 가져오기
  useEffect(() => {
    if (!id) return;

    const fetchSeason = async () => {
      try {
        const res = await fetch(`/api/seasons/${id}`);
        if (!res.ok) throw new Error("시즌 정보를 불러오지 못했습니다.");
        const data = await res.json();
        setName(data.name);
        setStartDate(data.startDate);
        setEndDate(data.endDate || "");
        setPieces(data.pieces || []);
      } catch (error) {
        console.error("시즌 데이터 불러오기 실패:", error);
        setErrorMessage("시즌 데이터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSeason();
  }, [id]);

  // ✅ 곡 추가
  const handleAddPiece = () => {
    setPieces([...pieces, ""]);
  };

  // ✅ 곡 삭제
  const handleRemovePiece = (index: number) => {
    setPieces(pieces.filter((_, i) => i !== index));
  };

  // ✅ 곡 수정
  const handleChangePiece = (index: number, value: string) => {
    const updated = [...pieces];
    updated[index] = value;
    setPieces(updated);
  };

  // ✅ 수정 요청 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const updatedSeason = {
      name,
      startDate,
      endDate,
      pieces,
    };

    try {
      const res = await fetch(`/api/seasons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSeason),
      });

      if (!res.ok) throw new Error("시즌 수정 실패");
      router.push(`/admin/season/${id}`);
    } catch (error) {
      console.error("수정 오류:", error);
      setErrorMessage("수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // ✅ 로딩 처리
  if (isLoading) {
    return (
      <main className="max-w-2xl mx-auto p-6">
        <p className="text-gray-500">로딩 중...</p>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4 text-[#3E3232]">시즌 수정</h1>

      {errorMessage && (
        <p className="text-sm text-red-600 mb-2">{errorMessage}</p>
      )}

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

        {/* 🎵 곡 목록 */}
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
