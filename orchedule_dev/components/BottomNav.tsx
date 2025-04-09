'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: '홈', icon: 'home' },
    { href: '/menu', label: '메뉴', icon: 'menu' },
    { href: '/practice', label: '연습일지', icon: 'practice' },
    { href: '/board', label: '게시판', icon: 'board' },
  ];

  return (
    <nav
      className="
        fixed bottom-0 w-full h-16 z-10
        bg-white text-[13px] font-[400]
        flex items-center justify-around
        border-t border-gray-200
        md:static md:w-64 md:h-screen md:flex-col md:items-start md:justify-start md:gap-6 p-4
      "
    >
      {navItems.map(({ href, label, icon }) => {
        const isActive = pathname === href;
        const iconSrc = isActive
          ? `/icons/${icon}-active.svg`
          : `/icons/${icon}.svg`;

        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col md:flex-row md:items-center md:gap-2 items-center gap-1 pt-2 md:pt-0 w-full ${
              isActive ? 'text-[#7E6363]' : 'text-[#c3c3c3]'
            }`}
          >
            <Image src={iconSrc} alt={label} width={23} height={23} />
            <span className="md:text-[13px]">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
