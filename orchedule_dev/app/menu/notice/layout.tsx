'use client';

import SectionTabs from "../../../components/SectionTabs";
import { usePathname } from "next/navigation";

const noticeTabs = [
  { name: '공지사항', href: '/menu/notice/announcement' },
  { name: '연습 일정', href: '/menu/notice/schedule' },
  { name: '자리 배치', href: '/menu/notice/seatNoti' },
  { name: '단원 명단', href: '/menu/notice/member' },
];

export default function NoticeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideTabs =
    pathname?.startsWith('/menu/notice/announcement/') && pathname.split('/').length > 4;

  return (
    <div>
      {/* ✅ 데스크탑에서만 탭 보이게 */}
      {!hideTabs && (
        <div className="hidden md:block px-4 pt-4">
          <SectionTabs tabs={noticeTabs} />
        </div>
      )}

      <div
        className={`px-4 ${hideTabs ? 'pt-2' : 'mt-4 pt-1'} min-h-[calc(100vh-200px)]`}
      >
        {children}
      </div>
    </div>
  );
}
