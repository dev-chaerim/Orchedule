"use client";

import { AlertTriangle } from "lucide-react";

interface ErrorMessageProps {
  message?: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center text-[#9E9389] bg-[#FCF9F5] border border-[#E3DBD5] rounded-lg p-6 my-8">
      <AlertTriangle size={24} className="mb-2 text-[#BFA69B]" />
      <p className="text-sm font-medium">{message || "문제가 발생했어요."}</p>
      <p className="text-xs mt-1">잠시 후 다시 시도해주세요</p>
    </div>
  );
}
