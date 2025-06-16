import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongoose';
import Attendance from '@/src/models/attendance';
import { getTokenDataFromRequest } from '@/src/lib/auth';
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

    const tokenData = getTokenDataFromRequest(req);
    if (!tokenData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = tokenData.id;
    const seasonId = req.nextUrl.searchParams.get('seasonId');
    if (!seasonId) {
      return NextResponse.json({ error: 'seasonId is required' }, { status: 400 });
    }

    const user = await Member.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const joinedAt = new Date(user.joinedAt);

    const scheduleDocs = await PracticeSchedule.find({ seasonId }).select('date');
    const allDates = scheduleDocs.map((s) => s.date); // string[]
    const nextDate = getNearestDate(allDates);

    const validDates = allDates
      .filter((d) => d <= nextDate && new Date(d) >= joinedAt);

    const attendances = await Attendance.find({ seasonId });

    const userLogs = validDates
      .map((date) => {
        const doc = attendances.find((a) => a.date === date);
        const record = doc?.records.find(
          (r: AttendanceRecord) => r.memberId === userId
        );

        return {
          date,
          status: record?.status ?? '출석',
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
