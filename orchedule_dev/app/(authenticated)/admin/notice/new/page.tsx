"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSeasonStore } from "@/lib/store/season";
import ImageUploader from "@/components/common/ImageUploader";
import ImagePreview from "@/components/common/ImagePreview";
import ConfirmModal from "@/components/modals/ConfirmModal";
import PDFPreview from "@/components/common/PDFPreview";
import { UploadResult } from "@/lib/utils/uploadFileToCloudinary";

export default function CreateNoticePage() {
  const router = useRouter();
  const { selectedSeason } = useSeasonStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isGlobal, setIsGlobal] = useState(false);
  const [pinned, setPinned] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadResult[]>([]);

  // ✅ 파일 삭제
  const handleFileDelete = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ 실제 등록 요청 함수 (모달의 onConfirm에서 실행)
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    if (!selectedSeason?._id) {
      alert("시즌 정보를 불러오지 못했습니다.");
      return;
    }

    try {
      const res = await fetch("/api/notices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          season: selectedSeason._id,
          isGlobal,
          pinned,
          date: new Date().toISOString().split("T")[0],
          author: "관리자",
          isNew: true,
          attachments: uploadedFiles,
        }),
      });

      if (!res.ok) throw new Error("등록 실패");

      router.push("/admin/notice");
    } catch (err) {
      alert("공지 등록 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  // ✅ 모달 띄우기만 (폼 제출 시)
  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4 text-[#3E3232]">공지 작성</h1>

      {/* ✅ 체크박스 */}
      <div className="flex items-center gap-4 mb-3">
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

      {/* ✅ 작성 폼 */}
      <form onSubmit={handleConfirm} className="space-y-4">
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-[#D5CAC3] rounded-md px-4 py-2 text-sm focus:outline-[#7E6363]"
        />

        <textarea
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full border border-[#D5CAC3] rounded-md px-4 py-2 text-sm focus:outline-[#7E6363]"
        />

        {/* ✅ 파일 업로더 */}
        <ImageUploader
          onUpload={(file) => setUploadedFiles((prev) => [...prev, file])}
        />

        {/* ✅ 파일 프리뷰 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {uploadedFiles.map((file, i) =>
            file.type === "application/pdf" ? (
              <PDFPreview
                key={i}
                url={file.url}
                publicId={file.publicId}
                onDelete={() => handleFileDelete(i)}
              />
            ) : (
              <ImagePreview
                key={i}
                src={file.url}
                onDelete={() => handleFileDelete(i)}
              />
            )
          )}
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-[#7E6363] text-white px-5 py-2 text-sm rounded-md hover:bg-[#5c4f4f]"
          >
            등록하기
          </button>
        </div>
      </form>

      {/* ✅ 확인 모달 */}
      <ConfirmModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleSubmit}
        message="공지 등록을 완료하시겠습니까?"
        confirmLabel="저장하기"
      />
    </main>
  );
}
