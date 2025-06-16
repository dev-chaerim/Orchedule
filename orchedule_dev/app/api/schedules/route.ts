import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import { PracticeSchedule } from '@/src/models/practiceSchedule';
import Attendance from '@/src/models/attendance';

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const seasonId = searchParams.get("seasonId");

  try {
    const query = seasonId ? { seasonId } : {};
    const schedules = await PracticeSchedule.find(query).sort({ date: -1 });
    return NextResponse.json(schedules);
  } catch (error) {
    console.error("일정 불러오기 실패:", error);
    return NextResponse.json({ error: "일정 불러오기 실패" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const {
      seasonId,
      date,
      auditionSessions,
      partSessions,
      orchestraSession,
      specialNotices,
    } = body;

    if (!seasonId || !date) {
      return NextResponse.json({ message: "필수 필드 누락" }, { status: 400 });
    }

    // ✅ PracticeSchedule 생성 (isCancelled 기본값 false 추가)
    const newSchedule = await PracticeSchedule.create({
      seasonId,
      date,
      auditionSessions,
      partSessions,
      orchestraSession,
      specialNotices,
      isCancelled: false, // ✅ 명시적으로 넣어주는 걸 추천
    });

    // ✅ Attendance 자동 생성 (초기 records는 빈 배열)
    await Attendance.create({
      seasonId,
      date,
      records: [],
    });

    return NextResponse.json(newSchedule, { status: 201 });
  } catch (error) {
    console.error("일정 생성 실패:", error);
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}