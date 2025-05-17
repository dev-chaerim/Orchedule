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
  const [seasons, setSeasons] = useState<{ _id: string; name: string }[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedSeason = useSeasonStore((state) => state.selectedSeason);
  const setSelectedSeason = useSeasonStore((state) => state.setSelectedSeason);

  // ✅ 시즌 목록 가져오기 (정렬 포함)
  useEffect(() => {
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

        // ✅ 새로고침 시 기본값 설정 (선택된 시즌이 없을 때만)
        if (!selectedSeason && sortedSeasons.length > 0) {
          setSelectedSeason(sortedSeasons[0]); // ✅ 가장 최근 시즌을 기본값으로 설정
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

  const handleSelectSeason = (selected: { _id: string; name: string }) => {
    const formattedSeason: Season = {
      _id: selected._id,
      name: selected.name,
      startDate: "", // 필요한 필드 추가
      endDate: "",
      pieces: [],
    };
    setSelectedSeason(formattedSeason);
    setOpen(false);
  };

  // ✅ 기본값이 없으면 "시즌 선택" 표시
  const displayedSeason = selectedSeason ? selectedSeason.name : "시즌 선택";

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
          {seasons.map((season) => (
            <button
              key={season._id}
              onClick={() => {
                handleSelectSeason(season);
              }}
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
