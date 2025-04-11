'use client';

import Link from 'next/link';
import Image from 'next/image';

interface MenuItem {
  label: string;
  href: string;
}

interface MenuCategoryCardProps {
  icon: string;
  title: string;
  items: MenuItem[];
}

export default function MenuCategoryCard({ icon, title, items }: MenuCategoryCardProps) {
  return (
    <div className=" rounded-xl p-4">
      {/* 상단 제목 + 아이콘 */}
      <div className="flex items-center gap-2 mb-3">
        <Image src={icon} alt={title} width={20} height={20} />
        <h2 className="text-sm font-semibold text-[#3E3232]">{title}</h2>
      </div>

      {/* 하위 메뉴: 2열 카드형 레이아웃 */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-2">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="block px-3 py-2 text-sm rounded-md shadow text-[#3E3232] hover:bg-[#e8eee3] text-center bg-white transition"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
