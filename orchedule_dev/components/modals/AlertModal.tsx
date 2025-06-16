"use client";

import { useEffect, useRef } from "react";

interface AlertModalProps {
  message: string;
  onClose: () => void;
}

export default function AlertModal({ message, onClose }: AlertModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-xs text-center"
      >
        <p className="text-sm text-[#3E3232] mb-4 whitespace-pre-line">
          {message}
        </p>

        <button
          onClick={onClose}
          className="text-sm px-4 py-1 rounded-md bg-[#7E6363] text-white hover:bg-[#5c4f4f] transition"
        >
          확인
        </button>
      </div>
    </div>
  );
}
