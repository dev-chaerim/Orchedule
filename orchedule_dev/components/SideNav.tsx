"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/lib/store/user";
import Logo from "./Logo";
import { useState } from "react";
import SettingDropdown from "./dropdown/SettingDropdown";
import { ShieldCheck } from "lucide-react";
import { partLabels, PartKey } from "@/src/constants/parts";
import { ComingSoonItem } from "./common/ComingSoonItem";

const navItems = [
  { href: "/", label: "홈", icon: "home", match: "^/$" },
  { href: "/menu", label: "메뉴", icon: "menu", match: "^/menu$" },
  {
    href: "/menu/notice/announcement",
    label: "알림",
    icon: "notice",
    match: "^/menu/notice",
  },
  {
    href: "/menu/attendance/check",
    label: "출석",
    icon: "attendance",
    match: "^/menu/attendance",
  },
  {
    href: "/menu/sheetmusic/sheet",
    label: "악보",
    icon: "sheet",
    match: "^/menu/sheetmusic",
  },
];

const otherItems = [
  {
    href: "/practice",
    label: "연습일지",
    icon: "practice",
    match: "^/practice",
  },
  { href: "/board", label: "게시판", icon: "board", match: "^/board" },
];

export default function SideNav() {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const part = user?.part as PartKey | undefined;

  const handleDropdownClick = (e: React.MouseEvent) => {
    setDropdownPosition({
      top: e.clientY + 4, // 마우스 아래로 약간
      left: e.clientX + 8, // 오른쪽으로 약간
    });
    setShowDropdown(true);
  };
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen border-r border-gray-200 px-6 py-6 bg-white text-sm relative">
      <div className="flex-1 overflow-y-auto">
        <div className="absolute top-0 left-0 right-0 bg-white px-6 pt-6 z-10">
          <Logo />
          <hr className="border-t border-dashed border-[#C3C3C3] my-4" />
        </div>
        <div className="flex-1 overflow-y-auto mt-[88px] px-6 pb-[120px]">
          <div className="space-y-4">
            {navItems.map(({ href, label, icon, match }) => {
              const isActive = new RegExp(match).test(pathname);
              const iconSrc = isActive
                ? `/icons/${icon}-active.svg`
                : `/icons/${icon}.svg`;

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2 hover:text-[#7E6363] hover:bg-[#f3f3f3] rounded-lg ${
                    isActive
                      ? "bg-[#f3f3f3] text-[#7E6363] font-bold"
                      : "text-[#a3a3a3]"
                  }`}
                >
                  <Image src={iconSrc} alt={label} width={17} height={17} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>

          {/* other things */}
          <p className="mt-8 mb-4 text-gray-400 text-xs">other things</p>
          <div className="space-y-2">
            {otherItems.map(({ href, label, icon, match }) => {
              const isActive = new RegExp(match).test(pathname);
              const iconSrc = isActive
                ? `/icons/${icon}-active.svg`
                : `/icons/${icon}.svg`;

              const isComingSoon = href === "/practice" || href === "/board";

              if (isComingSoon) {
                return (
                  <ComingSoonItem key={href} label={label} icon={iconSrc} />
                );
              }

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2 hover:text-[#7E6363] hover:bg-[#f3f3f3] rounded-lg ${
                    isActive
                      ? "bg-[#f3f3f3] text-[#7E6363] font-bold"
                      : "text-[#a3a3a3]"
                  }`}
                >
                  <Image src={iconSrc} alt={label} width={17} height={17} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-2">
            <div
              onClick={handleDropdownClick}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#a3a3a3] hover:text-[#7E6363] hover:bg-[#f3f3f3] cursor-pointer"
            >
              <Image
                src="/icons/setting.svg"
                alt="설정"
                width={18}
                height={18}
              />
              <span className="text-sm">설정</span>
            </div>
          </div>
          {showDropdown && (
            <SettingDropdown
              onClose={() => setShowDropdown(false)}
              position={dropdownPosition}
              direction="top"
            />
          )}

          {/* 관리자 섹션 - admin 권한일 때만 노출 */}

          {user?.role === "admin" && (
            <>
              <p className="mt-10 mb-2 text-gray-400 text-xs">admin</p>
              <Link
                href="/admin"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                  pathname.startsWith("/admin")
                    ? "bg-[#f3f3f3] text-[#7E6363] font-bold"
                    : "text-[#a3a3a3] hover:bg-[#f3f3f3]"
                }`}
              >
                <ShieldCheck size={17} />
                <span>관리자 페이지</span>
              </Link>
            </>
          )}

          {/* <p className="mt-10 mb-2 text-gray-400 text-xs">recent</p> */}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-white px-6 pb-3 z-10">
          <div>
            <hr className="border-t border-dashed border-[#C3C3C3] my-4" />

            <div className="flex items-center gap-3 py-2 mb-2">
              <Image
                src="/icons/userIcon.svg"
                alt="사용자"
                width={30}
                height={30}
                className="cursor-pointer self-center"
                onClick={handleDropdownClick}
              />

              <div className="flex flex-col leading-tight">
                <span className="font-semibold text-[#3E3232] text-sm">
                  {user?.name}
                </span>
                {part && (
                  <span className="text-xs text-gray-400 mt-[2px]">
                    {partLabels[part as PartKey]}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
