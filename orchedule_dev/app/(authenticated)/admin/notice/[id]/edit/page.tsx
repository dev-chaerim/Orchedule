"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { mockNotices } from "@/lib/mock/notices";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function EditNoticePage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();

  const notice = mockNotices.find((n) => n.id.toString() === id);
  if (!notice) return <div>공지사항을 찾을 수 없습니다.</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[수정 완료]", notice);
    router.push(`/menu/notice/announcement/${notice.id}`);
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4 text-[#3E3232]">공지 수정</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          defaultValue={notice.title}
          className="w-full border border-[#D5CAC3] rounded-md px-4 py-2 text-sm focus:outline-[#7E6363]"
        />
        <textarea
          defaultValue={notice.content}
          rows={10}
          className="w-full border border-[#D5CAC3] rounded-md px-4 py-2 text-sm focus:outline-[#7E6363]"
        />
        <div className="text-right">
          <button
            type="submit"
            className="bg-[#7E6363] text-white px-5 py-2 text-sm rounded-md hover:bg-[#5c4f4f]"
          >
            저장하기
          </button>
        </div>
      </form>
    </main>
  );
}
