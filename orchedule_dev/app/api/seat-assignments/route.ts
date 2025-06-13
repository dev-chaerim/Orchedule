// app/api/seat-assignments/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import SeatAssignment from "@/src/models/seatAssignment";
import "@/src/models/member"; // populate("memberId") 위해 필요

// 🔍 자리배치 조회 (GET)
export async function GET(req: NextRequest) {
  await connectDB();

  const seasonId = req.nextUrl.searchParams.get("seasonId");

  if (!seasonId) {
    return NextResponse.json({ error: "seasonId 누락" }, { status: 400 });
  }

  try {
    const assignments = await SeatAssignment.find({ seasonId })
      .sort({ seatNumber: 1 })
      .populate("memberId");

    return NextResponse.json(assignments);
  } catch (error) {
    console.error("자리배치 조회 에러:", error);
    return NextResponse.json({ error: "서버 내부 에러" }, { status: 500 });
  }
}

// 🔍 자리배치 등록 (POST)
export async function POST(req: NextRequest) {
  await connectDB();

  const { memberId, seatNumber, seatSide, seasonId } = await req.json();

  if (!memberId || !seatNumber || !seatSide || !seasonId) {
    return NextResponse.json({ error: "필수 필드 누락" }, { status: 400 });
  }

  try {
    const created = await SeatAssignment.create({
      memberId,
      seatNumber,
      seatSide,
      seasonId,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("자리배치 등록 에러:", error);
    return NextResponse.json({ error: "서버 내부 에러" }, { status: 500 });
  }
}
