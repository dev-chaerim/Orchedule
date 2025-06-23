"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/user";
import { useSeasonStore } from "@/lib/store/season";
import { orderedParts, partLabels, PartKey } from "@/constants/parts";
import ImageUploader from "@/components/common/ImageUploader";
import ConfirmModal from "@/components/modals/ConfirmModal";
import ImagePreview from "@/components/common/ImagePreview";
import PDFPreview from "@/components/common/PDFPreview";
import type { AttachmentInput } from "@/src/lib/types/sheet";
import type { UploadResult } from "@/lib/utils/uploadFileToCloudinary";

export default function SheetScoreCheckEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const selectedSeason = useSeasonStore((state) => state.selectedSeason);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<AttachmentInput[]>([]);
  const [selectedParts, setSelectedParts] = useState<PartKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  // ✅ 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/score-checks/${id}`);
        const data = await res.json();
        setTitle(data.title);
        setContent(data.content);
        setAttachments(data.attachments || []);
        setSelectedParts(data.parts || []);
      } catch (err) {
        alert("데이터를 불러오지 못했습니다.");
        console.error(err);
        router.push("/menu/sheetmusic/bowing");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id, router]);

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

  const handleUploadComplete = (file: UploadResult) => {
    setAttachments((prev) => [...prev, file]);
  };

  const handleDelete = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("제목과 설명은 필수입니다.");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      const res = await fetch(`/api/score-checks/${id}`, {
        method: "PATCH",
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

      if (!res.ok) throw new Error("수정 실패");

      router.push(`/menu/sheetmusic/bowing/${id}`);
    } catch (err) {
      console.error("악보 수정 실패:", err);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px] text-[#a79c90] text-sm">
        ⏳ 데이터를 불러오는 중이에요...
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-2 space-y-4">
      <h1 className="text-xl font-bold text-[#3E3232]">악보 수정</h1>

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

        <ImageUploader onUpload={handleUploadComplete} />

        {attachments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {attachments.map((file, i) =>
              file.type === "application/pdf" ? (
                <PDFPreview
                  key={i}
                  publicId={file.publicId}
                  pdfUrl={file.url}
                  pageCount={file.pageCount ?? 1}
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
            수정하기
          </button>
        </div>
      </form>

      <ConfirmModal
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirmSubmit}
        message="이 악보를 수정하시겠습니까?"
        confirmLabel="수정"
        successMessage="악보가 수정되었습니다."
        errorMessage="수정 중 오류가 발생했습니다."
      />
    </main>
  );
}
