"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSeasonStore } from "@/lib/store/season";

interface Notice {
  _id: string;
  title: string;
  date: string;
}

export default function SeatNoti() {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const selectedSeason = useSeasonStore((state) => state.selectedSeason);
  const seasonId = selectedSeason?._id;
  const router = useRouter();

  useEffect(() => {
    const fetchSeatNotice = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/notices${
            seasonId
              ? `?season=${seasonId}&isSeatNotice=true`
              : "?isSeatNotice=true"
          }`
        );
        const data = await res.json();
        const seatNotice = data[0] ?? null;

        if (seatNotice) {
          // ✅ 자리배치 공지 있으면 상세페이지로 이동
          router.replace(`/menu/notice/announcement/${seatNotice._id}`);
        } else {
          // 자리배치 공지 없으면 상태 업데이트
          setNotice(null);
        }
      } catch (err) {
        console.error("자리배치 공지 조회 실패", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeatNotice();
  }, [seasonId, router]);

  if (isLoading) {
    return (
      <p className="text-center py-10 text-sm text-gray-500">
        자리배치 공지를 불러오는 중입니다...
      </p>
    );
  }

  // 자리배치 공지 없으면 안내 문구 표시
  if (!notice) {
    return (
      <div className="bg-[#fdfbf9] border border-[#e8e0d9] rounded-xl p-6 text-center w-full">
        <p className="text-sm text-[#7e6a5c]">
          아직 자리배치표가 등록되지 않았습니다.
        </p>
      </div>
    );
  }

  return null; // router.replace로 이동하기 때문에 화면에는 아무것도 안 보여줌
}
