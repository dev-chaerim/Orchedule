"use client";

import { X } from "lucide-react";

interface PDFPreviewProps {
  publicId: string;
  url: string;
  onDelete?: () => void;
}

export default function PDFPreview({
  publicId,
  url,
  onDelete,
}: PDFPreviewProps) {
  // 원래 파일명만 추출
  const fileName = publicId.startsWith("s3-")
    ? publicId.split("-").slice(2).join("-")
    : publicId;

  return (
    <div className="relative w-full max-w-[400px] mx-auto rounded-md overflow-hidden border border-[#D5CAC3] bg-white p-3">
      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-2 right-2 z-10 bg-[#F0E6DE] border border-[#D5CAC3] 
            rounded-full p-1 shadow-sm hover:bg-[#e2d8d0] transition-colors"
        >
          <X size={16} className="text-[#3E3232]" />
        </button>
      )}

      {/* 파일명 표시 */}
      <div className="flex flex-col items-center justify-center space-y-2 py-4">
        <div className="text-sm font-medium text-[#3E3232] truncate max-w-[90%]">
          {fileName}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(url, "_blank", "noopener,noreferrer");
          }}
          className="text-sm px-4 py-1 bg-[#e7dbd2] text-[#3E3232] font-semibold rounded-md hover:bg-[#dbcfc8] transition"
        >
          PDF 미리보기
        </button>
      </div>
    </div>
  );
}
