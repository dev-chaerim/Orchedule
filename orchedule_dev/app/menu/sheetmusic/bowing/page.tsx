"use client";

import Link from "next/link";
import { mockScoreChecks } from "@/lib/mock/scoreChecks";

export default function SheetScoreCheckList() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6  space-y-3">
      {mockScoreChecks.map((sheet) => (
        <Link
          key={`${sheet.id}-${sheet.title}`}
          href={`/menu/sheetmusic/bowing/${sheet.id}`}
          className="block bg-white p-4 rounded-lg shadow-sm hover:bg-gray-50 transition"
        >
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-sm">
              {sheet.title}
              {sheet.isNew && (
                <span className="ml-2 relative -top-[1px] inline-flex items-center justify-center bg-red-500 text-white text-[9px] px-2 py-[2px] rounded-full leading-none h-[16px] min-w-[30px]">
                  NEW
                </span>
              )}
            </h3>
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {sheet.date}
            </span>
          </div>

          <div className="text-xs text-gray-600 mt-1">
            파트: {sheet.parts.join(", ")}
          </div>
          <div className="text-xs text-gray-400 mt-2">{sheet.author}</div>
        </Link>
      ))}
    </div>
  );
}
