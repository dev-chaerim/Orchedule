import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongoose';
import SeasonScore from '@/src/models/seasonScore';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;

  try {
    const score = await SeasonScore.findById(id);
    if (!score) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(score);
  } catch (err) {
    console.error('시즌악보 상세 조회 실패:', err);
    return NextResponse.json({ message: '시즌악보 상세 조회 실패' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;

  try {
    const updateData = await req.json();

    const updated = await SeasonScore.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err) {
    console.error('시즌악보 수정 실패:', err);
    return NextResponse.json({ message: '시즌악보 수정 실패' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;

  try {
    const deleted = await SeasonScore.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('시즌악보 삭제 실패:', err);
    return NextResponse.json({ message: '시즌악보 삭제 실패' }, { status: 500 });
  }
}
