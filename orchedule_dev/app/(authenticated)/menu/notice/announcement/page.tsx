"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSeasonStore } from "@/lib/store/season";
import { isNew } from "@/lib/utils/isNew";
import { useUserStore } from "@/lib/store/user";
import RegisterButton from "@/components/common/RegisterButton";
import NewBadge from "@/components/common/NewBadge";

interface Notice {
  _id: string;
  title: string;
  date: string;
  pinned: boolean;
  content: string;
  author: string;
}

export default function NoticeListPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useUserStore((state) => state.user);
  const selectedSeason = useSeasonStore((state) => state.selectedSeason);
  const seasonId = selectedSeason?._id;

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/notices${seasonId ? `?season=${seasonId}` : ""}`
        );
        const data = await res.json();
        setNotices(data);
      } catch (err) {
        console.error("공지 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [seasonId]);

  if (loading) {
    return (
      <div className="text-center text-[#a79c90] text-sm py-6">
        ⏳ 공지사항을 불러오는 중이에요...
      </div>
    );
  }

  if (notices.length === 0) {
    return (
      <div className="bg-[#fdfbf9] border border-[#e8e0d9] rounded-xl p-6 text-center w-full">
        <p className="text-sm text-[#7e6a5c] font-semibold">
          아직 등록된 공지사항이 없어요.
        </p>
        <p className="text-xs text-[#a79c90] mt-1">
          새로운 공지가 올라오면 이곳에서 확인할 수 있어요!
        </p>
      </div>
    );
  }

  const sortedNotices = [
    ...notices.filter((n) => n.pinned),
    ...notices.filter((n) => !n.pinned),
  ];

  return (
    <div className="space-y-3  -mt-2">
      {/* 관리자 전용 등록 버튼 */}
      {user?.role === "admin" && (
        <RegisterButton href="/admin/notice/new">공지 등록</RegisterButton>
      )}

      {sortedNotices.map((notice) => (
        <Link
          key={notice._id}
          href={`/menu/notice/announcement/${notice._id}`}
          className="block bg-white p-4 rounded-lg shadow-sm hover:bg-gray-50 transition"
        >
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1 max-w-[80%]">
              {notice.pinned && <span>📌</span>}
              <div className="flex items-center gap-1 font-semibold text-sm truncate">
                <span className="text-sm font-semibold truncate overflow-hidden text-ellipsis whitespace-nowrap">
                  {notice.title}
                </span>
                {isNew(notice.date) && <NewBadge />}
              </div>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap pl-2 pt-[1px]">
              {notice.date}
            </span>
          </div>

          <p className="text-xs text-gray-600 line-clamp-2">{notice.content}</p>

          <div className="text-xs text-gray-400 mt-2">{notice.author}</div>
        </Link>
      ))}
    </div>
  );
}
