// components/dropdown/SeasonDropdown.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useSeasonStore } from "@/lib/store/season";

interface Season {
  _id: string;
  name: string;
  startDate: string;
  endDate?: string;
  pieces: string[];
}

export default function SeasonDropdown() {
  const [open, setOpen] = useState(false);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedSeason = useSeasonStore((state) => state.selectedSeason);
  const setSelectedSeason = useSeasonStore((state) => state.setSelectedSeason);

  // ✅ 시즌 목록 가져오기 (정렬 포함)
  useEffect(() => {
    if (seasons.length > 0) return;

    const fetchSeasons = async () => {
      try {
        const res = await fetch("/api/seasons");
        if (!res.ok) throw new Error("시즌 목록 불러오기 실패");
        const data: Season[] = await res.json();

        // ✅ 시작 날짜 기준 내림차순 정렬 (최근 시즌이 첫 번째)
        const sortedSeasons = data.sort((a, b) => {
          return (
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
        });

        setSeasons(sortedSeasons);

        // ✅ selectedSeason이 없을 때만 설정
        if (
          !useSeasonStore.getState().selectedSeason &&
          sortedSeasons.length > 0
        ) {
          setSelectedSeason(sortedSeasons[0]);
        }
      } catch (error) {
        console.error("시즌 목록 불러오기 오류:", error);
      }
    };
    fetchSeasons();
  }, []);

  // ✅ 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ 시즌 선택 핸들러
  const handleSelectSeason = (selected: Season | null) => {
    setSelectedSeason(selected);
    setOpen(false);
  };

  // ✅ 기본값이 없으면 "전체"로 표시
  const displayedSeason = selectedSeason ? selectedSeason.name : "전체";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-[#3E3232] bg-[#C6DCBA] rounded-xl font-medium cursor-pointer hover:bg-[#c6dcbaaf]"
      >
        <span className="align-middle font-semibold">{displayedSeason}</span>
        <ChevronDown size={14} className="mt-[1px]" />
      </button>

      {open && (
        <div className="absolute left-0 mt-1 w-28 bg-white border border-gray-300 rounded shadow text-xs z-10">
          {/* ✅ 전체 옵션 */}
          <button
            key="all"
            onClick={() => handleSelectSeason(null)}
            className="block w-full px-3 py-1 text-left hover:bg-gray-100"
          >
            전체
          </button>

          {seasons.map((season) => (
            <button
              key={season._id}
              onClick={() => handleSelectSeason(season)}
              className="block w-full px-3 py-1 text-left hover:bg-gray-100"
            >
              {season.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
