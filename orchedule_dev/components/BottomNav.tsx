"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ComingSoonItemBottomNav } from "@/components/common/ComingSoonItemBottomNav";

const navItems = [
  { href: "/", label: "홈", icon: "home" },
  { href: "/menu", label: "메뉴", icon: "menu" },
  { href: "/practice", label: "연습일지", icon: "practice" },
  { href: "/board", label: "게시판", icon: "board" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent.toLowerCase();
      setIsAndroid(/android/i.test(ua));
    }
  }, []);

  const navClass = `fixed bottom-0 w-full z-10 flex items-center justify-around border-t border-gray-200 md:hidden bg-white rounded-t-2xl ${
    isAndroid ? "h-[92px] pb-10" : "h-20 pb-2"
  }`;

  return (
    <nav
      className={navClass}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {navItems.map(({ href, label, icon }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        const iconSrc = isActive
          ? `/icons/${icon}-active.svg`
          : `/icons/${icon}.svg`;

        const isComingSoon = href === "/practice" || href === "/board";

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
