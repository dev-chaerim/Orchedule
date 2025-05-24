// app/api/attendances/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTokenDataFromRequest } from '@/src/lib/auth'; // 너가 만든 토큰 파싱 함수
import { connectDB } from '@/src/lib/mongoose';
import Attendance from '@/src/models/attendance';

interface AttendanceRecord {
  memberId: string;
  status: '출석' | '지각' | '결석';
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

    let attended = 0;
    let absent = 0;

   for (const doc of attendanceDocs) {
    const record = doc.records.find(
        (r:AttendanceRecord) => String(r.memberId) === String(userId)
    );

    if (!record) {
        attended += 1; // 기록이 없으면 출석으로 간주
    } else {
        if (record.status === '출석' || record.status === '지각') {
        attended += 1;
        } else {
        absent += 1; // 불참만 결석으로
        }
    }
    }

    const total = attended + absent;
    const rate = total > 0 ? Math.round((attended / total) * 100) : 0;

    return NextResponse.json({
      attended,
      absent,
      total,
      rate,
    });
  } catch (error) {
    console.error('[GET /api/attendances/me]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
