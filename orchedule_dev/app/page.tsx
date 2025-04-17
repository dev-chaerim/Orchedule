// import DesktopHeader from "../components/DesktopHeader";
import HomeQuickButtons from "../components/HomeQuickButtons";
import { NoticeList, ScheduleList } from "../components/NoticeScheduleList";
import SheetPreviewList from "../components/SheetPreviewList";

export default function Page() {
  return (
    <div className="relative">
      {/* 상단 퀵 버튼 - 홈 전용 */}
      <div className="md:hidden px-4 pt-2 pb-1">
        <HomeQuickButtons />
      </div>

      {/* 본문 콘텐츠 */}
      <div className="p-5 pt-7 pb-20 md:pt-3">
        <ScheduleList />
        <NoticeList />
        <SheetPreviewList />
      </div>
    </div>
  );
}
