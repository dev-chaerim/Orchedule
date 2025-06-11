"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Props {
  label: string;
  icon: string;
}

export function ComingSoonItemBottomNav({ label, icon }: Props) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

  const buttonRef = useRef<HTMLDivElement>(null);
  const tooltipWrapperRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setTooltipPos({
        top: rect.top - 8, // 버튼 위쪽으로 띄우기
        left: rect.left + rect.width / 2, // 버튼 중앙 기준 정렬
      });
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
        className="flex flex-col items-center justify-center gap-1 pt-2 text-[#a3a3a3] cursor-pointer relative" // ✅ pt-2 추가됨
      >
        <Image
          src={icon}
          alt={label}
          width={23}
          height={23}
          style={{ aspectRatio: "1 / 1" }}
        />
        <span className="text-[13px] font-semibold">{label}</span>
      </div>

      {showTooltip && (
        <div
          ref={tooltipWrapperRef}
          className="fixed"
          style={{
            top: tooltipPos.top,
            left: tooltipPos.left,
            transform: "translate(-50%, -100%)", // 중앙 정렬 + 위로 올리기
            zIndex: 1000,
          }}
        >
          <div className="relative bg-[#FDF5E6] text-[#3E3232] text-xs px-3 py-[6px] rounded-md shadow-md whitespace-nowrap">
            오픈 예정입니다
            {/* 꼬리 */}
            <div className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-[12px] h-[12px] bg-[#FDF5E6] rotate-45 shadow-md" />
          </div>
        </div>
      )}
    </div>
  );
}
