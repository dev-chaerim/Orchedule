// /api/seasons/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongoose';
import Season from '@/src/models/season';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const season = await Season.findById(params.id);  // ✅ ID로 조회
    if (!season) {
      return NextResponse.json({ success: false, message: '시즌을 찾을 수 없습니다.' }, { status: 404 });
    }
    return NextResponse.json(season);
  } catch (error) {
    console.error("시즌 조회 오류:", error);
    return NextResponse.json({ success: false, message: '서버 오류' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { name, startDate, endDate, pieces } = await req.json();
    const updatedSeason = await Season.findByIdAndUpdate(
      params.id,
      { name, startDate, endDate, pieces },
      { new: true }
    );
    return NextResponse.json(updatedSeason);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ success: false, message: '시즌 수정 실패' }, { status: 500 });
}
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        await Season.findByIdAndDelete(params.id);
        return NextResponse.json({ success: true, message: '시즌 삭제 완료' });
    } catch (error) {
      console.log(error)
    return NextResponse.json({ success: false, message: '시즌 삭제 실패' }, { status: 500 });
  }
}

