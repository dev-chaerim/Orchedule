"use client";

interface DeleteConfirmModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  open,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-white rounded-xl p-6 w-72 text-center space-y-4">
        <p className="text-[#3E3232] font-semibold text-sm">
          정말 삭제하시겠습니까?
        </p>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md text-sm bg-[#b14040] text-white hover:bg-[#942e2e] transition"
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
}
