// components/dropdown/SeasonDropdown.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useSeasonStore } from "@/lib/store/season";
import { mockSeasons } from "@/lib/mock/seasons";

export default function SeasonDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedSeason = useSeasonStore((state) => state.selectedSeason);
  const setSelectedSeason = useSeasonStore((state) => state.setSelectedSeason);

  useEffect(() => {
    // 기본값 설정 (처음 진입 시 첫 시즌으로)
    if (!selectedSeason) {
      setSelectedSeason(mockSeasons[0]);
    }
  }, [selectedSeason, setSelectedSeason]);

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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-[#3E3232] bg-[#C6DCBA] rounded-xl font-medium cursor-pointer hover:bg-[#c6dcbaaf]"
      >
        <span className="align-middle font-semibold">
          {selectedSeason?.name ?? "시즌 선택"}
        </span>
        <ChevronDown size={14} className="mt-[1px]" />
      </button>

      {open && (
        <div className="absolute left-0 mt-1 w-28 bg-white border border-gray-300 rounded shadow text-xs z-10">
          {mockSeasons.map((season) => (
            <button
              key={season.id}
              onClick={() => {
                setSelectedSeason(season);
                setOpen(false);
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
