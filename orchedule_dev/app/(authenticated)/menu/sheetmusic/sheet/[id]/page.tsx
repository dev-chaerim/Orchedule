"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import { useUserStore } from "@/lib/store/user";
import ConfirmModal from "@/components/modals/ConfirmModal";

interface Sheet {
  _id: string;
  title: string;
  date: string; // ISO 형식
  author: string;
  content: string;
  fileUrl: string;
  youtubeUrl?: string;
  tags: string[];
}

export default function SeasonSheetDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchSheet = async () => {
      try {
        const res = await fetch(`/api/scores/${id}`);
        if (!res.ok) throw new Error("악보를 찾을 수 없습니다.");
        const data = await res.json();
        setSheet(data);
      } catch (err) {
        console.error(err);
        router.push("/menu/sheetmusic/sheet");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSheet();
  }, [id, router]);

  const handleDelete = async () => {
    const res = await fetch(`/api/scores/${sheet?._id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("삭제 실패");
    router.push("/menu/sheetmusic/sheet");
  };

  if (loading) {
    return (
      <div className="text-center text-sm text-gray-500">불러오는 중...</div>
    );
  }

  if (!sheet) {
    return (
      <div className="text-center text-sm text-gray-500">
        악보를 찾을 수 없습니다.
      </div>
    );
  }

  const formattedDate = new Date(sheet.date).toLocaleString("ko-KR");

  return (
    <div className="space-y-6 px-4 max-w-3xl mx-auto py-4">
      <BackButton fallbackHref="/menu/sheetmusic/sheet" label="목록" />

      <div className="px-2">
        <div className="flex justify-between items-start">
          <h1 className="text-lg font-bold mb-1">{sheet.title}</h1>

          {user?.name === sheet.author && (
            <div className="flex gap-2">
              <button
                onClick={() =>
                  router.push(`/menu/sheetmusic/sheet/${sheet._id}/edit`)
                }
                className="text-xs font-semibold bg-[#F4ECE7] text-[#3E3232] px-3 py-1 rounded-md hover:bg-[#e3dcd7] transition"
              >
                수정
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-xs font-semibold bg-red-50 text-red-400 px-3 py-1 rounded-md hover:bg-red-100 transition"
              >
                삭제
              </button>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-400">
          {formattedDate} · {sheet.author}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <div className="whitespace-pre-line text-sm text-gray-700">
          {sheet.content || "파트보를 확인해주세요."}
        </div>

        <a
          href={sheet.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 bg-[#7E6363] text-white text-sm px-4 py-2 rounded-md hover:bg-[#5c4f4f] transition"
        >
          <span>📄</span> 악보 다운로드
        </a>

        {sheet.youtubeUrl && (
          <div>
            <a
              href={sheet.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 text-sm hover:underline"
            >
              ▶️ 참고 영상 보기
            </a>
          </div>
        )}
      </div>

      <ConfirmModal
        open={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        message="정말 삭제하시겠습니까?"
        confirmLabel="삭제"
        confirmColor="red"
        successMessage="삭제되었습니다."
        errorMessage="삭제 중 오류가 발생했습니다."
      />
    </div>
  );
}
