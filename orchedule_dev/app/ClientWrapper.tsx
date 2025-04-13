'use client';

import { usePathname } from 'next/navigation';
import BottomNav from '../components/BottomNav';
import MobileHeader from '../components/MobileHeader';
import DesktopHeader from '../components/DesktopHeader';
import { ReactNode } from 'react';

export default function ClientWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isMainPage = pathname === '/' || pathname === '/menu';

  return (
    <div className="flex-1 flex flex-col">
      {/* 헤더 */}
      <header className={`sticky top-0 z-20 ${isMainPage ? 'bg-[#FAF9F6]' : 'bg-white'}`}>
        <div className="md:hidden">
          <MobileHeader />
        </div>
        <div className="hidden md:block">
          <DesktopHeader />
        </div>
      </header>

      {/* 콘텐츠 */}
      <main className="flex-1 p-3 pb-20  bg-[#FAF9F6] md:pt-16 md:px-4 md:py-4 md:bg-[#FAF9F6]">
        {children}
      </main>

      {/* 모바일 하단 네비 */}
      <div className="block md:hidden bg-white border-t border-gray-200">
        <BottomNav />
      </div>
    </div>
  );
}
