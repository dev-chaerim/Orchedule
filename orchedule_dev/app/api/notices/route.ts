import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongoose';
import Notice from '@/models/notice';
import type { FilterQuery } from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const season = searchParams.get('season');

    const filter: FilterQuery<typeof Notice> = {};

    if (season) {
      filter.$or = [
        { season },
        { isGlobal: true },
      ];
    }

    const notices = await Notice.find(filter).sort({ pinned: -1, date: -1 });

    return NextResponse.json(notices);
  } catch (err) {
    console.error('공지 조회 실패:', err);
    return NextResponse.json({ message: '공지 조회 실패' }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const newNotice = await Notice.create(body);
    return NextResponse.json(newNotice, { status: 201 });
  } catch (err) {
    console.error('공지 등록 실패:', err);
    return NextResponse.json({ message: '공지 등록 실패' }, { status: 500 });
  }
}
