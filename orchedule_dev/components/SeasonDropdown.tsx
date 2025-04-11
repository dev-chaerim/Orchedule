'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function SeasonDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-[#3E3232] bg-[#C6DCBA] rounded-xl font-medium cursor-pointer  hover:bg-[#c6dcbaaf]"
      >
        <span className="align-middle font-semibold">Season 3</span>
        <ChevronDown size={14} className="mt-[1px]"/>
      </button>

      {open && (
        <div className="absolute left-0 mt-1 w-28 bg-white border border-gray-300 rounded shadow text-xs z-10">
          <button className="block w-full px-3 py-1 text-left hover:bg-gray-100">Season 3</button>
          <button className="block w-full px-3 py-1 text-left hover:bg-gray-100">Season 2</button>
          <button className="block w-full px-3 py-1 text-left hover:bg-gray-100">Season 1</button>
        </div>
      )}
    </div>
  );
}
