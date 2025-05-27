"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSeasonStore } from "@/lib/store/season";

interface Notice {
  _id: string;
  title: string;
  content: string;
  date: string;
  pinned: boolean;
  author: string;
  isNew: boolean;
  season: string;
  isGlobal: boolean;
}

export default function AdminNoticePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const selectedSeason = useSeasonStore((state) => state.selectedSeason);
  const seasonId = selectedSeason?._id;
  const router = useRouter();

  useEffect(() => {
    const fetchNotices = async () => {
      const res = await fetch("/api/notices");
      const data = await res.json();
      setNotices(data);
    };
    fetchNotices();
  }, []);

  // ✅ seasonId가 없을 경우도 유연하게 전체 보기 허용
  const filteredNotices = [
    ...notices.filter(
      (n) => n.pinned && (!seasonId || n.isGlobal || n.season === seasonId)
    ),
    ...notices.filter(
      (n) => !n.pinned && (!seasonId || n.isGlobal || n.season === seasonId)
    ),
  ];

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`/api/notices/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("삭제 실패");
      setNotices(notices.filter((n) => n._id !== id));
    } catch (err) {
      alert("삭제 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  const handleEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/admin/notice/${id}/edit`);
  };

  const handleItemClick = (id: string) => {
    router.push(`/menu/notice/announcement/${id}?from=admin`);
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

      {/* ✅ 공지 목록 or 안내 메시지 */}
      {filteredNotices.length === 0 ? (
        <p className="text-sm text-[#7e6a5c] text-center py-10 border border-dashed border-[#e0dada] rounded-md bg-[#fcfaf9]">
          공지사항이 없습니다.
        </p>
      ) : (
        <ul className="space-y-3">
          {filteredNotices.map((notice) => (
            <li
              key={notice._id}
              onClick={() => handleItemClick(notice._id)}
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
                  onClick={(e) => handleEdit(notice._id, e)}
                  className="text-xs font-semibold bg-[#F4ECE7] text-[#3E3232] px-3 py-1 rounded-md hover:bg-[#e3dcd7] transition"
                >
                  수정
                </button>
                <button
                  onClick={(e) => handleDelete(notice._id, e)}
                  className="text-xs font-semibold bg-red-50 text-red-400 px-3 py-1 rounded-md hover:bg-red-100 transition"
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
