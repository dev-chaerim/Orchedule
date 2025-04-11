import SectionTabs from "../../../components/SectionTabs";

const noticeTabs = [
  { name: '공지사항', href: '/menu/notice/announcement' },
  { name: '연습 일정', href: '/menu/notice/schedule' },
  { name: '자리 배치', href: '/menu/notice/seatNoti' },
  { name: '단원 명단', href: '/menu/notice/member' },
];

export default function NoticeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4">
      <SectionTabs tabs={noticeTabs} />
      {children}
    </div>
  );
}
