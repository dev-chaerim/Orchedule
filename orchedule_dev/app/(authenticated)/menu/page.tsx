"use client";

import MenuCategoryCard from "../../../components/ui/MenuCategoryCard";

interface MenuItem {
  label: string;
  href: string;
}

interface MenuCategoryCardProps {
  icon: string;
  title: string;
  items: MenuItem[];
}

export default function MenuPage() {
  const menuGroups: MenuCategoryCardProps[] = [
    {
      icon: "/icons/notice-active.svg",
      title: "알림",
      items: [
        { label: "공지사항", href: "menu/notice/announcement" },
        { label: "연습일정", href: "menu/notice/schedule" },
        { label: "자리배치", href: "menu/notice/seatNoti" },
        { label: "단원명단", href: "menu/notice/member" },
      ],
    },
    {
      icon: "/icons/attendance-active.svg",
      title: "출석",
      items: [
        { label: "출석부", href: "/menu/attendance/check" },
        { label: "출석현황", href: "/menu/attendance/status" },
        { label: "나의출석", href: "/menu/attendance/my-atd" },
      ],
    },
    {
      icon: "/icons/sheet-active.svg",
      title: "악보",
      items: [
        { label: "시즌 악보", href: "/menu/sheetmusic/sheet" },
        { label: "악보 체크", href: "/menu/sheetmusic/bowing" },
      ],
    },
  ];

  return (
    <div className="space-y-4 px-4 py-3">
      {menuGroups.map((group) => (
        <MenuCategoryCard
          key={group.title}
          icon={group.icon}
          title={group.title}
          items={group.items}
        />
      ))}
    </div>
  );
}
