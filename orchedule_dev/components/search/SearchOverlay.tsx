"use client";

import { useEffect, useState } from "react";
import { useSearchStore } from "@/lib/store/search";
import { useSeasonStore } from "@/lib/store/season";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ScoreCheck, Sheet } from "@/src/lib/types/sheet";

interface Notice {
  _id: string;
  title: string;
  author?: string;
  content?: string;
}

type SearchItem =
  | { _id: string; title: string; type: "notice" }
  | { _id: string; title: string; type: "score-check" }
  | { _id: string; title: string; type: "season-score" };

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const { query, setQuery } = useSearchStore();
  const { selectedSeason } = useSeasonStore();
  const router = useRouter();

  const [notices, setNotices] = useState<Notice[]>([]);
  const [scoreChecks, setScoreChecks] = useState<ScoreCheck[]>([]);
  const [seasonScores, setSeasonScores] = useState<Sheet[]>([]);

  // ESC 키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const seasonParam = selectedSeason
          ? `?season=${selectedSeason._id}`
          : "";

        const [noticeRes, scoreCheckRes, seasonScoreRes] = await Promise.all([
          fetch(`/api/notices`),
          fetch(`/api/score-checks${seasonParam}`),
          fetch(`/api/season-scores${seasonParam}`),
        ]);

        const [noticeData, scoreCheckData, seasonScoreData] = await Promise.all(
          [noticeRes.json(), scoreCheckRes.json(), seasonScoreRes.json()]
        );

        setNotices(noticeData);
        setScoreChecks(scoreCheckData);
        setSeasonScores(seasonScoreData);
      } catch (err) {
        console.error("검색 데이터 로드 실패:", err);
      }
    };

    if (isOpen) fetchData();
  }, [isOpen, selectedSeason]);

  const trimmedQuery = query.trim().toLowerCase();

  const noticeResults: SearchItem[] = notices
    .filter(
      (n) =>
        trimmedQuery &&
        (n.title.toLowerCase().includes(trimmedQuery) ||
          n.content?.toLowerCase().includes(trimmedQuery))
    )
    .map((n) => ({ _id: n._id, title: n.title, type: "notice" }));

  const scoreCheckResults: SearchItem[] = scoreChecks
    .filter(
      (s) =>
        trimmedQuery &&
        (s.title.toLowerCase().includes(trimmedQuery) ||
          s.author?.toLowerCase().includes(trimmedQuery) ||
          s.content?.toLowerCase().includes(trimmedQuery) || // ✅ 추가됨!
          (s.parts || []).some((p) => p.toLowerCase().includes(trimmedQuery)))
    )
    .map((s) => ({ _id: s._id, title: s.title, type: "score-check" }));

  const seasonScoreResults: SearchItem[] = seasonScores
    .filter(
      (s) =>
        trimmedQuery &&
        (s.title.toLowerCase().includes(trimmedQuery) ||
          s.author?.toLowerCase().includes(trimmedQuery) ||
          s.content?.toLowerCase().includes(trimmedQuery) || // ✅ 여기!
          (s.parts || []).some((p) => p.toLowerCase().includes(trimmedQuery)))
    )
    .map((s) => ({ _id: s._id, title: s.title, type: "season-score" }));

  const results = [
    ...noticeResults,
    ...scoreCheckResults,
    ...seasonScoreResults,
  ];

  const handleClick = (item: SearchItem) => {
    onClose();
    if (item.type === "notice") {
      router.push(`/menu/notice/announcement/${item._id}`);
    } else if (item.type === "score-check") {
      router.push(`/menu/sheetmusic/bowing/${item._id}`);
    } else if (item.type === "season-score") {
      router.push(`/menu/sheetmusic/sheet/${item._id}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex justify-center items-start pt-13 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-xl p-6 pt-7 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-base font-semibold text-[#3E3232]">통합 검색</h1>
          <button
            onClick={onClose}
            className="text-[#3E3232] hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* 검색창 */}
        <div className="mb-6 border-b border-[#D5CAC3] py-2 px-1 flex items-center gap-2">
          <Image
            src="/icons/search.svg"
            alt="검색"
            width={16}
            height={16}
            className="text-gray-400"
          />
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm text-[#3E3232] placeholder-[#A1978E] bg-transparent focus:outline-none"
          />
        </div>

        <h2 className="text-sm text-[#5A4A42] font-semibold mb-2 px-1">
          검색 결과
        </h2>

        {/* 검색 결과 */}
        {trimmedQuery === "" ? (
          <div className="text-center text-[#9E9389] py-12">
            <p className="text-sm">검색어를 입력해보세요</p>
            <p className="text-xs mt-1">
              공지사항, 악보 제목으로 빠르게 찾아볼 수 있어요!
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center text-[#9E9389] py-12">
            <p className="text-sm">검색결과가 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-[#d5cac3] scrollbar-track-transparent">
            <ul className="divide-y divide-[#D5CAC3]">
              {results.map((item) => (
                <li
                  key={item._id}
                  onClick={() => handleClick(item)}
                  className="py-3 px-2 flex justify-between items-center cursor-pointer hover:bg-[#f5efdd]"
                >
                  <span className="text-sm text-[#3E3232]">{item.title}</span>
                  <span className="text-xs text-[#A5796E] border border-[#b69678] px-2 py-0.5 rounded-full font-medium">
                    {item.type === "notice"
                      ? "공지"
                      : item.type === "score-check"
                      ? "악보체크"
                      : "시즌악보"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
