'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { vibur } from '../app/fonts';
import { UserCircle } from 'lucide-react';

const navItems = [
  { href: '/', label: '홈', icon: 'home' },
  { href: '/menu', label: '메뉴', icon: 'menu' },
  { href: '/notice', label: '알림', icon: 'notice' },
  { href: '/attendance', label: '출석', icon: 'attendance' },
  { href: '/sheetmusic', label: '악보', icon: 'sheet' },
];

const otherItems = [
  { href: '/practice', label: '연습일지', icon: 'practice' },
  { href: '/board', label: '게시판', icon: 'board' },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen border-r border-gray-200 px-6 py-6 bg-white text-sm">
      {/* 홈로고 */}
      <h1 className={`${vibur.className} text-[#3E3232] text-3xl font-bold mb-4`}>Orchedule</h1>
      <hr className="border-t border-dashed border-[#C3C3C3] mb-6" />
      {/* 메뉴탭 */}
      <div className="space-y-4">
        {navItems.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          const iconSrc = isActive
            ? `/icons/${icon}-active.svg`
            : `/icons/${icon}.svg`;

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                isActive ? 'bg-[#f3f3f3] text-[#7E6363] font-bold' : 'text-[#a3a3a3]'
              }`}
            >
              <Image src={iconSrc} alt={label} width={17} height={17} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      {/* 구분선 */}
      <p className="mt-10 mb-2 text-gray-400 text-xs">other things</p>
      <div className="space-y-2">
        {otherItems.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          const iconSrc = isActive
            ? `/icons/${icon}-active.svg`
            : `/icons/${icon}.svg`;

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                isActive ? 'bg-[#f3f3f3] text-[#7E6363] font-bold' : 'text-[#a3a3a3]'
              }`}
            >
              <Image src={iconSrc} alt={label} width={17} height={17} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
      <p className="mt-10 mb-2 text-gray-400 text-xs">recent</p>
      <div className="mt-auto w-full">
        {/* 설정 메뉴 */}
        <div className="flex items-center gap-2 px-1  text-[#C3C3C3] hover:text-[#7E6363] cursor-pointer">
            <Image src="/icons/setting.svg" alt="설정" width={16} height={16} />
            <span className="text-sm">설정</span>
        </div>

        {/* 구분선 */}
        <hr className="border-t border-dashed border-[#C3C3C3] my-4" />

        {/* 사용자 정보 */}
        <div className="flex items-center gap-3 py-2">
            <div className="w-9 h-9 text-[#C3C3C3]">
                <UserCircle size={36} />
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#4C4C4C]">김단원</span>
                <span className="text-xs text-[#C3C3C3]">바이올린 1</span>
            </div>
        </div>
        </div>
    </aside>
  );
}
