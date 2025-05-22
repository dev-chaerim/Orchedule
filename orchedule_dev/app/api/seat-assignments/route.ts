import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import SeatAssignment from "@/src/models/seatAssignment";
import "@/src/models/member"; // ✅ populate("memberId")를 위해 반드시 필요

// 🔍 자리배치 조회
export async function GET(req: NextRequest) {
  await connectDB();

  const seasonId = req.nextUrl.searchParams.get("seasonId");

  if (!seasonId) {
    return NextResponse.json({ error: "seasonId 누락" }, { status: 400 });
  }

  try {
    const assignments = await SeatAssignment.find({ seasonId })
      .sort({ seatNumber: 1 })
      .populate("memberId"); // ✅ member 데이터까지 포함

    return NextResponse.json(assignments);
  } catch (error) {
    console.error("자리배치 조회 에러:", error);
    return NextResponse.json({ error: "서버 내부 에러" }, { status: 500 });
  }
}

// 🔍 자리배치 등록
export async function POST(req: NextRequest) {
  await connectDB();
  const { memberId, seatNumber, seasonId } = await req.json();

  if (!memberId || !seatNumber || !seasonId) {
    return NextResponse.json({ error: "필수 필드 누락" }, { status: 400 });
  }

  try {
    const created = await SeatAssignment.create({ memberId, seatNumber, seasonId });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("자리배치 등록 에러:", error);
    return NextResponse.json({ error: "서버 내부 에러" }, { status: 500 });
  }
}


// app/api/seat-assignments/[id]/route.ts
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const { seatNumber } = await req.json();

  const updated = await SeatAssignment.findByIdAndUpdate(
    params.id,
    { seatNumber },
    { new: true }
  );

  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  await SeatAssignment.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "삭제 완료" });
}
