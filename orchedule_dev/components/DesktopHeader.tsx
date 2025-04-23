"use client";

import Image from "next/image";
import SeasonDropdown from "./dropdown/SeasonDropdown";

export default function DesktopHeader() {
  return (
    <div className="absolute top-4 left-6 right-6 hidden md:flex items-center justify-between z-10">
      {/* 오케스트라 이름 + 시즌 선택 */}
      <div className="flex items-center gap-4">
        <div className="text-base font-bold text-[#3E3232]">아람 필하모닉</div>
        <SeasonDropdown />
      </div>

      {/* 검색 & 알림 아이콘 */}
      <div className="flex items-center gap-4">
        <Image
          src="/icons/search.svg"
          alt="검색"
          width={20}
          height={20}
          className="cursor-pointer"
        />
        <Image
          src="/icons/top-notice.svg"
          alt="알림"
          width={20}
          height={20}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}
