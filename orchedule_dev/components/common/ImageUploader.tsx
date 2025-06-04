"use client";
import { useState } from "react";
import {
  uploadFileToCloudinary,
  UploadResult,
} from "@/lib/utils/uploadFileToCloudinary";

interface ImageUploaderProps {
  onUpload: (file: UploadResult) => void;
}

export default function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    for (const file of Array.from(files)) {
      try {
        const result = await uploadFileToCloudinary(file);
        onUpload(result); // ✅ 전체 업로드 결과 전달
      } catch (err) {
        console.error("업로드 실패:", err);
        alert(`"${file.name}" 업로드 중 오류가 발생했습니다.`);
      }
    }

    setIsUploading(false);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-[#3E3232] font-semibold">
        이미지 또는 PDF 첨부
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="image/*,.pdf"
          multiple
          onChange={handleUpload}
          className="file:mr-4 file:py-1 file:px-3
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-[#e7dbd2] file:text-[#3E3232]
            hover:file:bg-[#dbcfc8]
            text-sm text-[#7e6a5c]"
        />
        {isUploading && (
          <span className="text-sm text-gray-500 animate-pulse">
            업로드 중...
          </span>
        )}
      </div>
    </div>
  );
}
