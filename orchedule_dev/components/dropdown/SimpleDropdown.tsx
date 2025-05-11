"use client";

import { useState } from "react";

interface SimpleDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SimpleDropdown({
  options,
  value,
  onChange,
  placeholder = "선택하세요",
}: SimpleDropdownProps) {
  const [showList, setShowList] = useState(false);

  const handleSelect = (val: string) => {
    onChange(val); // ✅ 부모 상태 업데이트
    setShowList(false); // ✅ 목록 닫기
  };

  return (
    <div className="relative">
      <div
        onClick={() => setShowList((prev) => !prev)}
        className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm cursor-pointer focus:ring-2 focus:ring-[#A5796E] focus:border-[#A5796E] bg-white"
      >
        {value || placeholder}
      </div>

      {showList && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 mt-1 rounded-md shadow-sm max-h-48 overflow-y-auto text-sm">
          {options.map((item) => (
            <li
              key={item}
              onClick={() => handleSelect(item)}
              className="px-4 py-2 hover:bg-[#f5f4f2] cursor-pointer"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
