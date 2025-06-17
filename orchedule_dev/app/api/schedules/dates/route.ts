import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { PracticeSchedule } from "@/src/models/practiceSchedule";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const seasonId = searchParams.get("seasonId");

    const filter: { isCancelled: { $ne: boolean }; seasonId?: string } = {
      isCancelled: { $ne: true },
    };

    if (seasonId) {
      filter.seasonId = seasonId;
    }

    // 해당 시즌 + isCancelled 제외 → 날짜만 추출
    const dates = await PracticeSchedule.find(filter)
      .sort({ date: 1 })
      .distinct("date");

    return NextResponse.json(dates);
  } catch (err) {
    console.error("스케줄 날짜 목록 불러오기 실패:", err);
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
