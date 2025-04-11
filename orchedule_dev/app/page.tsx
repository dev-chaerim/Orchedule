import DesktopHeader from "../components/DesktopHeader";
import HomeQuickButtons from "../components/HomeQuickButtons";
import MobileHeader from "../components/MobileHeader";
import { NoticeList, ScheduleList } from "../components/NoticeScheduleList";
import SheetPreviewList from "../components/SheetPreviewList";

export default function Page() {
  return (
    <div className="relative">
      <div className="sticky top-0 z-20 bg-[#FAF9F6] md:hidden">
        {/* 모바일 헤더 (상단) */}
          <MobileHeader />

        {/* 상단 퀵 버튼 */}
        <HomeQuickButtons/>
      </div>

      {/* 데스크탑 헤더 아이콘 (상단 고정) */}
      <DesktopHeader />

      {/* 본문 콘텐츠 */}
      <div className="p-5 pt-7 md:pt-14">
        <ScheduleList/>
        <NoticeList/>
        <SheetPreviewList/>
      </div>
    </div>
  );
}
