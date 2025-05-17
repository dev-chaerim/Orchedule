"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewSeasonPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pieceInput, setPieceInput] = useState("");
  const [pieces, setPieces] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false); // ✅ 로딩 상태
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // ✅ 에러 상태

  // 곡 추가 핸들러
  const handleAddPiece = () => {
    if (pieceInput.trim() === "") return;
    setPieces([...pieces, pieceInput.trim()]);
    setPieceInput("");
  };

  // ✅ 시즌 추가 API 호출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null); // 초기화

    const newSeason = {
      name,
      startDate,
      endDate,
      pieces,
    };

    try {
      const res = await fetch("/api/seasons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSeason),
      });

      if (!res.ok) throw new Error("시즌 추가 실패");

      // ✅ 성공 시 목록 페이지로 이동
      router.push("/admin/season");
    } catch (error) {
      console.error("시즌 추가 오류:", error);
      setErrorMessage("시즌 추가에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4 text-[#3E3232]">시즌 추가</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="시즌명 (예: 2024 정기 연주회)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-[#D5CAC3] rounded-md px-4 py-2 text-sm focus:outline-[#7E6363]"
        />
        <div className="flex gap-3">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="flex-1 border border-[#D5CAC3] rounded-md px-4 py-2 text-sm focus:outline-[#7E6363]"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="flex-1 border border-[#D5CAC3] rounded-md px-4 py-2 text-sm focus:outline-[#7E6363]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#3E3232] block">
            곡 추가
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="곡 제목 입력"
              value={pieceInput}
              onChange={(e) => setPieceInput(e.target.value)}
              className="flex-1 border border-[#D5CAC3] rounded-md px-3 py-2 text-sm focus:outline-[#7E6363]"
            />
            <button
              type="button"
              onClick={handleAddPiece}
              className="bg-[#F4ECE7] text-[#3E3232] text-sm px-4 rounded-md hover:bg-[#e3dcd7]"
            >
              추가
            </button>
          </div>
          <ul className="text-sm text-[#3E3232] space-y-1">
            {pieces.map((piece, index) => (
              <li key={index}>🎵 {piece}</li>
            ))}
          </ul>
        </div>

        {/* ✅ 에러 메시지 */}
        {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}

        <div className="text-right">
          <button
            type="submit"
            disabled={isLoading}
            className={`${
              isLoading ? "bg-gray-400" : "bg-[#7E6363]"
            } text-white px-5 py-2 text-sm rounded-md hover:bg-[#5c4f4f]`}
          >
            {isLoading ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </form>
    </main>
  );
}
