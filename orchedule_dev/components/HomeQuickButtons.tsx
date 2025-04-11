'use client';

import Image from 'next/image';
import Link from 'next/link';

const items = [
  { label: '공지', icon: '/icons/notice-active.svg', href: '/menu/notice' },
  { label: '출석', icon: '/icons/attendance-active.svg', href: '/menu/attendance' },
  { label: '악보', icon: '/icons/sheet-active.svg', href: '/menu/sheetmusic' },
  { label: '자리', icon: '/icons/seat.svg', href: '/menu/seat' },
];

export default function HomeQuickButtons() {
  return (
    <div className="flex justify-center md:hidden">
      <div className="flex gap-10 px-4 py-2">
        {items.map(({ label, icon, href }) => (
          <Link
            href={href}
            key={label}
            className="flex flex-col items-center justify-between gap-1 px-4 py-3 bg-white rounded-xl shadow-md w-18"
          >
            <Image src={icon} alt={label} width={30} height={30} />
            <span className="text-xs text-[#3e3232c5] font-semibold">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
