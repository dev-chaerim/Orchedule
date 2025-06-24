"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface Props {
  fallbackHref: string;
  label?: string;
}

export default function BackButton({ fallbackHref, label = "목록" }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isFromAdmin = searchParams.get("from") === "admin";

  const handleBack = () => {
    if (isFromAdmin) {
      router.push("/admin/notice");
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-1 border mb-3 bg-white border-[#e0e0e0] rounded-full px-2 py-1 text-sm text-[#7E6363] hover:bg-[#f4f0ee] transition"
    >
      <ChevronLeft size={16} />
      <span className="mr-1">{label}</span>
    </button>
  );
}
