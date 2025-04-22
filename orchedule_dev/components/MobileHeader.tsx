// components/MobileHeader.tsx
"use client";

import Image from "next/image";
import SeasonDropdown from "./dropdown/SeasonDropdown";
import Logo from "./Logo";
import { useState } from "react";
import SettingDropdown from "./dropdown/SettingDropdown";

export default function MobileHeader() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="flex flex-col pt-4 pb-2 md:hidden relative">
      {/* 로고 + 아이콘 */}
      <div className="flex justify-between items-center w-full px-4">
        <Logo />
        <div className="flex items-center gap-4 relative">
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
          <div className="relative">
            <Image
              src="/icons/userIcon.svg"
              alt="사용자"
              width={23}
              height={23}
              className="cursor-pointer self-center"
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <div className="absolute right-17 z-50">
                <SettingDropdown
                  direction="top"
                  onClose={() => setShowDropdown(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 시즌 선택 */}
      <div className="mt-2 px-4 py-3 flex items-center gap-2 text-sm text-[#3E3232] font-semibold">
        <span className="text-base">아람 필하모닉</span>
        <SeasonDropdown />
      </div>
    </div>
  );
}
