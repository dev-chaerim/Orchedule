"use client";

import React from "react";

interface FilterChipsProps {
  families: string[];
  selected: string;
  onSelect: (family: string) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  families,
  selected,
  onSelect,
}) => {
  return (
    <div className="flex flex-wrap gap-2 p-2 bg-[#FAF9F6] rounded-xl">
      {families.map((fam) => (
        <button
          key={fam}
          onClick={() => onSelect(fam)}
          className={` cursor-pointer px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap ${
            selected === fam
              ? "bg-[#bbb3aa] text-[#3e3232]"
              : "bg-[#ece7e2] text-[#7e6a5c]"
          }`}
        >
          {fam}
        </button>
      ))}
    </div>
  );
};
