"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUserStore } from "@/lib/store/user";
import { useSeasonStore } from "@/lib/store/season";
import { Music } from "lucide-react";

interface Sheet {
  _id: string;
  seasonId: string;
  title: string;
  date: string; // ISO 문자열
  author: string;
  content: string;
}

export default function SeasonSheetListPage() {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const selectedSeason = useSeasonStore((state) => state.selectedSeason);
  const seasonId = selectedSeason?._id;

  useEffect(() => {
    if (!seasonId) return;

    const fetchSheets = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/season-scores?season=${seasonId}`);
        const data = await res.json();
        setSheets(data);
      } catch (error) {
        console.error("악보 데이터 로딩 오류:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSheets();
  }, [seasonId]);

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-4">
      {/* 관리자 전용 등록 버튼 */}
      {user?.role === "admin" && (
        <div className="text-right mb-3 -mt-4">
          <Link href="/menu/sheetmusic/sheet/new">
            <button className="bg-[#F4ECE7] text-[#3E3232] text-sm font-medium px-4 py-2 rounded-md hover:bg-[#e3dcd7]">
              + 악보 등록
            </button>
          </Link>
        </div>
      )}

      {/* 로딩 표시 */}
      {isLoading ? (
        <div className="text-center text-[#a79c90] text-sm py-10">
          ⏳ 악보 리스트를 불러오는 중이에요...
        </div>
      ) : sheets.length === 0 ? (
        // 데이터 없을 때 메시지
        <div className="bg-[#fdfbf9] border border-[#e8e0d9] rounded-xl p-6 text-center w-full">
          <p className="text-sm text-[#7e6a5c] font-semibold">
            아직 등록된 악보가 없어요.
          </p>
        </div>
      ) : (
        // 악보 리스트
        sheets.map((sheet) => {
          const createdAt = new Date(sheet.date);

          // ✅ content preview 처리
          const contentPreview =
            sheet.content
              .replace(/\n/g, " ") // 줄바꿈 제거
              .slice(0, 80) + (sheet.content.length > 80 ? "..." : "");

          return (
            <Link
              key={sheet._id}
              href={`/menu/sheetmusic/sheet/${sheet._id}`}
              className="block bg-white p-4 rounded-lg shadow-sm hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Music size={16} className="text-[#7E6363]" />
                  <h3 className="font-semibold text-sm truncate">
                    {sheet.title}
                  </h3>
                </div>

                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {createdAt.toLocaleDateString("ko-KR")}
                </span>
              </div>
              <div className="text-xs text-gray-500 mb-3">{sheet.author}</div>

              <div className="text-xs text-[#7e6a5c] mt-2 leading-relaxed line-clamp-2">
                {contentPreview}
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
}
