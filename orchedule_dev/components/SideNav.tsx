"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserCircle } from "lucide-react";
import { useUserStore } from "@/lib/store/user";
import Logo from "./Logo";
import { useState } from "react";
import SettingDropdown from "./dropdown/SettingDropdown";

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

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen border-r border-gray-200 px-6 py-6 bg-white text-sm">
      <Logo />

      <hr className="border-t border-dashed border-[#C3C3C3] mb-6 mt-4" />

      {/* 상단 메뉴 */}
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
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
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
      <p className="mt-10 mb-2 text-gray-400 text-xs">other things</p>
      <div className="space-y-2">
        {otherItems.map(({ href, label, icon, match }) => {
          const isActive = new RegExp(match).test(pathname);
          const iconSrc = isActive
            ? `/icons/${icon}-active.svg`
            : `/icons/${icon}.svg`;

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
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

      <p className="mt-10 mb-2 text-gray-400 text-xs">recent</p>

      <div className="mt-auto w-full relative">
        {/* 설정 버튼 */}
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-1 text-[#C3C3C3] hover:text-[#7E6363] cursor-pointer relative"
        >
          <Image src="/icons/setting.svg" alt="설정" width={16} height={16} />
          <span className="text-sm">설정</span>
        </div>

        {/* 위로 뜨는 드롭다운 메뉴 */}
        {showDropdown && (
          <SettingDropdown onClose={() => setShowDropdown(false)} />
        )}

        <hr className="border-t border-dashed border-[#C3C3C3] my-4" />

        {/* 사용자 정보 */}
        <div className="flex items-center gap-3 py-2">
          <div className="w-9 h-9 text-[#C3C3C3]">
            <UserCircle size={36} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#4C4C4C]">
              <span>{user?.name ?? ""}</span>
            </span>
            <span className="text-xs text-[#C3C3C3]">{user?.part ?? ""}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
