"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import BottomNav from "../../components/layout/BottomNav";
import MobileHeader from "@/components/layout/MobileHeader";
import DesktopHeader from "@/components/layout/DesktopHeader";
import SectionTabs from "../../components/layout/SectionTabs";
import { noticeTabs, attendanceTabs, scoreTabs } from "@/constants/sectionTabs";
import { AttendanceProvider } from "@/context/AttendanceContext";
// import { FilterChips } from "@/components/attendance/FilterChips";
import { useUserStore } from "@/lib/store/user";
import { useSearchStore } from "@/lib/store/search";
import SearchOverlay from "@/components/search/SearchOverlay";

export default function ClientWrapper({ children }: { children: ReactNode }) {
  const login = useUserStore((state) => state.login);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  const { isOpen, close } = useSearchStore();

  console.log("ClientWrapper 렌더링");

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        const data = await res.json();
        if (data.success) {
          login(data.user);
        }
      } catch (err) {
        console.error("사용자 정보 불러오기 실패", err);
      } finally {
        setIsUserLoaded(true);
      }
    }

    fetchUser();
  }, [login]);

  const pathname = usePathname();
  const isMain = pathname === "/" || pathname === "/menu";

  if (!isUserLoaded) return null;

  let tabsToShow: { name: string; href: string }[] | null = null;
  if (pathname.startsWith("/menu/notice")) {
    const isDetail =
      pathname.startsWith("/menu/notice/announcement/") &&
      pathname.split("/").length > 4;
    if (!isDetail) tabsToShow = noticeTabs;
  } else if (pathname.startsWith("/menu/attendance")) {
    tabsToShow = attendanceTabs;
  } else if (pathname.startsWith("/menu/sheetmusic")) {
    tabsToShow = scoreTabs;
  }

  // function StickyFilter() {
  //   const { families, selectedFamily, setSelectedFamily } = useAttendance();
  //   return (
  //     <div className="bg-[#FAF9F6] px-6 pt-4 pb-2">
  //       <div className="flex justify-center">
  //         <FilterChips
  //           families={families}
  //           selected={selectedFamily}
  //           onSelect={setSelectedFamily}
  //         />
  //       </div>
  //     </div>
  //   );
  // }

  const layout = (
    <div className="flex-1 flex flex-col">
      {/* 1) 헤더 */}
      <header
        className={`sticky top-0 z-30 ${isMain ? "bg-[#FAF9F6]" : "bg-white"}`}
      >
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
        {/* {pathname === "/menu/attendance/status" && <StickyFilter />} */}
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

  return pathname.startsWith("/menu/attendance") ? (
    <AttendanceProvider>
      <>
        {layout}
        <SearchOverlay isOpen={isOpen} onClose={close} /> {/* ✅ 여기 */}
      </>
    </AttendanceProvider>
  ) : (
    <>
      {layout}
      <SearchOverlay isOpen={isOpen} onClose={close} /> {/* ✅ 여기 */}
    </>
  );
}
