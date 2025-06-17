"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MoreLink from "../MoreLink";
import LoadingSkeleton from "../common/LoadingSkeleton";
import type { Sheet, ScoreCheck } from "@/src/lib/types/sheet";
import { useSeasonStore } from "@/lib/store/season";
import { Music } from "lucide-react"; //
import type { Comment } from "@/src/lib/types/sheet";
import { isNew } from "@/src/lib/utils/isNew";
import NewBadge from "../common/NewBadge";
import ErrorMessage from "../common/ErrorMessage";

interface UnifiedSheet {
  _id: string;
  title: string;
  author: string;
  date: string;
  parts: string[];
  comments?: Comment[];
  content: string; // ✅ contentPreview 위해 추가
  source: "season" | "score-check";
}

export default function SheetPreviewList() {
  const [sheets, setSheets] = useState<UnifiedSheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const selectedSeason = useSeasonStore((state) => state.selectedSeason);
  const seasonId = selectedSeason?._id;

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const [seasonRes, scoreCheckRes] = await Promise.all([
          fetch(`/api/season-scores${seasonId ? `?season=${seasonId}` : ""}`),
          fetch(`/api/score-checks${seasonId ? `?season=${seasonId}` : ""}`),
        ]);

        if (!seasonRes.ok || !scoreCheckRes.ok)
          throw new Error("악보 조회 실패");

        const seasonData: Sheet[] = await seasonRes.json();
        const scoreCheckData: ScoreCheck[] = await scoreCheckRes.json();

        const seasonSheets: UnifiedSheet[] = seasonData.map((sheet) => ({
          _id: sheet._id,
          title: sheet.title,
          author: sheet.author,
          date: sheet.date,
          comments: sheet.comments ?? [],
          parts: sheet.parts ?? [],
          content: sheet.content ?? "", // ✅ content 추가
          source: "season",
        }));

        const scoreCheckSheets: UnifiedSheet[] = scoreCheckData.map(
          (sheet) => ({
            _id: sheet._id,
            title: sheet.title,
            author: sheet.author,
            date: sheet.date,
            parts: sheet.parts,
            content: sheet.content ?? "", // ✅ content 추가
            source: "score-check",
          })
        );

        const merged = [...seasonSheets, ...scoreCheckSheets].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setSheets(merged.slice(0, 3));
      } catch (err) {
        console.error("악보 리스트 불러오기 오류:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSheets();
  }, [seasonId]);

  if (error) return <ErrorMessage />;

  return (
    <section className="px-4 py-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-semibold">악보</h2>
        <MoreLink href="/menu/sheetmusic/sheet" />
      </div>

      <div className="space-y-3">
        {loading ? (
          <LoadingSkeleton lines={4} className="mt-2 mb-6" />
        ) : sheets.length === 0 ? (
          <p className="text-sm text-gray-400">등록된 악보가 없습니다.</p>
        ) : (
          sheets.map((sheet) => {
            const createdAt = new Date(sheet.date);
            const contentPreview =
              sheet.content.replace(/\n/g, " ").slice(0, 80) +
              (sheet.content.length > 80 ? "..." : "");

            return (
              <Link
                key={sheet._id}
                href={
                  sheet.source === "season"
                    ? `/menu/sheetmusic/sheet/${sheet._id}`
                    : `/menu/sheetmusic/bowing/${sheet._id}`
                }
                className="block bg-white rounded-xl shadow  p-4 hover:bg-[#f8f5f1] transition"
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Music size={16} className="text-[#7E6363]" />
                    <div className="flex items-center gap-1 truncate pr-3">
                      <div className="font-semibold text-sm truncate">
                        {sheet.title}
                      </div>
                      {isNew(sheet.date) && <NewBadge />}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap mt-0.5">
                    {createdAt.toLocaleDateString("ko-KR")}
                  </span>
                </div>

                <div className="text-xs text-[#7e6a5c] mb-3">
                  {sheet.author}
                </div>

                <div className="text-xs text-[#7e6a5c] mt-2 leading-relaxed line-clamp-2">
                  {contentPreview}
                </div>

                {sheet.source === "season" ? (
                  <div className="text-xs text-gray-400 mt-3">
                    💬 댓글 {sheet.comments?.length ?? 0}
                  </div>
                ) : sheet.parts && sheet.parts.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-4 ml-1">
                    {sheet.parts.map((part, idx) => (
                      <span
                        key={idx}
                        className="text-xs text-[#7e6a5c] bg-[#f4ece7] px-2 py-1 rounded-full"
                      >
                        #{part}
                      </span>
                    ))}
                  </div>
                ) : null}
              </Link>
            );
          })
        )}
      </div>
    </section>
  );
}
