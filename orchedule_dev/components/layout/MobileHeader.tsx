"use client";

import Image from "next/image";
import Logo from "../ui/Logo";
import SeasonDropdown from "../dropdown/SeasonDropdown";
import SettingDropdown from "../dropdown/SettingDropdown";
import { useState } from "react";
import SearchButton from "../search/SearchButton";
import TopNotification from "../ui/TopNotification";

export default function MobileHeader() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const handleDropdownClick = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + 4,
      left: rect.left,
    });
    setShowDropdown(true);
  };

  return (
    <div className="flex flex-col px-2 pt-6 pb-2 md:hidden relative">
      {/* 로고 + 아이콘 */}
      <div className="flex justify-between items-center w-full px-4">
        <Logo />
        <div className="flex items-center gap-4 relative">
          <SearchButton />
          <TopNotification />
          <div>
            <Image
              src="/icons/userIcon.svg"
              alt="사용자"
              width={23}
              height={23}
              className="cursor-pointer self-center"
              onClick={handleDropdownClick}
            />
          </div>
        </div>
      </div>

      {/* 시즌 선택 */}
      <div className="mt-2 px-4 py-3 flex items-center gap-2 text-sm text-[#3E3232] font-semibold">
        <span className="text-base">아람 필하모닉</span>
        <SeasonDropdown />
      </div>

      {/* 드롭다운 */}
      {showDropdown && (
        <SettingDropdown
          onClose={() => setShowDropdown(false)}
          position={dropdownPosition}
        />
      )}
    </div>
  );
}
