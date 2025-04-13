'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { mockNotices } from '@/lib/mock/notices';
import { ChevronLeft } from 'lucide-react';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function NoticeDetailPage({ params }: Props) {
  const router = useRouter();
  const { id } = use(params); // ✅ React 19 기준 Promise 언래핑

  const notice = mockNotices.find((n) => n.id.toString() === id);
  if (!notice) return notFound();

  const handleBack = () => {
    if (window.history.length > 1) router.back();
    else router.push('/menu/notice/announcement');
  };

  return (
    <div className="p-3">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={handleBack}
        className="inline-flex items-center border mb-5 bg-white border-[#e0e0e0] rounded-full px-3 py-1 text-sm text-[#7E6363] hover:bg-[#f4f0ee] transition cursor-pointer"
      >
        <ChevronLeft size={14} strokeWidth={2} className="mr-1 -ml-1" />
        공지
      </button>

      <h1 className="text-xl font-bold mb-2">{notice.title}</h1>
      <div className="text-sm text-gray-500 mb-4">
        {notice.date} | {notice.author}
      </div>
      <p className="text-base text-gray-800 whitespace-pre-line">{notice.content}</p>
    </div>
  );
}
