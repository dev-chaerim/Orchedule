"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserStore } from "@/lib/store/user";
import { useSeasonStore } from "@/lib/store/season";
import { orderedParts, partLabels, PartKey } from "@/constants/parts";
import ImageUploader from "@/components/common/ImageUploader";
import ConfirmModal from "@/components/modals/ConfirmModal";
import PDFPreview from "@/components/common/PDFPreview";
import ImagePreview from "@/components/common/ImagePreview";
import type { AttachmentInput } from "@/src/lib/types/sheet";
import type { UploadResult } from "@/lib/utils/uploadFileToCloudinary";

export default function SheetScoreCheckCreatePage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const selectedSeason = useSeasonStore((state) => state.selectedSeason);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<AttachmentInput[]>([]);
  const [selectedParts, setSelectedParts] = useState<PartKey[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const togglePart = (part: PartKey) => {
    setSelectedParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
    );
  };

  const toggleSelectAll = () => {
    if (selectedParts.length === orderedParts.length) {
      setSelectedParts([]);
    } else {
      setSelectedParts([...orderedParts]);
    }
  };

  const handleConfirmSubmit = async () => {
    try {
      const res = await fetch("/api/score-checks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seasonId: selectedSeason?._id,
          title,
          content,
          attachments,
          parts: selectedParts,
          author: user?.name,
          date: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("서버 응답:", error);
        throw new Error("등록 실패");
      }

      router.push("/menu/sheetmusic/bowing");
    } catch (err) {
      console.error("악보 등록 실패:", err);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("제목과 설명은 필수입니다.");
      return;
    }
    setShowConfirm(true);
  };

  const handleUploadComplete = (file: UploadResult) => {
    setAttachments((prev) => [...prev, file]);
  };

  const handleDelete = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  if (user?.role !== "admin") {
    return (
      <div className="p-6 text-sm text-gray-500">접근 권한이 없습니다.</div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 space-y-4">
      <h1 className="text-xl font-bold text-[#3E3232]">악보 등록</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-[#D5CAC3] rounded-md px-4 py-2 text-sm"
        />
        <textarea
          placeholder="설명"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="w-full border border-[#D5CAC3] rounded-md px-4 py-2 text-sm"
        />

        {/* ImageUploader 추가 */}
        <ImageUploader onUpload={handleUploadComplete} />

        {/* 첨부파일 프리뷰 */}
        {attachments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {attachments.map((file, i) =>
              file.type === "application/pdf" ? (
                <PDFPreview
                  key={i}
                  publicId={file.publicId}
                  pageCount={file.pageCount ?? 1}
                  pdfUrl={file.url}
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
        )}

        {/* 파트 선택 */}
        <div className="space-y-3 pt-2">
          <p className="text-sm font-semibold text-[#3E3232]">파트 선택</p>
          <div className="mb-2">
            <button
              type="button"
              onClick={toggleSelectAll}
              className={`px-3 py-1 rounded-full text-sm border transition ${
                selectedParts.length === orderedParts.length
                  ? "bg-[#7E6363] text-white border-[#7E6363]"
                  : "bg-white text-[#7E6363] border-[#D5CAC3]"
              }`}
            >
              {selectedParts.length === orderedParts.length
                ? "전체 해제"
                : "전체 선택"}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {orderedParts.map((part) => (
              <button
                key={part}
                type="button"
                onClick={() => togglePart(part)}
                className={`px-3 py-1 rounded-full text-sm border transition ${
                  selectedParts.includes(part)
                    ? "bg-[#7E6363] text-white border-[#7E6363]"
                    : "bg-white text-[#7E6363] border-[#D5CAC3]"
                }`}
              >
                {partLabels[part]}
              </button>
            ))}
          </div>
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

      <ConfirmModal
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirmSubmit}
        message="이 악보를 등록하시겠습니까?"
        confirmLabel="등록"
        successMessage="악보가 등록되었습니다."
        errorMessage="등록 중 오류가 발생했습니다."
      />
    </main>
  );
}
