// ✅ components/admin/SimpleSongDropdown.tsx

"use client";

import { useState } from "react";

interface SimpleSongDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SimpleSongDropdown({
  options,
  value,
  onChange,
  placeholder = "곡명을 입력하세요",
}: SimpleSongDropdownProps) {
  const [showList, setShowList] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const filtered = options.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelect = (val: string) => {
    setInputValue(val);
    onChange(val);
    setShowList(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        placeholder={placeholder}
        onChange={(e) => {
          setInputValue(e.target.value);
          onChange(e.target.value);
          setShowList(true);
        }}
        onFocus={() => setShowList(true)}
        onBlur={() => setTimeout(() => setShowList(false), 100)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-[#A5796E] focus:ring-1"
      />

      {showList && filtered.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 mt-1 rounded-md shadow-sm max-h-40 overflow-y-auto text-sm">
          {filtered.map((item) => (
            <li
              key={item}
              onClick={() => handleSelect(item)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
