"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ImageUploader from "@/components/common/ImageUploader";
import ImagePreview from "@/components/common/ImagePreview";
import PDFPreview from "@/components/common/PDFPreview";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { UploadResult } from "@/lib/utils/uploadFileToCloudinary";

export default function EditNoticePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [season, setSeason] = useState("2024");
  const [isGlobal, setIsGlobal] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [attachments, setAttachments] = useState<UploadResult[]>([]);
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
        setAttachments(data.attachments || []);
        setIsLoading(false);
      } catch (err) {
        alert("공지 불러오기 실패");
        console.error(err);
        router.push("/admin/notice");
      }
    };

    if (id) fetchNotice();
  }, [id, router]);

  // ✅ 파일 삭제
  const handleDelete = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ 모달에서 저장 확정 시 실행
  const handleConfirmSave = async () => {
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
          attachments,
        }),
      });

      if (!res.ok) throw new Error("수정 실패");

      router.push("/admin/notice");
    } catch (err) {
      alert("공지 수정 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  // ✅ 폼 제출 시 (모달 띄우기만)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setIsModalOpen(true); // 모달 먼저 띄우기
  };

  if (isLoading) {
    return (
      <div className="text-center text-sm text-gray-500">불러오는 중...</div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4 text-[#3E3232]">공지 수정</h1>

      <div className="flex items-center gap-4 mb-2">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {attachments.map((file, i) =>
            file.type === "application/pdf" ? (
              <PDFPreview
                key={i}
                publicId={file.publicId}
                pageCount={file.pageCount}
                onDelete={() => handleDelete(i)}
              />
            ) : (
              <ImagePreview
                key={i}
                src={file.url}
                onDelete={() => handleDelete(i)}
              />
            )
          )}
        </div>

        <ImageUploader
          onUpload={(file) => setAttachments((prev) => [...prev, file])}
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

      <ConfirmModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSave}
        message="공지 수정을 완료하시겠습니까?"
        confirmLabel="저장하기"
      />
    </main>
  );
}
