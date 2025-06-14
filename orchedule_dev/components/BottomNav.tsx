"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ComingSoonItemBottomNav } from "@/components/common/ComingSoonItemBottomNav"; // ✅ import 추가

const navItems = [
  { href: "/", label: "홈", icon: "home" },
  { href: "/menu", label: "메뉴", icon: "menu" },
  { href: "/practice", label: "연습일지", icon: "practice" },
  { href: "/board", label: "게시판", icon: "board" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full h-16 pb-1 rounded-2xl bg-white z-10 flex items-center justify-around border-t border-gray-200 md:hidden">
      {navItems.map(({ href, label, icon }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        const iconSrc = isActive
          ? `/icons/${icon}-active.svg`
          : `/icons/${icon}.svg`;

        const isComingSoon = href === "/practice" || href === "/board"; // ✅ ComingSoon 체크

        if (isComingSoon) {
          return (
            <ComingSoonItemBottomNav key={href} label={label} icon={iconSrc} />
          );
        }

        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 pt-2 text-[13px] font-semibold ${
              isActive ? "text-[#7E6363]" : "text-[#c3c3c3]"
            }`}
          >
            <Image
              src={iconSrc}
              alt={label}
              width={23}
              height={23}
              style={{ aspectRatio: "1 / 1" }}
            />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
