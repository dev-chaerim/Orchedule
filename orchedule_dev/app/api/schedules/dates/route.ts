import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { PracticeSchedule } from '@/src/models/practiceSchedule';

export async function GET() {
  try {
    await connectDB();

    // 날짜만 추출하고, 오름차순 정렬
    const dates = await PracticeSchedule.find().sort({ date: 1 }).distinct("date");

    return NextResponse.json(dates);
  } catch (err) {
    console.error("스케줄 날짜 목록 불러오기 실패:", err);
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
