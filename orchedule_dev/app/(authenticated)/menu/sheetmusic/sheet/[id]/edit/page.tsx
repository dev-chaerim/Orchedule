"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/user";
import ConfirmModal from "@/components/modals/ConfirmModal";
import ImageUploader from "@/components/common/ImageUploader";
import { UploadResult } from "@/lib/utils/uploadFileToCloudinary";
import { parts as partOptions } from "@/constants/parts";

export default function SeasonSheetEditPage() {
  const router = useRouter();
  const { id } = useParams();
  const user = useUserStore((state) => state.user);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [parts, setParts] = useState<string[]>([]);
  const [date, setDate] = useState(""); // 유지용
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/season-scores/${id}`);
      if (!res.ok) return alert("악보를 불러올 수 없습니다.");
      const data = await res.json();

      setTitle(data.title);
      setContent(data.content);
      setAttachments(data.attachments || []);
      setParts(data.parts || []);
      setDate(data.date); // 유지
    };

    if (id) fetchData();
  }, [id]);

  const togglePart = (part: string) => {
    setParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
    );
  };

  const toggleAllParts = () => {
    if (parts.length === partOptions.length) {
      setParts([]);
    } else {
      setParts(partOptions.map((p) => p.key));
    }
  };

  const handleUpload = (file: UploadResult) => {
    setAttachments((prev) => [...prev, file.url]);
  };

  const handleRemoveAttachment = (url: string) => {
    setAttachments((prev) => prev.filter((item) => item !== url));
  };

  const handleConfirmSubmit = async () => {
    const res = await fetch(`/api/season-scores/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        attachments,
        parts,
        author: user?.name,
        date, // 그대로 유지
      }),
    });

    if (!res.ok) throw new Error("수정 실패");

    router.push("/menu/sheetmusic/sheet");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }
    setShowConfirm(true);
  };

  if (user?.role !== "admin") {
    return (
      <div className="p-6 text-sm text-gray-500">접근 권한이 없습니다.</div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
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

        {/* ImageUploader */}
        <ImageUploader onUpload={handleUpload} />

        {/* 기존 첨부된 이미지/파일 미리보기 + 삭제 */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {attachments.map((url, idx) => (
              <div key={idx} className="relative">
                <img
                  src={url}
                  alt={`첨부파일 ${idx + 1}`}
                  className="w-24 h-24 object-cover rounded-md border border-[#D5CAC3]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(url)}
                  className="absolute top-1 right-1 text-xs bg-red-50 text-red-400 px-1 rounded hover:bg-red-100"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 파트 선택 */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-[#3E3232]">파트 선택</p>
          <div className="flex flex-wrap gap-2">
            {/* 전체 선택 버튼 */}
            <button
              type="button"
              onClick={toggleAllParts}
              className={`px-3 py-1 rounded-full text-sm border transition ${
                parts.length === partOptions.length
                  ? "bg-[#7E6363] text-white border-[#7E6363]"
                  : "bg-white text-[#7E6363] border-[#D5CAC3]"
              }`}
            >
              전체 선택
            </button>

            {/* 개별 파트 선택 */}
            {partOptions.map((part) => (
              <button
                key={part.key}
                type="button"
                onClick={() => togglePart(part.key)}
                className={`px-3 py-1 rounded-full text-sm border transition ${
                  parts.includes(part.key)
                    ? "bg-[#7E6363] text-white border-[#7E6363]"
                    : "bg-white text-[#7E6363] border-[#D5CAC3]"
                }`}
              >
                {part.label}
              </button>
            ))}
          </div>
        </div>

        {/* 수정하기 버튼 */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-[#7E6363] text-white px-5 py-2 text-sm rounded-md hover:bg-[#5c4f4f]"
          >
            수정하기
          </button>
        </div>
      </form>

      {/* ConfirmModal */}
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
