"use client";

import Link from "next/link";
import { useState } from "react";
import { mockSeasons } from "@/lib/mock/seasons";

interface Season {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  pieces: string[];
}

export default function AdminSeasonPage() {
  const [seasons] = useState<Season[]>(mockSeasons);

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-[#3E3232]">시즌 관리</h1>
        <Link href="/admin/season/new">
          <button className="bg-[#F4ECE7] text-[#3E3232] text-sm font-medium px-4 py-2 rounded-md hover:bg-[#e3dcd7]">
            + 시즌 추가
          </button>
        </Link>
      </div>

      {seasons.length === 0 ? (
        <div className="text-sm text-gray-500">
          아직 등록된 시즌이 없습니다.
        </div>
      ) : (
        <ul className="space-y-3">
          {seasons.map((season) => (
            <li
              key={season.id}
              className="bg-white border border-[#E0D6CD] rounded-lg p-4"
            >
              <div className="flex justify-between items-center mb-1">
                <Link href={`/admin/season/${season.id}`} className="flex-1">
                  <h3 className="text-sm font-semibold text-[#3E3232] hover:underline">
                    {season.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {season.startDate} ~ {season.endDate}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    🎵 등록된 곡 {season.pieces.length}개
                  </p>
                </Link>

                <Link href={`/admin/season/${season.id}/edit`}>
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
