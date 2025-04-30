"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, notFound } from "next/navigation";
import BackButton from "@/components/BackButton";
import Link from "next/link";
import { useUserStore } from "@/lib/store/user";

interface Notice {
  _id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  pinned: boolean;
  isNew: boolean;
  season: string;
  isGlobal: boolean;
}

export default function NoticeDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await fetch(`/api/notices/${id}`);
        if (!res.ok) throw new Error("공지 없음");
        const data = await res.json();
        setNotice(data);
      } catch (err) {
        console.error("공지 조회 실패:", err);
        router.replace("/menu/notice/announcement");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchNotice();
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`/api/notices/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("삭제 실패");
      router.replace("/admin/notice");
    } catch (err) {
      alert("삭제 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-sm text-gray-500">불러오는 중...</div>
    );
  }

  if (!notice) return notFound();

  return (
    <div className="p-3 space-y-4">
      <BackButton fallbackHref="/menu/notice/announcement" label="목록" />

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
        <div className="flex justify-between items-start">
          <h1 className="text-lg font-bold text-[#3E3232]">{notice.title}</h1>

          {user?.role === "admin" && (
            <div className="flex gap-2">
              <Link href={`/admin/notice/${notice._id}/edit`}>
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
