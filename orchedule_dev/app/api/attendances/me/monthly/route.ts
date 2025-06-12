import { NextRequest, NextResponse } from 'next/server';
import { getTokenDataFromRequest } from '@/src/lib/auth';
import { connectDB } from '@/src/lib/mongoose';
import Attendance from '@/src/models/attendance';
import { PracticeSchedule } from '@/src/models/practiceSchedule';
import { getMonth } from 'date-fns';

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

    // ✅ 미래 일정 제외 위해 PracticeSchedule에서 날짜 기준 가져오기
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const scheduleDocs = await PracticeSchedule.find({
      seasonId,
      isCancelled: { $ne: true },
    });

    const validDates = scheduleDocs
      .map((s) => new Date(s.date))
      .filter((d) => d <= today) // ✅ 미래 일정 제외
      .map((d) => d.toISOString().slice(0, 10)); // YYYY-MM-DD 형식

    const attendanceDocs = await Attendance.find({
      seasonId,
      date: { $in: validDates },
    });

    // 월별 출석(출석 + 지각 + 기록 없음) 카운트 초기화
    const monthlyCounts: Record<number, number> = {};

    for (const doc of attendanceDocs) {
      const record = doc.records.find(
        (r: AttendanceRecord) => String(r.memberId) === String(userId)
      );

      const month = getMonth(new Date(doc.date)) + 1; // 0~11 → 1~12

      // ✅ record 없으면 출석으로 간주
      if (!record) {
        monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
      } else {
        if (record.status === '출석' || record.status === '지각') {
          monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
        }
        // 불참은 카운트하지 않음
      }
    }

    // 응답 형태 맞추기: [{ month: '1월', value: 2 }, ...]
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
