"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MoreLink from "../MoreLink";
import LoadingSkeleton from "../common/LoadingSkeleton";
import { isNew } from "@/src/lib/utils/isNew";
import NewBadge from "../common/NewBadge";
import ErrorMessage from "../common/ErrorMessage";
import { useSeasonStore } from "@/src/lib/store/season";
import { format } from "date-fns";

interface Notice {
  _id: string;
  title: string;
  date: string;
  pinned: boolean;
}

export function NoticeList() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const selectedSeason = useSeasonStore((state) => state.selectedSeason);

  useEffect(() => {
    if (!selectedSeason?._id) return;

    const fetchNotices = async () => {
      try {
        const res = await fetch(`/api/notices?season=${selectedSeason._id}`);
        if (!res.ok) throw new Error("공지사항 불러오기 실패");
        const data = await res.json();
        setNotices(data.slice(0, 4)); // 홈 화면에서는 최대 4개만 표시
      } catch (err) {
        console.error("공지사항 불러오기 오류:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [selectedSeason?._id]);

  if (error) return <ErrorMessage />;

  return (
    <section className="px-4 py-2">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-semibold">공지 사항</h2>
        <MoreLink href="/menu/notice/announcement" />
      </div>

      {loading ? (
        <LoadingSkeleton lines={4} className="mt-2 mb-6" />
      ) : notices.length === 0 ? (
        <p className="text-sm text-[#7e6a5c] text-center py-10 border border-dashed border-[#e0dada] rounded-md bg-white">
          등록된 공지사항이 없습니다.
        </p>
      ) : (
        <div className="bg-white rounded-xl shadow p-2 space-y-1">
          {notices.map((notice) => (
            <Link
              key={notice._id}
              href={`/menu/notice/announcement/${notice._id}`}
              className="flex items-center justify-between p-1 text-sm hover:bg-[#f8f5f1] rounded transition"
            >
              {/* 왼쪽: 아이콘 + 제목 + NEW */}
              <div className="flex items-center gap-2 flex-1 overflow-hidden">
                <Image
                  src={
                    notice.pinned ? "/icons/pin-filled.svg" : "/icons/pin.svg"
                  }
                  alt="pinned"
                  width={14}
                  height={14}
                />
                <span className="text-xs truncate" title={notice.title}>
                  {notice.title}
                </span>
                {isNew(notice.date) && <NewBadge />}
              </div>

              {/* 오른쪽: 날짜 */}
              <span className="text-xs text-gray-400 shrink-0 pl-2">
                {format(new Date(notice.date), "yy-MM-dd")}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
