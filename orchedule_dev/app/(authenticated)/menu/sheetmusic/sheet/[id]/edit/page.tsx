"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ConfirmModal from "@/components/modals/ConfirmModal";

const allParts = [
  "바이올린",
  "비올라",
  "첼로",
  "베이스",
  "플룻",
  "오보에",
  "클라리넷",
  "바순",
  "호른",
];

export default function SheetEditPage() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/scores/${id}`);
        if (!res.ok) throw new Error("데이터를 불러오지 못했습니다.");
        const data = await res.json();
        setTitle(data.title);
        setContent(data.content);
        setFileUrl(data.fileUrl);
        setYoutubeUrl(data.youtubeUrl || "");
        setTags(data.tags || []);
      } catch (err) {
        console.error(err);
        router.back();
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, router]);

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !fileUrl) {
      alert("필수 항목을 입력해주세요.");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    const res = await fetch(`/api/scores/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        fileUrl,
        youtubeUrl,
        tags,
      }),
    });

    if (!res.ok) throw new Error("수정 실패");

    router.push(`/menu/sheetmusic/sheet/${id}`);
  };

  if (loading)
    return <div className="p-6 text-sm text-gray-500">불러오는 중...</div>;

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold text-[#3E3232]">악보 수정</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-[#D5CAC3] rounded-md px-4 py-2 text-sm"
        />
        <textarea
          placeholder="설명"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="w-full border border-[#D5CAC3] rounded-md px-4 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="악보 파일 링크"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          className="w-full border border-[#D5CAC3] rounded-md px-4 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="YouTube 링크 (선택)"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className="w-full border border-[#D5CAC3] rounded-md px-4 py-2 text-sm"
        />

        <div className="space-y-1">
          <p className="text-sm font-medium text-[#3E3232]">파트 선택</p>
          <div className="flex flex-wrap gap-2">
            {allParts.map((part) => (
              <button
                key={part}
                type="button"
                onClick={() => toggleTag(part)}
                className={`px-3 py-1 rounded-full text-sm border transition ${
                  tags.includes(part)
                    ? "bg-[#7E6363] text-white border-[#7E6363]"
                    : "bg-white text-[#7E6363] border-[#D5CAC3]"
                }`}
              >
                {part}
              </button>
            ))}
          </div>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-[#7E6363] text-white px-5 py-2 text-sm rounded-md hover:bg-[#5c4f4f]"
          >
            수정하기
          </button>
        </div>
      </form>

      <ConfirmModal
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirmSubmit}
        message="정말 수정하시겠습니까?"
        confirmLabel="수정"
        successMessage="악보가 수정되었습니다."
        errorMessage="수정 중 오류가 발생했습니다."
      />
    </main>
  );
}
