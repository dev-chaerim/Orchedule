"use client";

import SeasonDropdown from "./dropdown/SeasonDropdown";
import SearchButton from "./search/SearchButton";
import TopNotification from "./TopNotification";

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
        <SearchButton />
        <TopNotification />
      </div>
    </div>
  );
}
