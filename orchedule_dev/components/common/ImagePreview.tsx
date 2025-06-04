"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";

interface ImagePreviewProps {
  src: string;
  alt?: string;
  onDelete?: () => void;
}

export default function ImagePreview({
  src,
  alt = "미리보기",
  onDelete,
}: ImagePreviewProps) {
  const [ratio, setRatio] = useState<number | null>(null);

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
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        className="object-contain"
        onLoad={({ currentTarget }) => {
          const r = currentTarget.naturalWidth / currentTarget.naturalHeight;
          setRatio(r);
        }}
      />
    </div>
  );
}
