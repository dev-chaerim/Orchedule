"use client";

import { useEffect, useRef } from "react";

interface ConfirmModalProps {
  message: string;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: string; // ex) 'red' | 'default'
}

export default function ConfirmModal({
  message,
  open,
  onConfirm,
  onCancel,
  confirmLabel = "확인",
  cancelLabel = "취소",
  confirmColor = "default",
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onCancel();
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
      return () =>
        document.removeEventListener("mousedown", handleOutsideClick);
    }
  }, [open, onCancel]);

  if (!open) return null;

  const confirmClass =
    confirmColor === "red"
      ? "bg-[#b14040] hover:bg-[#942e2e]"
      : "bg-[#7E6363] hover:bg-[#5c4f4f]";

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
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`text-sm px-4 py-1 rounded-md text-white transition ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
