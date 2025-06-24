"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";

interface TabItem {
  name: string;
  href: string;
}

export default function SectionTabs({ tabs }: { tabs: TabItem[] }) {
  const pathname = usePathname();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsSmallScreen(window.innerWidth < 400);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const isScrollable = tabs.length >= 4 && isSmallScreen;

  return (
    <div className={clsx(isScrollable && "overflow-x-auto")}>
      <div
        className={clsx(
          "flex rounded-xl px-4 py-1 mb-2 shadow-sm",
          isScrollable
            ? "min-w-fit gap-2 whitespace-nowrap scrollbar-hide"
            : "justify-around"
        )}
      >
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={clsx(
                "font-medium px-3 py-1 rounded-lg transition-colors shrink-0",
                isActive
                  ? "text-[#3E3232] font-semibold"
                  : "text-[#B0A7A0] hover:text-[#3E3232] hover:font-semibold",
                tab.href.startsWith("/menu/notice")
                  ? "text-[12px]"
                  : "text-[13px]"
              )}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
