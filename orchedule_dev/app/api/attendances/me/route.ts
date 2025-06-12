import { NextRequest, NextResponse } from 'next/server';
import { getTokenDataFromRequest } from '@/src/lib/auth';
import { connectDB } from '@/src/lib/mongoose';
import Attendance from '@/src/models/attendance';
import { PracticeSchedule } from '@/src/models/practiceSchedule';
import Member from '@/src/models/member';

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

    // ✅ 1. 유효한 연습일 가져오기 (isCancelled 제외)
    const scheduleDocs = await PracticeSchedule.find({
      seasonId,
      isCancelled: { $ne: true },
    });

    const scheduleDates = scheduleDocs
      .map((schedule) => ({
        date: schedule.date,
        dateObj: new Date(schedule.date),
      }))
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

    // ✅ 2. Attendance 데이터 가져오기
    const attendanceDocs = await Attendance.find({ seasonId });

    // ✅ 3. 카운트 초기화
    let attended = 0;
    let absent = 0;
    let tardy = 0;
    let notParticipated = 0;
    let notMarked = 0;

    // ✅ 4. 출석 계산
    for (const { date, dateObj } of scheduleDates) {
      if (dateObj < joinedAt) {
        notParticipated += 1;
        continue;
      }

      const doc = attendanceDocs.find((doc) => doc.date === date);

      if (!doc) {
        // 출석부 없음 → notMarked 처리
        notMarked += 1;
        continue;
      }

      const record = doc.records.find(
        (r: AttendanceRecord) => String(r.memberId) === String(userId)
      );

      if (!record) {
        notMarked += 1;
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

    // ✅ 5. 출석률 계산
    const total = scheduleDates.length;
    const effectiveTotal = total - notParticipated;

    const rate =
      effectiveTotal - notMarked > 0
        ? Math.round(((attended) / (effectiveTotal - notMarked)) * 100)
        : 0;

    return NextResponse.json({
      attended,
      absent,
      tardy,
      notParticipated,
      notMarked,
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
