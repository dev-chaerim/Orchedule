// import DesktopHeader from "../components/DesktopHeader";
import HomeQuickButtons from "../../components/home/HomeQuickButtons";
import { NoticeList } from "../../components/home/NoticeList";
import ScheduleList from "@/components/home/ScheduleList";
import SheetPreviewList from "../../components/home/SheetPreviewList";

export default function Page() {
  return (
    <div className="relative">
      {/* 상단 퀵 버튼 - 홈 전용 */}
      <div className="md:hidden px-2 pt-1 pb-1">
        <HomeQuickButtons />
      </div>

      {/* 본문 콘텐츠 */}
      <div className="p-1 pt-7 pb-20 md:pt-3">
        <ScheduleList />
        <NoticeList />
        <SheetPreviewList />
      </div>
    </div>
  );
}
