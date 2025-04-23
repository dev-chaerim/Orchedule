"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const tabs = [
  { name: "출석부", href: "/admin/attendance/check" },
  { name: "출석현황", href: "/admin/attendance/status" },
];

export default function AttendanceTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-4 mb-6 border-b border-gray-200 px-1 text-sm">
      {tabs.map((tab) => (
        <Link
          key={tab.name}
          href={tab.href}
          className={clsx(
            "pb-2",
            pathname === tab.href
              ? "text-[#3E3232] font-semibold border-b-2 border-[#3E3232]"
              : "text-[#a8a29e] hover:text-[#5c4f4f]"
          )}
        >
          {tab.name}
        </Link>
      ))}
    </div>
  );
}
