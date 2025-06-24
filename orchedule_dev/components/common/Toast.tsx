"use client";

import { useEffect } from "react";
import { useToastStore } from "@/lib/store/toast";

export default function Toast() {
  const { message, type, isVisible, hideToast } = useToastStore();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => hideToast(), 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, hideToast]);

  if (!isVisible) return null;

  const backgroundColor = type === "success" ? "bg-[#e7f1ea]" : "bg-[#fbeaea]";
  const textColor = type === "success" ? "text-[#2b473e]" : "text-[#5e3c3c]";
  const borderColor =
    type === "success" ? "border-[#c9e5d3]" : "border-[#f0cfcf]";

  return (
    <div
      className={`fixed top-1/4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md text-sm font-medium z-50 border ${backgroundColor} ${textColor} ${borderColor}`}
    >
      {message}
    </div>
  );
}
