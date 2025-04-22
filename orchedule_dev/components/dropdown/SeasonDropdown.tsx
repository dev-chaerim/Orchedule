"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

interface Season {
  id: number;
  name: string;
}

interface Props {
  seasons: Season[];
  selectedSeason: string;
  onSelect: (name: string) => void;
}

export default function SeasonDropdown({
  seasons,
  selectedSeason,
  onSelect,
}: Props) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
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
        <span className="align-middle font-semibold">{selectedSeason}</span>
        <ChevronDown size={14} className="mt-[1px]" />
      </button>

      {open && (
        <div className="absolute left-0 mt-1 w-28 bg-white border border-gray-300 rounded shadow text-xs z-10">
          {seasons.map((season) => (
            <button
              key={season.id}
              onClick={() => {
                onSelect(season.name);
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
