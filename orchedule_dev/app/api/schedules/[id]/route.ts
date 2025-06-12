import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import { PracticeSchedule } from '@/src/models/practiceSchedule';
import Attendance from '@/src/models/attendance'; // ✅ Attendance import 추가

// 무조건 추가
export const dynamic = "force-dynamic";

// ✅ 일정 조회
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // params가 Promise 형태로
) {
  await connectDB();

  const { id } = await context.params; // ✅ 여기서 await 해줘야 해!

  try {
    const schedule = await PracticeSchedule.findById(id);
    if (!schedule) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(schedule);
  } catch (err) {
    console.error('Failed to fetch schedule:', err);
    return NextResponse.json({ message: 'Failed to fetch schedule' }, { status: 500 });
  }
}

// ✅ 일정 수정
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params; // ✅

  try {
    // ✅ 명시적으로 업데이트할 필드만 추출
    const {
      date,
      auditionSessions,
      partSessions,
      orchestraSession,
      specialNotices,
      isCancelled, // ✅ isCancelled 명시적으로 받기
    } = await req.json();

    const updated = await PracticeSchedule.findByIdAndUpdate(
      id,
      {
        date,
        auditionSessions,
        partSessions,
        orchestraSession,
        specialNotices,
        isCancelled,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    console.error('Failed to update schedule:', err);
    return NextResponse.json({ message: 'Failed to update schedule' }, { status: 500 });
  }
}

// ✅ 일정 삭제 (PracticeSchedule + Attendance 같이 삭제)
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params; // ✅

  try {
    const deleted = await PracticeSchedule.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    // ✅ Attendance 같이 삭제
    await Attendance.deleteOne({
      seasonId: deleted.seasonId,
      date: deleted.date,
    });

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Failed to delete schedule:', err);
    return NextResponse.json({ message: 'Failed to delete schedule' }, { status: 500 });
  }
}
