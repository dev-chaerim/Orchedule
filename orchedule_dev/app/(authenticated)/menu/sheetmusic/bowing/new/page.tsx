"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfirmModal from "@/components/modals/ConfirmModal";

const PART_OPTIONS = [
  "Vn1",
  "Vn2",
  "Va",
  "Vc",
  "Cb",
  "Fl",
  "Ob",
  "Cl",
  "Fg",
  "Hr",
  "Tp",
  "Tb",
  "Perc",
];

export default function NewBowingScorePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [parts, setParts] = useState<string[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [alertMessage, setAlertMessage] = useState(""); // ✅ alert용

  const handlePartToggle = (part: string) => {
    setParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !fileUrl || parts.length === 0) {
      setAlertMessage("모든 필드를 입력해주세요."); // ✅ alert 모달 열기
      return;
    }
    setShowConfirm(true); // 등록 확인 모달 열기
  };

  const handleConfirmSubmit = async () => {
    try {
      const res = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          fileUrl,
          parts,
          date: new Date().toISOString(),
          type: "bowing",
        }),
      });

      if (!res.ok) throw new Error("등록 실패");

      router.push("/menu/sheetmusic/bowing");
    } catch (err) {
      console.error("등록 실패:", err);
      setAlertMessage("등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <h1 className="text-xl font-bold text-[#3E3232]">보잉체크 악보 등록</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
        />
        <input
          type="text"
          placeholder="작성자"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
        />
        <input
          type="text"
          placeholder="악보 파일 URL"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium">대상 파트</label>
          <div className="flex flex-wrap gap-2">
            {PART_OPTIONS.map((part) => (
              <button
                key={part}
                onClick={() => handlePartToggle(part)}
                className={`px-3 py-1 rounded-full text-sm border transition ${
                  parts.includes(part)
                    ? "bg-[#7E6363] text-white border-[#7E6363]"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
                type="button"
              >
                {part}
              </button>
            ))}
          </div>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-[#3E3232] text-white px-5 py-2 text-sm rounded-md hover:bg-[#2c2323]"
          >
            등록하기
          </button>
        </div>
      </form>

      {/* 등록 확인 모달 */}
      <ConfirmModal
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirmSubmit}
        message="이 악보를 등록하시겠습니까?"
        confirmLabel="등록"
        successMessage="등록되었습니다."
        errorMessage="등록 중 오류가 발생했습니다."
      />

      {/* 입력 누락 알림 모달 */}
      <ConfirmModal
        open={!!alertMessage}
        onCancel={() => setAlertMessage("")}
        message={alertMessage}
        mode="alert"
      />
    </div>
  );
}
