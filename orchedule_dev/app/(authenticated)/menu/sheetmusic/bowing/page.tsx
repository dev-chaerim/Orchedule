"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface ScoreCheck {
  _id: string;
  title: string;
  date: string; // ISO 문자열
  author: string;
  fileUrl: string;
  parts: string[];
  tag?: string;
}

export default function SheetScoreCheckList() {
  const [scores, setScores] = useState<ScoreCheck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      const res = await fetch("/api/score-checks");
      const data = await res.json();
      setScores(data);
      setLoading(false);
    };
    fetchScores();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-4">
      {/* 추가 버튼 */}
      <div className="flex justify-end  -mt-4">
        <Link
          href="/menu/sheetmusic/bowing/new"
          className="inline-block bg-[#3E3232] text-white text-sm px-4 py-2 rounded-md hover:bg-[#2c2323] transition"
        >
          + 악보 추가
        </Link>
      </div>

      {loading ? (
        <div className="text-center text-[#a79c90] text-sm py-10">
          ⏳ 악보 리스트를 불러오는 중이에요...
        </div>
      ) : scores.length === 0 ? (
        <div className="text-sm text-gray-400">등록된 악보가 없습니다.</div>
      ) : (
        scores.map((sheet) => {
          const createdAt = new Date(sheet.date);

          return (
            <Link
              key={sheet._id}
              href={`/menu/sheetmusic/bowing/${sheet._id}`}
              className="block bg-white p-4 rounded-lg shadow-sm hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-sm">{sheet.title}</h3>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {createdAt.toLocaleDateString("ko-KR")}
                </span>
              </div>

              <div className="text-xs text-gray-600 mt-1">
                파트: {sheet.parts.join(", ")}
              </div>
              <div className="text-xs text-gray-400 mt-2">{sheet.author}</div>
            </Link>
          );
        })
      )}
    </div>
  );
}
