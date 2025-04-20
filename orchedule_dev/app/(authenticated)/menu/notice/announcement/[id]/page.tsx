"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { mockNotices } from "@/lib/mock/notices";
import BackButton from "@/components/BackButton";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function NoticeDetailPage({ params }: Props) {
  const { id } = use(params); // ✅ React 19 기준 Promise 언래핑

  const notice = mockNotices.find((n) => n.id.toString() === id);
  if (!notice) return notFound();

  return (
    <div className="p-3 space-y-4">
      {/* 뒤로가기 버튼 */}
      <BackButton fallbackHref="/menu/notice/announcement" label="목록" />

      {/* 본문 박스 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
        <h1 className="text-lg font-bold">{notice.title}</h1>
        <div className="text-sm text-gray-500">
          {notice.date} · {notice.author}
        </div>
        <p className="text-sm text-gray-800 whitespace-pre-line">
          {notice.content}
        </p>
      </div>
    </div>
  );
}
