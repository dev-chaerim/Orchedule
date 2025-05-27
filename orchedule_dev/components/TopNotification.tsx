"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function TopNotification() {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 알림 아이콘 */}
      <Image
        src="/icons/top-notice.svg"
        alt="알림"
        width={20}
        height={20}
        className="cursor-pointer"
        onClick={() => setOpen(!open)}
      />

      {/* 드롭다운 (기본형) */}
      {open && (
        <div className="absolute right-0 mt-2 w-60 rounded-xl border border-[#e3dbd6] shadow-sm bg-white p-4 text-sm text-[#3E3232] z-50">
          <p className="text-sm font-medium text-[#5A4A42] mb-2">최근 알림</p>
          <div className="border-t border-dashed border-[#D5CAC3] mt-2 mb-3" />
          <p className="text-sm text-[#aba29d]">알림이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
