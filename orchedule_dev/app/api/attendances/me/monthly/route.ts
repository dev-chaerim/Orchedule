import { NextRequest, NextResponse } from 'next/server';
import { getTokenDataFromRequest } from '@/src/lib/auth';
import { connectDB } from '@/src/lib/mongoose';
import Attendance from '@/src/models/attendance';
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

    const attendanceDocs = await Attendance.find({ seasonId });

    // 월별 출석(출석 + 지각) 카운트 초기화
    const monthlyCounts: Record<number, number> = {};

    for (const doc of attendanceDocs) {
      const record = doc.records.find(
        (r: AttendanceRecord) => String(r.memberId) === String(userId)
      );

      // 출석 or 지각일 때만 포함
      if (!record || record.status === '출석' || record.status === '지각') {
        const month = getMonth(new Date(doc.date)) + 1; // 0~11 → 1~12
        monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
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
