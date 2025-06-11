"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Props {
  label: string;
  icon: string;
}

export function ComingSoonItem({ label, icon }: Props) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

  const buttonRef = useRef<HTMLDivElement>(null);
  const tooltipWrapperRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setTooltipPos({ top: rect.top + rect.height / 2, left: rect.right + 8 });
    }

    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        tooltipWrapperRef.current &&
        !tooltipWrapperRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setShowTooltip(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <div
        ref={buttonRef}
        onClick={handleClick}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#a3a3a3] hover:bg-gray-100 cursor-pointer relative"
      >
        <Image src={icon} alt={label} width={17} height={17} />
        <span>{label}</span>
      </div>

      {showTooltip && (
        <div
          ref={tooltipWrapperRef}
          className="fixed"
          style={{
            top: tooltipPos.top,
            left: tooltipPos.left,
            transform: "translateY(-50%)",
            zIndex: 1000,
          }}
        >
          <div className="relative bg-[#FDF5E6] text-[#3E3232] text-xs px-3 py-[6px] rounded-md shadow-md whitespace-nowrap">
            오픈 예정입니다
            {/* 꼬리 */}
            <div className="absolute -left-[6px] top-1/2 -translate-y-1/2 w-[12px] h-[12px] bg-[#FDF5E6] rotate-45 shadow-md" />
          </div>
        </div>
      )}
    </div>
  );
}
