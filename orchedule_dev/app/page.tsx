import DesktopHeader from "../components/DesktopHeader";
import HomeQuickButtons from "../components/HomeQuickButtons";
import MobileHeader from "../components/MobileHeader";

export default function Page() {
  return (
    <div className="bg-blue-100 min-h-[400px] relative">
      {/* 모바일 헤더 (상단) */}
      <MobileHeader />

      {/* 데스크탑 헤더 아이콘 (상단 고정) */}
      <DesktopHeader />

      {/* 상단 퀵 버튼 */}
      <HomeQuickButtons/>

      {/* 본문 콘텐츠 */}
      <div className="p-5 pt-20 md:pt-14">메인홈</div>
    </div>
  );
}
