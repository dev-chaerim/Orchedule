"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ScoreCheck } from "@/src/lib/types/sheet";
import RegisterButton from "@/components/common/RegisterButton";
import FilterDropdown from "@/components/dropdown/FilterDropdown"; // ✅ 추가
import { Music } from "lucide-react";
import { parts } from "@/constants/parts"; // ✅ Part 목록 가져오기 (기존에 사용하던 parts)
import { isNew } from "@/src/lib/utils/isNew";
import NewBadge from "@/components/common/NewBadge";
import { useSeasonStore } from "@/lib/store/season";

export default function SheetScoreCheckList() {
  const [scoreChecks, setScoreChecks] = useState<ScoreCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPart, setSelectedPart] = useState<string>("전체"); // ✅ 추가

  const { selectedSeason } = useSeasonStore();
  const seasonId = selectedSeason?._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const query = seasonId ? `?seasonId=${seasonId}` : "";
        const res = await fetch(`/api/score-checks${query}`);
        const data = await res.json();
        setScoreChecks(data);
      } catch (error) {
        console.error("악보 체크 데이터를 불러오지 못했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [seasonId]);

  // ✅ 필터링된 악보 목록 계산
  const filteredScoreChecks =
    selectedPart === "전체"
      ? scoreChecks
      : scoreChecks.filter((check) => check.parts.includes(selectedPart));

  return (
    <div className="max-w-3xl mx-auto px-1 space-y-4 -mt-2">
      {/* 상단 필터 + 등록 버튼 */}
      <div className="flex justify-between items-center mb-4">
        <FilterDropdown
          options={["전체", ...parts.map((p) => p.key)]}
          selected={selectedPart}
          onChange={setSelectedPart}
          buttonClassName="mb-4 min-w-[80px] max-w-[100px] bg-white text-[#3e3232d4] truncate"
          optionClassName="bg-[#ede5de] hover:bg-[#dfd7d0] text-[#3e3232]"
        />

        <RegisterButton href="/menu/sheetmusic/bowing/new">
          악보 등록
        </RegisterButton>
      </div>

      {/* 리스트 영역 */}
      {loading ? (
        <div className="text-center text-[#a79c90] text-sm py-10">
          ⏳ 악보체크를 불러오는 중이에요...
        </div>
      ) : filteredScoreChecks.length === 0 ? (
        <div className="bg-[#fdfbf9] border border-[#e8e0d9] rounded-xl p-6 text-center w-full">
          <p className="text-sm text-[#7e6a5c] font-semibold">
            아직 등록된 악보가 없어요.
          </p>
        </div>
      ) : (
        filteredScoreChecks.map((check) => {
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
                  <div className="flex items-center gap-1 truncate pr-3">
                    <div className="font-semibold text-sm truncate">
                      {check.title}
                    </div>
                    {isNew(check.date) && <NewBadge />}
                  </div>
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
