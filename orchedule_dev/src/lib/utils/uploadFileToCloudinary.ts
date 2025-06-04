// src/lib/utils/uploadFileToCloudinary.ts

export interface UploadResult {
  url: string;
  publicId: string;
  pageCount: number;
  type: string;
}

export const uploadFileToCloudinary = async (file: File): Promise<UploadResult> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "img_upload");

  const res = await fetch("https://api.cloudinary.com/v1_1/dwiiiowbu/auto/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("업로드 실패");

  const data = await res.json();

  return {
    url: data.secure_url,
    publicId: data.public_id,
    pageCount: data.pages || 1,
    type: file.type,
  };
};
