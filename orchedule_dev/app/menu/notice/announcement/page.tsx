'use client';

import Link from 'next/link';
import { mockNotices } from '@/lib/mock/notices';

export default function NoticeListPage() {
  const sortedNotices = [
    ...mockNotices.filter((n) => n.pinned),
    ...mockNotices.filter((n) => !n.pinned),
  ];

  return (
    <div className="space-y-3">
      {sortedNotices.map((notice) => (
        <Link
          key={notice.id}
          href={`/menu/notice/announcement/${notice.id}`}
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
            <span className="text-xs text-gray-400 whitespace-nowrap">{notice.date}</span>
          </div>

          <p className="text-xs text-gray-600 line-clamp-2">{notice.content}</p>

          <div className="text-xs text-gray-400 mt-2">{notice.author}</div>
        </Link>
      ))}
    </div>
  );
}
