import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import { Schedule } from '@/src/models/schedule';

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const seasonId = searchParams.get('seasonId');

  const query = seasonId ? { seasonId } : {};
  const schedules = await Schedule.find(query).sort({ date: 1 });

  return NextResponse.json(schedules);
}

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const { seasonId, date, pieces } = body;

    if (!seasonId || !date || !pieces || !Array.isArray(pieces)) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    const newSchedule = await Schedule.create({ seasonId, date, pieces });
    return NextResponse.json(newSchedule, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
