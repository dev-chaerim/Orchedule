"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  label?: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  getLabel?: (val: string) => string;
}

export default function MultiSelectDropdown({
  label,
  options,
  value,
  onChange,
  getLabel = (v) => v,
}: Props) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const toggleValue = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-semibold text-[#3E3232] mb-1">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border border-[#C3B9B1] rounded-md px-3 py-2 text-sm flex justify-between items-center"
      >
        <span className="truncate">
          {value.length > 0
            ? value.map((v) => getLabel(v)).join(", ")
            : "선택해주세요"}
        </span>
        <ChevronDown size={16} className="ml-2" />
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md max-h-60 overflow-y-auto">
          {options.map((option) => (
            <label
              key={option}
              className="block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={value.includes(option)}
                onChange={() => toggleValue(option)}
                className="mr-2"
              />
              {getLabel(option)}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
