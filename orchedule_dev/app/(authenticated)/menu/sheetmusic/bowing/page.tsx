"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ScoreCheck } from "@/src/lib/types/sheet";
import RegisterButton from "@/components/common/RegisterButton";
import { Music } from "lucide-react";

export default function SheetScoreCheckList() {
  const [scoreChecks, setScoreChecks] = useState<ScoreCheck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/score-checks");
      const data = await res.json();
      setScoreChecks(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 space-y-4 -mt-2">
      {/* 추가 버튼 */}

      <RegisterButton href="/menu/sheetmusic/bowing/new">
        악보 등록
      </RegisterButton>

      {loading ? (
        <div className="text-center text-[#a79c90] text-sm py-10">
          ⏳ 악보체크를 불러오는 중이에요...
        </div>
      ) : scoreChecks.length === 0 ? (
        <div className="bg-[#fdfbf9] border border-[#e8e0d9] rounded-xl p-6 text-center w-full">
          <p className="text-sm text-[#7e6a5c] font-semibold">
            아직 등록된 악보가 없어요.
          </p>
        </div>
      ) : (
        scoreChecks.map((check) => {
          const createdAt = new Date(check.date);
          const contentPreview =
            check.content.replace(/\n/g, " ").slice(0, 80) +
            (check.content.length > 80 ? "..." : "");

          return (
            <Link
              key={check._id}
              href={`/menu/sheetmusic/bowing/${check._id}`}
              className="block bg-white p-4 rounded-lg shadow-sm hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Music size={16} className="text-[#7E6363]" />
                  <h3 className="font-semibold text-sm truncate">
                    {check.title}
                  </h3>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {createdAt.toLocaleDateString("ko-KR")}
                </span>
              </div>

              <div className="text-xs text-gray-500 mb-3">{check.author}</div>

              <div className="text-xs text-[#7e6a5c] mt-2 leading-relaxed line-clamp-2">
                {contentPreview}
              </div>
              {/* 파트 태그 */}
              {check.parts && check.parts.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 ml-1">
                  {check.parts.map((part, idx) => (
                    <span
                      key={idx}
                      className="text-xs text-[#7e6a5c] bg-[#f4ece7] px-2 py-1 rounded-full"
                    >
                      #{part}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          );
        })
      )}
    </div>
  );
}
