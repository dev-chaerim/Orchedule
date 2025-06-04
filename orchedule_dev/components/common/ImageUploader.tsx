"use client";
import { useState } from "react";

interface ImageUploaderProps {
  onUpload: (url: string) => void;
}

export default function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFileNames: string[] = [];

    for (const file of Array.from(files)) {
      newFileNames.push(file.name);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "img_upload");

      try {
        setIsUploading(true);
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dwiiiowbu/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        const enhancedUrl = data.secure_url.replace(
          "/upload/",
          "/upload/q_100,f_auto/"
        );
        console.log("Cloudinary 업로드 URL:", enhancedUrl);
        onUpload(enhancedUrl); // 부모에게 이미지 URL 전달
      } catch (err) {
        console.error("업로드 실패:", err);
        alert(`"${file.name}" 업로드 중 오류가 발생했습니다.`);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-[#3E3232] font-semibold">
        이미지 첨부
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="image/*"
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
