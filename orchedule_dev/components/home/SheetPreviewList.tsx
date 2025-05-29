"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MoreLink from "../MoreLink";
import { format } from "date-fns";
import LoadingSkeleton from "../common/LoadingSkeleton";

interface Score {
  _id: string;
  title: string;
  author: string;
  date: string;
  fileUrl: string;
  youtubeUrl?: string;
  tags: string[];
  parts: string[];
  isNewScore?: boolean;
}

export default function SheetPreviewList() {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await fetch("/api/score-checks");
        if (!res.ok) throw new Error("악보 조회 실패");
        const data = await res.json();
        console.log("악보데이터", data);
        setScores(data.slice(0, 3)); // 최신 3개만 표시
      } catch (err) {
        console.error("보잉 악보 불러오기 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  return (
    <section className="px-4 py-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-semibold">악보</h2>
        <MoreLink href="/menu/sheetmusic/sheet" />
      </div>

      <div className="space-y-3">
        {loading ? (
          <LoadingSkeleton lines={4} className="mt-2 mb-6" />
        ) : scores.length === 0 ? (
          <p className="text-sm text-gray-400">등록된 악보가 없습니다.</p>
        ) : (
          scores.map((sheet) => (
            <Link
              key={sheet._id}
              href={`/menu/sheetmusic/bowing/${sheet._id}`}
              className="block bg-white rounded-xl shadow p-3 hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Image
                    src="/icons/music-file.svg"
                    alt="악보"
                    width={14}
                    height={14}
                    style={{ aspectRatio: "1 / 1" }}
                  />
                  <span className="text-sm">{sheet.title}</span>
                  {sheet.isNewScore && (
                    <span className="text-xs text-red-500 ml-1">N</span>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {" "}
                  {format(new Date(sheet.date), "yyyy-MM-dd")}
                </span>
              </div>

              <div className="flex gap-1 flex-wrap mt-3">
                {sheet.parts.map((part) => (
                  <span
                    key={part}
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      part === "Vn1"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-pink-100 text-pink-800"
                    }`}
                  >
                    {part}
                  </span>
                ))}
                {/* {sheet.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-200 px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))} */}
              </div>

              <p className="text-xs text-[#3E3232] mt-3">{sheet.author}</p>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
