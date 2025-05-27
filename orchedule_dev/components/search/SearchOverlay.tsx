"use client";

import { useEffect, useState } from "react";
import { useSearchStore } from "@/lib/store/search";
import { useSeasonStore } from "@/lib/store/season";
import { useRouter } from "next/navigation";

interface Notice {
  _id: string;
  title: string;
  author?: string;
  content?: string;
}

interface Score {
  _id: string;
  title: string;
  author?: string;
  parts: string[];
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const { query, setQuery } = useSearchStore();
  const { selectedSeason } = useSeasonStore();
  console.log("현재 선택된 시즌 ID:", selectedSeason?._id);
  const router = useRouter();

  const [notices, setNotices] = useState<Notice[]>([]);
  const [scores, setScores] = useState<Score[]>([]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // 데이터 불러오기 (시즌 포함)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const seasonParam = selectedSeason
          ? `?season=${selectedSeason._id}`
          : "";

        console.log("seasonParam", seasonParam);
        const [noticeRes, scoreRes] = await Promise.all([
          fetch(`/api/notices`),
          fetch(`/api/score-checks${seasonParam}`),
        ]);

        const [noticeData, scoreData] = await Promise.all([
          noticeRes.json(),
          scoreRes.json(),
        ]);
        console.log("검색 데이터", noticeData, scoreData);
        setNotices(noticeData);
        setScores(scoreData);
      } catch (err) {
        console.error("검색 데이터 로드 실패:", err);
      }
    };

    if (isOpen) fetchData();
  }, [isOpen, selectedSeason]);

  const filteredNotices = query.trim()
    ? notices.filter(
        (n) =>
          n.title.toLowerCase().includes(query.toLowerCase()) ||
          n.content?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredScores = scores.filter(
    (s) =>
      query &&
      (s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.author?.toLowerCase().includes(query.toLowerCase()) ||
        s.parts.some((p) => p.toLowerCase().includes(query.toLowerCase())))
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex justify-center items-start pt-13 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-xl p-6 pt-13 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* 검색창 */}
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#A5796E] focus:outline-none mb-6"
        />

        {/* 검색 결과 */}
        <div className="space-y-6 max-h-[60vh] overflow-y-auto">
          {/* 공지 */}
          <div>
            <h3 className="text-sm font-semibold text-[#7e6a5c] mb-2">
              공지사항
            </h3>
            <ul className="text-sm text-[#3E3232] space-y-1">
              {filteredNotices.length > 0 ? (
                filteredNotices.map((n) => (
                  <li
                    key={n._id}
                    className="cursor-pointer hover:underline"
                    onClick={() => {
                      onClose();
                      router.push(`/menu/notice/announcement/${n._id}`);
                    }}
                  >
                    – {n.title}
                  </li>
                ))
              ) : (
                <li className="text-gray-400">검색 결과 없음</li>
              )}
            </ul>
          </div>

          {/* 악보 */}
          <div>
            <h3 className="text-sm font-semibold text-[#7e6a5c] mb-2">악보</h3>
            <ul className="text-sm text-[#3E3232] space-y-1">
              {filteredScores.length > 0 ? (
                filteredScores.map((s) => (
                  <li
                    key={s._id}
                    className="cursor-pointer hover:underline"
                    onClick={() => {
                      onClose();
                      router.push(`/menu/sheetmusic/bowing/${s._id}`);
                    }}
                  >
                    – {s.title}
                  </li>
                ))
              ) : (
                <li className="text-gray-400">검색 결과 없음</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
