"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSeasonStore } from "@/lib/store/season";
import LoadingText from "@/components/common/LoadingText";

export default function SeatNoti() {
  const [hasNotice, setHasNotice] = useState<boolean | null>(null); // ✅ null: 로딩 중
  const selectedSeason = useSeasonStore((state) => state.selectedSeason);
  const seasonId = selectedSeason?._id;
  const router = useRouter();

  useEffect(() => {
    const fetchSeatNotice = async () => {
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
          router.replace(`/menu/notice/announcement/${seatNotice._id}`);
        } else {
          setHasNotice(false); // 없음
        }
      } catch (err) {
        console.error("자리배치 공지 조회 실패", err);
        setHasNotice(false);
      }
    };

    fetchSeatNotice();
  }, [seasonId, router]);

  if (hasNotice === null) {
    return <LoadingText message="자리배치 공지를 불러오는 중입니다..." />;
  }

  // ❌ 자리배치 공지 없음
  return (
    <div className="bg-[#fdfbf9] border border-[#e8e0d9] rounded-xl p-6 text-center w-full">
      <p className="text-sm text-[#7e6a5c]">
        아직 자리배치표가 등록되지 않았습니다.
      </p>
    </div>
  );
}
