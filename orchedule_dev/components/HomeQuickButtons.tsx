"use client";

import Image from "next/image";
import Link from "next/link";

const items = [
  {
    label: "공지",
    icon: "/icons/notice-active.svg",
    href: "/menu/notice/announcement",
  },
  {
    label: "출석",
    icon: "/icons/attendance-active.svg",
    href: "/menu/attendance/check",
  },
  {
    label: "악보",
    icon: "/icons/sheet-active.svg",
    href: "/menu/sheetmusic/sheet",
  },
  {
    label: "자리",
    icon: "/icons/seat.svg",
    href: "/menu/notice/seatNoti",
  },
];

export default function HomeQuickButtons() {
  return (
    <div className="md:hidden px-4 pt-1">
      <div className="grid grid-cols-4 gap-4">
        {items.map(({ label, icon, href }) => (
          <Link
            href={href}
            key={label}
            className="flex flex-col items-center gap-1 bg-white rounded-xl shadow-md py-3"
          >
            <Image
              src={icon}
              alt={label}
              width={30}
              height={30}
              style={{ aspectRatio: "1 / 1" }}
            />
            <span className="text-xs text-[#3e3232c5] font-semibold">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
