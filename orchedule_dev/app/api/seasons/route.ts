// /api/seasons/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongoose';
import Season from '@/src/models/season';

export async function GET() {
  try {
    await connectDB();
    const seasons = await Season.find();
    return NextResponse.json(seasons);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ success: false, message: '시즌 조회 실패' }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, startDate, endDate, pieces } = await req.json();
    const newSeason = await Season.create({ name, startDate, endDate, pieces });
    return NextResponse.json(newSeason, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ success: false, message: '시즌 추가 실패' }, { status: 500 });
  }
}
