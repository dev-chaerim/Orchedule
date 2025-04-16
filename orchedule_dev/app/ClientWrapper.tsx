'use client';

import { usePathname } from 'next/navigation';
import BottomNav from '../components/BottomNav';
import MobileHeader from '../components/MobileHeader';
import DesktopHeader from '../components/DesktopHeader';
import SectionTabs from '../components/SectionTabs';
import { ReactNode, useEffect, useState } from 'react';
import { noticeTabs, attendanceTabs, scoreTabs } from '@/constants/sectionTabs';

export default function ClientWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const isMainPage = pathname === '/' || pathname === '/menu';

  // 어떤 섹션인지 판단
  let tabsToShow = null;

  if (pathname.startsWith('/menu/notice')) {
    const isDetail = pathname.startsWith('/menu/notice/announcement/') && pathname.split('/').length > 4;
    if (!isDetail) tabsToShow = noticeTabs;
  }

  if (pathname.startsWith('/menu/attendance')) {
    tabsToShow = attendanceTabs;
  }

  if (pathname.startsWith('/menu/sheetmusic')) {
    tabsToShow = scoreTabs;
  }

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

        {/* ✅ 모바일에서만 탭 노출 */}
        {isMobile && tabsToShow && (
          <div className="bg-[#FAF9F6] px-6 pt-6 pb-1">
            <SectionTabs tabs={tabsToShow} />
          </div>
        )}
      </header>

      {/* 콘텐츠 */}
      <main className="flex-1 p-3 pb-20 bg-[#FAF9F6] md:pt-16 md:px-4 md:py-4 md:bg-[#FAF9F6] overflow-visible">
        {children}
      </main>

      {/* 모바일 하단 네비 */}
      <div className="block md:hidden bg-white border-t border-gray-200">
        <BottomNav />
      </div>
    </div>
  );
}
