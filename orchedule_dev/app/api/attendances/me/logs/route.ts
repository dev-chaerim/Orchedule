// app/api/attendances/me/logs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongoose';
import Attendance from '@/src/models/attendance';
import {Schedule} from '@/src/models/schedule';
import { getTokenDataFromRequest } from '@/src/lib/auth';

interface AttendanceRecord {
  memberId: string;
  status: '출석' | '지각' | '불참';
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const tokenData = getTokenDataFromRequest(req);
    if (!tokenData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = tokenData.id;
    const seasonId = req.nextUrl.searchParams.get('seasonId');
    if (!seasonId) {
      return NextResponse.json({ error: 'seasonId is required' }, { status: 400 });
    }

    // ✅ 1. 현재 시즌의 유효한 스케줄 날짜들 가져오기
    const schedules = await Schedule.find({ seasonId }).select('date');
    const validDates = schedules.map((s) => s.date); // 이미 문자열 형식

    // ✅ 2. 출석 데이터 불러오기
    const attendances = await Attendance.find({ seasonId });

    const userLogs = attendances
      .filter((doc) => validDates.includes(doc.date))
      .map((doc) => {
        const record = doc.records.find(
          (r: AttendanceRecord) => r.memberId === userId
        );
        if (!record) return null;
        return {
          date: doc.date,
          status: record.status,
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime());

    return NextResponse.json(userLogs);
  } catch (error) {
    console.error('[GET /api/attendances/me/logs]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}