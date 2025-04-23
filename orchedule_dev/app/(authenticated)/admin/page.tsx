"use client";

import Link from "next/link";

export default function AdminHome() {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-3 text-[#3E3232]">관리자 페이지</h1>
      <p className="text-sm text-[#5E4B4B]">
        공지 작성, 연습일정 등록, 단원 관리, 출석 현황 수정, 시즌 관리 등의
        기능을 이곳에서 관리할 수 있습니다.
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link href="/admin/notice">
          <button className="w-full bg-[#F4ECE7] text-[#3E3232] text-sm font-semibold py-2 px-4 rounded-xl hover:bg-[#e3dcd7] transition">
            📢 공지 관리
          </button>
        </Link>

        <Link href="/admin/schedule">
          <button className="w-full bg-[#F4ECE7] text-[#3E3232] text-sm font-semibold py-2 px-4 rounded-xl hover:bg-[#e3dcd7] transition">
            🗓️ 연습일정 관리
          </button>
        </Link>

        <Link href="/admin/members">
          <button className="w-full bg-[#F4ECE7] text-[#3E3232] text-sm font-semibold py-2 px-4 rounded-xl hover:bg-[#e3dcd7] transition">
            👥 단원 관리
          </button>
        </Link>

        <Link href="/admin/attendance">
          <button className="w-full bg-[#F4ECE7] text-[#3E3232] text-sm font-semibold py-2 px-4 rounded-xl hover:bg-[#e3dcd7] transition">
            ✅ 출석 현황 관리
          </button>
        </Link>

        <Link href="/admin/season">
          <button className="w-full bg-[#F4ECE7] text-[#3E3232] text-sm font-semibold py-2 px-4 rounded-xl hover:bg-[#e3dcd7] transition">
            📆 시즌 관리
          </button>
        </Link>
      </div>
    </main>
  );
}
