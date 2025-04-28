"use client";

import { useEffect } from "react";
import { useToastStore } from "@/lib/store/toast";

export default function Toast() {
  const { message, type, isVisible, hideToast } = useToastStore();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => hideToast(), 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, hideToast]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md text-sm font-medium z-50
        ${
          type === "success"
            ? "bg-[#b4dbff] text-[#3E3232]"
            : "bg-[#f3c6c6] text-[#3E3232]"
        }`}
    >
      {message}
    </div>
  );
}
