"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";

interface PDFThumbnailImageProps {
  publicId: string; // Cloudinary publicId
  alt?: string;
  onDelete?: () => void;
  pdfUrl: string; // S3 원본 PDF URL
}

export default function PDFThumbnailImage({
  publicId,
  alt = "PDF 썸네일",
  onDelete,
  pdfUrl,
}: PDFThumbnailImageProps) {
  const [ratio, setRatio] = useState<number | null>(null);

  const cloudName = "dwiiiowbu";
  const encodedPublicId = encodeURIComponent(publicId);

  const thumbnailUrl = `https://res.cloudinary.com/${cloudName}/image/upload/pg_1,f_auto,q_auto,w_400/${encodedPublicId}.pdf`;

  return (
    <div
      className="relative w-full max-w-[400px] mx-auto rounded-md overflow-hidden border border-[#D5CAC3]"
      style={{ aspectRatio: ratio ?? "4 / 3" }}
    >
      {onDelete && (
        <button
          onClick={onDelete}
          className="absolute top-2 right-2 z-10 bg-[#F0E6DE] border border-[#D5CAC3] 
                   rounded-full p-1 shadow-sm hover:bg-[#e2d8d0] transition-colors"
        >
          <X size={16} className="text-[#3E3232]" />
        </button>
      )}

      {/* 클릭 시 S3 원본 PDF 열기 */}
      <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
        <Image
          src={thumbnailUrl}
          alt={alt}
          fill
          sizes="100vw"
          className="object-contain"
          onLoad={({ currentTarget }) => {
            const r = currentTarget.naturalWidth / currentTarget.naturalHeight;
            setRatio(r);
          }}
        />
      </a>
    </div>
  );
}
