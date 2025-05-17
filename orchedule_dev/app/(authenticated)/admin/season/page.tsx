"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Season {
  _id: number;
  name: string;
  startDate: string;
  endDate?: string;
  pieces: string[];
}

export default function AdminSeasonPage() {
  // ✅ 상태 관리
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ✅ 시즌 목록 가져오기
  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const res = await fetch("/api/seasons");
        if (!res.ok) throw new Error("시즌 목록을 불러오지 못했습니다.");
        const data: Season[] = await res.json();

        // ✅ 시작 날짜 기준 내림차순 정렬 (최근 시즌이 위로)
        const sortedSeasons = data.sort((a, b) => {
          return (
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
        });

        setSeasons(sortedSeasons); // ✅ API 데이터를 상태에 저장
      } catch (error) {
        console.error("시즌 목록 불러오기 오류:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeasons();
  }, []);

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-[#3E3232]">시즌 관리</h1>
        <Link href="/admin/season/new">
          <button className="bg-[#F4ECE7] text-[#3E3232] text-sm font-medium px-4 py-2 rounded-md hover:bg-[#e3dcd7]">
            + 시즌 추가
          </button>
        </Link>
      </div>

      {/* ✅ 로딩 상태 표시 */}
      {isLoading ? (
        <div className="text-sm text-gray-500">로딩 중...</div>
      ) : seasons.length === 0 ? (
        <div className="text-sm text-[#7e6a5c] text-center py-10 border border-dashed border-[#e0dada] rounded-md bg-[#fcfaf9]">
          아직 등록된 시즌이 없습니다.
        </div>
      ) : (
        <ul className="space-y-3">
          {seasons.map((season) => (
            <li
              key={season._id}
              className="bg-white border border-[#E0D6CD] rounded-lg p-4"
            >
              <div className="flex justify-between items-center mb-1">
                <Link href={`/admin/season/${season._id}`} className="flex-1">
                  <h3 className="text-sm font-semibold text-[#3E3232] hover:underline">
                    {season.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {season.startDate} ~ {season.endDate || "미정"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    🎵 등록된 곡 {season.pieces.length}개
                  </p>
                </Link>

                <Link href={`/admin/season/${season._id}/edit`}>
                  <button className="text-xs font-semibold bg-[#F4ECE7] text-[#3E3232] px-3 py-1 rounded-md hover:bg-[#e3dcd7] transition">
                    수정
                  </button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
