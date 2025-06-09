"use client";

import Image from "next/image";
import { X } from "lucide-react";

interface PDFPreviewProps {
  publicId: string;
  pageCount: number;
  pdfUrl: string; // ✅ S3 원본 URL 받아서 사용
  onDelete?: () => void;
}

export default function PDFPreview({
  publicId,
  pageCount,
  pdfUrl,
  onDelete,
}: PDFPreviewProps) {
  const baseUrl = "https://res.cloudinary.com/dwiiiowbu/image/upload";

  return (
    <div className="relative w-full max-w-[400px] mx-auto rounded-md overflow-hidden border border-[#D5CAC3]">
      {/* 삭제 버튼 */}
      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-2 right-2 z-10 bg-[#F0E6DE] border border-[#D5CAC3] 
            rounded-full p-1 shadow-sm hover:bg-[#e2d8d0] transition-colors"
        >
          <X size={16} className="text-[#3E3232]" />
        </button>
      )}

      {/* PDF 썸네일들 */}
      <div className="space-y-2 p-2">
        {Array.from({ length: pageCount }).map((_, i) => {
          const page = i + 1;
          const imageUrl = `${baseUrl}/pg_${page},f_auto,q_auto,w_400/${publicId}.pdf`;

          return (
            <div
              key={page}
              className="block relative w-full aspect-[3/4] rounded overflow-hidden cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(pdfUrl, "_blank", "noopener,noreferrer"); // ✅ 클릭 시 S3 원본 URL 열기
              }}
            >
              <Image
                src={imageUrl}
                alt={`PDF page ${page}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
