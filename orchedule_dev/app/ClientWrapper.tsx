'use client';

import { usePathname } from 'next/navigation';
import BottomNav from '../components/BottomNav';
import MobileHeader from '../components/MobileHeader';
import DesktopHeader from '../components/DesktopHeader';
import SectionTabs from '../components/SectionTabs';
import { ReactNode, useEffect, useState } from 'react';

const noticeTabs = [
  { name: '공지사항', href: '/menu/notice/announcement' },
  { name: '연습 일정', href: '/menu/notice/schedule' },
  { name: '자리 배치', href: '/menu/notice/seatNoti' },
  { name: '단원 명단', href: '/menu/notice/member' },
];

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
  const showNoticeTabs =
    pathname.startsWith('/menu/notice') &&
    !pathname.startsWith('/menu/notice/announcement/') &&
    pathname.split('/').length <= 4;

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

        {/* ✅ 모바일일 때만 탭 보여줌 */}
        {isMobile && showNoticeTabs && (
          <div className="bg-[#FAF9F6] px-4 pt-6 pb-1">
            <SectionTabs tabs={noticeTabs} />
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
