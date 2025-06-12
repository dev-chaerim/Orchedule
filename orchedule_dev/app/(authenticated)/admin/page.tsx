"use client";

import AdminMenuButton from "@/components/admin/AdminMenuButton";

export default function AdminHome() {
  const menus = [
    { href: "/admin/notice", label: "공지 관리", emoji: "📢" },
    { href: "/admin/schedule", label: "연습일정 관리", emoji: "🗓️" },
    { href: "/admin/member", label: "단원 관리", emoji: "👥" },
    { href: "/admin/attendance", label: "출석 현황 관리", emoji: "✅" },
    { href: "/admin/seatAssignment", label: "자리배치 관리", emoji: "🪑" },
    { href: "/admin/season", label: "시즌 관리", emoji: "📆" },
  ];

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-3 text-[#3E3232]">관리자 페이지</h1>
      <p className="text-sm text-[#5E4B4B]">
        공지 작성, 연습일정 등록, 단원 관리, 출석 현황 수정, 시즌 관리 등의
        기능을 이곳에서 관리할 수 있습니다.
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {menus.map((menu) => (
          <AdminMenuButton
            key={menu.href}
            href={menu.href}
            label={menu.label}
            emoji={menu.emoji}
          />
        ))}
      </div>
    </main>
  );
}
