import { NextRequest, NextResponse } from 'next/server';
import { getTokenDataFromRequest } from '@/src/lib/auth';
import { connectDB } from '@/src/lib/mongoose';
import Attendance from '@/src/models/attendance';
import { PracticeSchedule } from '@/src/models/practiceSchedule';
import Member from '@/src/models/member';
import { getLastOpenSchedule } from '@/src/lib/utils/getLastOpenSchedule';
import { Schedule } from '@/src/lib/types/schedule';

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

    // ✅ 전체 연습일 (취소된 일정 제외)
    const scheduleDocs: Schedule[] = await PracticeSchedule.find({
      seasonId,
      isCancelled: { $ne: true },
    });

    // ✅ 오늘 이전에 출석부가 열렸던 가장 마지막 일정
    const lastOpen = getLastOpenSchedule(scheduleDocs);
    if (!lastOpen) {
      return NextResponse.json({
        attended: 0,
        absent: 0,
        tardy: 0,
        notParticipated: 0,
        total: 0,
        effectiveTotal: 0,
        rate: 0,
        joinedAt: userDoc.joinedAt,
      });
    }

    // ✅ lastOpen 날짜까지만 필터링
    const validDates = scheduleDocs
      .filter((s) => s.date <= lastOpen)
      .map((s) => ({
        date: s.date,
        dateObj: new Date(s.date),
      }))
      .filter((s) => s.dateObj >= joinedAt)
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
