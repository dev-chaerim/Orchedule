"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUserStore } from "@/lib/store/user";

interface Sheet {
  _id: string;
  title: string;
  date: string;
  isNew: boolean;
  author: string;
}

export default function SeasonSheetListPage() {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchSheets = async () => {
      const res = await fetch("/api/scores"); // 👈 GET 요청
      const data = await res.json();
      setSheets(data);
    };

    fetchSheets();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-4">
      {/* ✅ 관리자일 경우만 글쓰기 버튼 노출 */}
      {user?.role === "admin" && (
        <div className="text-right mb-3">
          <Link href="/menu/sheetmusic/sheet/new">
            <button className="bg-[#F4ECE7] text-[#3E3232] text-sm font-medium px-4 py-2 rounded-md hover:bg-[#e3dcd7]">
              + 악보 등록
            </button>
          </Link>
        </div>
      )}

      {sheets.map((sheet) => (
        <Link
          key={sheet._id}
          href={`/menu/sheetmusic/sheet/${sheet._id}`}
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
          <div className="text-xs text-gray-500">{sheet.author}</div>
        </Link>
      ))}

      {sheets.length === 0 && (
        <div className="bg-[#fdfbf9] border border-[#e8e0d9] rounded-xl p-6 text-center w-full">
          <p className="text-sm text-[#7e6a5c] font-semibold">
            아직 등록된 악보가 없어요.
          </p>
          <p className="text-xs text-[#a79c90] mt-1">
            오른쪽 상단의 [악보 등록] 버튼으로 추가해보세요!
          </p>
        </div>
      )}
    </div>
  );
}
