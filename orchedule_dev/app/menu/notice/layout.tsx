// app/menu/notice/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import clsx from 'clsx'; // tailwind에서 조건부 클래스 처리에 유용

const tabs = [
  { name: '공지사항', href: '/menu/notice/announce' },
  { name: '연습 일정', href: '/menu/notice/schedule' },
  { name: '자리 배치', href: '/menu/notice/seatNoti' },
  { name: '단원 명단', href: '/menu/notice/member' },
];

export default function NoticeLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="p-4">
      {/* 탭 바 */}
      <div className="flex gap-4 mb-4 border-b pb-2">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={clsx(
              'text-sm font-medium',
              pathname === tab.href
                ? 'text-[#3E3232] border-b-2 border-[#3E3232]'
                : 'text-gray-400'
            )}
          >
            {tab.name}
          </Link>
        ))}
      </div>

      {/* 하위 탭 콘텐츠 */}
      <div>{children}</div>
    </div>
  );
}
