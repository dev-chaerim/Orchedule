import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/src/lib/mongoose';
import Attendance from '@/src/models/attendance';

const SECRET = process.env.JWT_SECRET || 'orchedule-secret-key';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('orchedule-auth')?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: '토큰 없음' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET) as { id: string };

    await connectDB();

    const userAttendance = await Attendance.find({ userId: decoded.id });

    const attended = userAttendance.filter((record) => record.status === '출석').length;
    const absent = userAttendance.filter((record) => record.status === '불참').length;
    const total = attended + absent;
    const attendanceRate = total > 0 ? Math.round((attended / total) * 100) : 0;

    const records = userAttendance.map((record) => ({
      date: record.date,
      status: record.status,
    }));

    return NextResponse.json({
      success: true,
      attended,
      absent,
      attendanceRate,
      records,
    });
  } catch (err) {
    console.error("JWT 에러 또는 DB 에러:", err);
    return NextResponse.json({ success: false, message: '유효하지 않은 요청' }, { status: 401 });
  }
}
