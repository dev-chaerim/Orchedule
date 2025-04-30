"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Notice {
  _id: string;
  title: string;
  date: string;
  pinned: boolean;
  content: string;
  author: string;
  isNew: boolean;
}

export default function NoticeListPage() {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/notices");
      const data = await res.json();
      setNotices(data);
    };
    fetchData();
  }, []);

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
    <div className="space-y-3">
      {sortedNotices.map((notice) => (
        <Link
          key={notice._id}
          href={`/menu/notice/announcement/${notice._id}`}
          className="block bg-white p-4 rounded-lg shadow-sm hover:bg-gray-50 transition"
        >
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-1">
              {notice.pinned && <span>📌</span>}
              <h3 className="font-semibold text-sm">
                {notice.title}
                {notice.isNew && (
                  <span className="ml-2 relative -top-[1px] inline-flex items-center justify-center bg-red-500 text-white text-[9px] px-2 py-[2px] rounded-full leading-none h-[16px] min-w-[30px]">
                    NEW
                  </span>
                )}
              </h3>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">
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
