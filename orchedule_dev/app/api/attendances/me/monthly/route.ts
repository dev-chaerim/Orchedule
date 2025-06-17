import { NextRequest, NextResponse } from 'next/server';
import { getTokenDataFromRequest } from '@/src/lib/auth';
import { connectDB } from '@/src/lib/mongoose';
import Attendance from '@/src/models/attendance';
import { PracticeSchedule } from '@/src/models/practiceSchedule';
import { getMonth } from 'date-fns';
import { getLastOpenSchedule } from '@/src/lib/utils/getLastOpenSchedule';

interface AttendanceRecord {
  memberId: string;
  status: '출석' | '지각' | '불참';
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const seasonId = req.nextUrl.searchParams.get('seasonId');
    if (!seasonId) {
      return NextResponse.json({ error: 'seasonId is required' }, { status: 400 });
    }

    const tokenData = getTokenDataFromRequest(req);
    if (!tokenData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = tokenData.id;

    // ✅ 모든 일정 불러오기 (휴강 제외)
    const scheduleDocs = await PracticeSchedule.find({
      seasonId,
      isCancelled: { $ne: true },
    });

    // ✅ 출석부가 열려 있는 마지막 일정 계산
    const lastOpen = getLastOpenSchedule(scheduleDocs);
    if (!lastOpen) {
      return NextResponse.json([]);
    }

    // ✅ lastOpen 이전까지의 연습일 필터
    const validDates = scheduleDocs
      .filter((s) => s.date <= lastOpen)
      .map((s) => s.date); // string[]

    // ✅ 해당 날짜에 해당하는 출석부만 가져오기
    const attendanceDocs = await Attendance.find({
      seasonId,
      date: { $in: validDates },
    });

    const monthlyCounts: Record<number, number> = {};

    for (const doc of attendanceDocs) {
      const record = doc.records.find(
        (r: AttendanceRecord) => String(r.memberId) === String(userId)
      );

      const month = getMonth(new Date(doc.date)) + 1;

      if (!record) {
        monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
      } else {
        if (record.status === '출석' || record.status === '지각') {
          monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
        }
      }
    }

    const result = Object.entries(monthlyCounts).map(([month, value]) => ({
      month: `${month}월`,
      value,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('[GET /api/attendances/me/monthly]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
