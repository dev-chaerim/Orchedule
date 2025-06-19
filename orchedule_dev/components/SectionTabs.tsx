"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface TabItem {
  name: string;
  href: string;
}

export default function SectionTabs({ tabs }: { tabs: TabItem[] }) {
  const pathname = usePathname();

  return (
    <div className="flex justify-around bg-white rounded-xl px-2 py-1 mb-2 shadow-sm">
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={clsx(
              "font-medium px-3 py-1 rounded-lg transition-colors",
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
  );
}
