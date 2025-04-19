'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import BottomNav from '../components/BottomNav';
import MobileHeader from '../components/MobileHeader';
import DesktopHeader from '../components/DesktopHeader';
import SectionTabs from '../components/SectionTabs';
import { noticeTabs, attendanceTabs, scoreTabs } from '@/constants/sectionTabs';
import { AttendanceProvider, useAttendance } from '@/context/AttendanceContext';
import { FilterChips } from '@/components/attendance/FilterChips';

export default function ClientWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isMain = pathname === '/' || pathname === '/menu';

  let tabsToShow: { name: string; href: string }[] | null = null;
  if (pathname.startsWith('/menu/notice')) {
    const isDetail = pathname.startsWith('/menu/notice/announcement/') && pathname.split('/').length > 4;
    if (!isDetail) tabsToShow = noticeTabs;
  } else if (pathname.startsWith('/menu/attendance')) {
    tabsToShow = attendanceTabs;
  } else if (pathname.startsWith('/menu/sheetmusic')) {
    tabsToShow = scoreTabs;
  }

  function StickyFilter() {
    const { families, selectedFamily, setSelectedFamily } = useAttendance();
    return (
      <div className="bg-[#FAF9F6] px-6 pt-4 pb-2">
        <div className="flex justify-center">
          <FilterChips
            families={families}
            selected={selectedFamily}
            onSelect={setSelectedFamily}
          />
        </div>
      </div>
    );
  }

  const layout = (
    <div className="flex-1 flex flex-col">
      {/* 1) 헤더 */}
      <header className={`sticky top-0 z-30 ${isMain ? 'bg-[#FAF9F6]' : 'bg-white'}`}>
        <div className="md:hidden">
          <MobileHeader />
        </div>
        <div className="hidden md:block md:bg-[#FAF9F6] md:pb-15">
          <DesktopHeader />
        </div>

        {/* 2) 섹션탭 */}
        {tabsToShow && (
          <div className="bg-[#FAF9F6] px-6 pt-4 pb-1 md:pt-9">
            <SectionTabs tabs={tabsToShow} />
          </div>
        )}

        {/* 3) 출석현황 전용 필터칩 */}
        {pathname === '/menu/attendance/status' && <StickyFilter />}
      </header>

      {/* 4) 본문 */}
      <main className="flex-1 overflow-visible bg-[#FAF9F6] p-3 md:pt-4 md:px-4">
        {children}
        <div className="h-20" /> {/* 하단 여백 확보 */}
      </main>

      {/* 5) 모바일 하단 네비 */}
      <div className="block md:hidden">
        <BottomNav />
      </div>
    </div>
  );

  return pathname.startsWith('/menu/attendance')
    ? <AttendanceProvider>{layout}</AttendanceProvider>
    : layout;
}
