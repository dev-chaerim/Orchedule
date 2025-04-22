"use client";

import { use } from "react";
import { notFound, useRouter } from "next/navigation";
import { mockNotices } from "@/lib/mock/notices";
import BackButton from "@/components/BackButton";
import Link from "next/link";
import { useUserStore } from "@/lib/store/user";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function NoticeDetailPage({ params }: Props) {
  const { id } = use(params);
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  const notice = mockNotices.find((n) => n.id.toString() === id);
  if (!notice) return notFound();

  const handleDelete = () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      // 실제 삭제 API 요청이 들어갈 부분 (현재는 mock 데이터라 생략)
      console.log("🗑️ 삭제된 공지 ID:", notice.id);
      router.replace("/admin/notice");
    }
  };

  return (
    <div className="p-3 space-y-4">
      <BackButton fallbackHref="/menu/notice/announcement" label="목록" />

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
        <div className="flex justify-between items-start">
          <h1 className="text-lg font-bold text-[#3E3232]">{notice.title}</h1>

          {user?.role === "admin" && (
            <div className="flex gap-2">
              <Link href={`/admin/notice/${notice.id}/edit`}>
                <button className="text-xs font-semibold bg-[#F4ECE7] text-[#3E3232] font-medium px-3 py-1 rounded-md hover:bg-[#e3dcd7] transition">
                  수정
                </button>
              </Link>
              <button
                onClick={handleDelete}
                className="text-xs font-semibold bg-red-50 text-red-400 font-medium px-3 py-1 rounded-md hover:bg-red-100 transition"
              >
                삭제
              </button>
            </div>
          )}
        </div>

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
