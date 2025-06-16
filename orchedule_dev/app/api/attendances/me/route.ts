import { NextRequest, NextResponse } from 'next/server';
import { getTokenDataFromRequest } from '@/src/lib/auth';
import { connectDB } from '@/src/lib/mongoose';
import Attendance from '@/src/models/attendance';
import { PracticeSchedule } from '@/src/models/practiceSchedule';
import Member from '@/src/models/member';
import { getNearestDate } from '@/src/lib/utils/getNearestDate';

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
    const userDoc = await Member.findById(userId);
    if (!userDoc) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const joinedAt = new Date(userDoc.joinedAt);

    // ✅ 전체 연습일 → 다음 연습일까지 필터
    const scheduleDocs = await PracticeSchedule.find({
      seasonId,
      isCancelled: { $ne: true },
    });

    const allDates = scheduleDocs.map((s) => s.date); // string[]
    const nextDate = getNearestDate(allDates);
    const validDates = allDates
      .filter((d) => d <= nextDate)
      .map((d) => ({
        date: d,
        dateObj: new Date(d),
      }))
      .filter((s) => s.dateObj >= joinedAt) // 가입일 이후만
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

    const attendanceDocs = await Attendance.find({ seasonId });

    let attended = 0;
    let absent = 0;
    let tardy = 0;
    let notParticipated = 0;

    for (const { date, dateObj } of validDates) {
      if (dateObj < joinedAt) {
        notParticipated += 1;
        continue;
      }

      const doc = attendanceDocs.find((doc) => doc.date === date);
      const record = doc?.records.find(
        (r: AttendanceRecord) => String(r.memberId) === String(userId)
      );

      if (!record) {
        attended += 1;
      } else {
        if (record.status === '출석') {
          attended += 1;
        } else if (record.status === '지각') {
          attended += 1;
          tardy += 1;
        } else if (record.status === '불참') {
          absent += 1;
        }
      }
    }

    const total = validDates.length;
    const effectiveTotal = total - notParticipated;
    const rate = effectiveTotal > 0 ? Math.round((attended / effectiveTotal) * 100) : 0;

    return NextResponse.json({
      attended,
      absent,
      tardy,
      notParticipated,
      total,
      effectiveTotal,
      rate,
      joinedAt: userDoc.joinedAt,
    });
  } catch (error) {
    console.error('[GET /api/attendances/me]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
