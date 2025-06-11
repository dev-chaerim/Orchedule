"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MoreLink from "../MoreLink";
import LoadingSkeleton from "../common/LoadingSkeleton";
import { isNew } from "@/src/lib/utils/isNew";
import NewBadge from "../common/NewBadge";

interface Notice {
  _id: string;
  title: string;
  date: string;
  pinned: boolean;
}

export function NoticeList() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch("/api/notices");
        if (!res.ok) throw new Error("공지사항 불러오기 실패");
        const data = await res.json();
        setNotices(data.slice(0, 4)); // 홈 화면에서는 최대 3개만 표시
      } catch (err) {
        console.error("공지사항 불러오기 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  return (
    <section className="px-4 py-2">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-semibold">공지 사항</h2>
        <MoreLink href="/menu/notice/announcement" />
      </div>

      {loading ? (
        <LoadingSkeleton lines={4} className="mt-2 mb-6" />
      ) : notices.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-2 space-y-1">
          <p className="text-sm text-gray-400">등록된 공지사항이 없습니다.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow p-2 space-y-1">
          {notices.map((notice) => (
            <Link
              key={notice._id}
              href={`/menu/notice/announcement/${notice._id}`}
              className="flex justify-between items-center p-1 text-sm  hover:bg-[#f8f5f1] hover:rounded-sm rounded transition"
            >
              <div className="flex items-center gap-2">
                <Image
                  src={
                    notice.pinned ? "/icons/pin-filled.svg" : "/icons/pin.svg"
                  }
                  alt="pinned"
                  width={14}
                  height={14}
                />
                <span>{notice.title}</span>
                {isNew(notice.date) && <NewBadge />}
              </div>
              <span className="text-xs text-gray-400">{notice.date}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
