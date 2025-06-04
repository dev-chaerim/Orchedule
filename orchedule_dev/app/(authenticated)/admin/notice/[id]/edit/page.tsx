"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ImageUploader from "@/components/common/ImageUploader";
import ImagePreview from "@/components/common/ImagePreview";
import ConfirmModal from "@/components/modals/ConfirmModal";

export default function EditNoticePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [season, setSeason] = useState("2024");
  const [isGlobal, setIsGlobal] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ 기존 공지 불러오기
  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await fetch(`/api/notices/${id}`);
        if (!res.ok) throw new Error("공지사항을 불러오지 못했습니다.");

        const data = await res.json();
        setTitle(data.title);
        setContent(data.content);
        setSeason(data.season);
        setIsGlobal(data.isGlobal);
        setPinned(data.pinned);
        setImageUrls(data.imageUrls || []);
        setIsLoading(false);
        console.log("[불러온 공지]", data);
      } catch (err) {
        alert("공지 불러오기 실패");
        console.error(err);
        router.push("/admin/notice");
      }
    };

    if (id) fetchNotice();
  }, [id, router]);

  // ✅ 이미지 삭제
  const handleDelete = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ 수정 요청
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const res = await fetch(`/api/notices/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          season,
          isGlobal,
          pinned,
          imageUrls,
        }),
      });

      if (!res.ok) throw new Error("수정 실패");

      setIsModalOpen(true);
    } catch (err) {
      alert("공지 수정 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center text-sm text-gray-500">불러오는 중...</div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4 text-[#3E3232]">공지 수정</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-[#D5CAC3] rounded-md px-4 py-2 text-sm focus:outline-[#7E6363]"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full border border-[#D5CAC3] rounded-md px-4 py-2 text-sm focus:outline-[#7E6363]"
        />

        {/* ✅ 이미지 프리뷰 */}
        {imageUrls.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {imageUrls.map((url, i) => (
              <ImagePreview
                key={i}
                src={url}
                onDelete={() => handleDelete(i)}
              />
            ))}
          </div>
        )}

        {/* ✅ 이미지 업로더 */}
        <ImageUploader
          onUpload={(url) => setImageUrls((prev) => [...prev, url])}
        />

        {/* ✅ 체크박스 */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-[#3E3232]">
            <input
              type="checkbox"
              checked={isGlobal}
              onChange={(e) => setIsGlobal(e.target.checked)}
            />
            모든 시즌에 표시
          </label>

          <label className="flex items-center gap-2 text-sm text-[#3E3232]">
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
            />
            상단 고정
          </label>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-[#7E6363] text-white px-5 py-2 text-sm rounded-md hover:bg-[#5c4f4f]"
          >
            저장하기
          </button>
        </div>
      </form>

      <ConfirmModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={() => router.push("/admin/notice")}
        message="공지 수정을 완료하시겠습니까?"
        confirmLabel="목록으로 이동"
      />
    </main>
  );
}
