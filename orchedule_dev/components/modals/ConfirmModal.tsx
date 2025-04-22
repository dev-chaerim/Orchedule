"use client";

import { useEffect, useRef } from "react";

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onCancel();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-xs text-center"
      >
        <p className="text-sm text-[#3E3232] mb-4">{message}</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="text-sm px-4 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="text-sm px-4 py-1 rounded-md bg-[#7E6363] text-white hover:bg-[#5c4f4f] transition"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
