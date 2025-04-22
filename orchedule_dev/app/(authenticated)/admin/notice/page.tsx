"use client";

import Link from "next/link";
import { useState } from "react";
import { mockNotices } from "@/lib/mock/notices";
import { useRouter } from "next/navigation";

export default function AdminNoticePage() {
  const [notices, setNotices] = useState(mockNotices);
  const router = useRouter();

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // 클릭 버블링 방지
    if (confirm("정말 삭제하시겠습니까?")) {
      setNotices(notices.filter((n) => n.id !== id));
    }
  };

  const handleEdit = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // 클릭 버블링 방지
    router.push(`/admin/notice/${id}/edit`);
  };

  const handleItemClick = (id: number) => {
    router.push(`/menu/notice/announcement/${id}`);
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-[#3E3232]">공지 관리</h1>
        <Link href="/admin/notice/new">
          <button className="bg-[#F4ECE7] text-[#3E3232] text-sm font-medium px-4 py-2 rounded-md hover:bg-[#e3dcd7]">
            + 공지 작성
          </button>
        </Link>
      </div>

      <ul className="space-y-3">
        {notices.map((notice) => (
          <li
            key={notice.id}
            onClick={() => handleItemClick(notice.id)}
            className="bg-white border border-[#E0D6CD] rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-[#faf7f3]"
          >
            <div>
              <h3 className="text-sm font-semibold text-[#3E3232]">
                {notice.pinned && <span className="mr-1">📌</span>}
                {notice.title}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {notice.date} · {notice.author}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={(e) => handleEdit(notice.id, e)}
                className="text-xs font-semibold bg-[#F4ECE7] text-[#3E3232] px-3 py-1 rounded-md hover:bg-[#e3dcd7] transition"
              >
                수정
              </button>
              <button
                onClick={(e) => handleDelete(notice.id, e)}
                className="text-xs font-semibold bg-red-50 text-red-400 px-3 py-1 rounded-md hover:bg-red-100 transition"
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
