"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  fallbackHref: string;
  label?: string;
}

export default function BackButton({
  fallbackHref,
  label = "목록",
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push(fallbackHref);
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-1 border mb-4 bg-white border-[#e0e0e0] rounded-full px-3 py-1 text-sm text-[#7E6363] hover:bg-[#f4f0ee] transition"
    >
      <ChevronLeft size={16} />
      <span>{label}</span>
    </button>
  );
}
