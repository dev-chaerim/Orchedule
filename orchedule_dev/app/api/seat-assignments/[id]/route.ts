// app/api/seat-assignments/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import SeatAssignment from "@/src/models/seatAssignment";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  await connectDB();

  const { seatNumber, seatSide } = await req.json();

  try {
    const updated = await SeatAssignment.findByIdAndUpdate(
      id,
      {
        seatNumber,
        seatSide,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "SeatAssignment not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("자리배치 수정 에러:", error);
    return NextResponse.json({ error: "서버 내부 에러" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  await connectDB();

  try {
    await SeatAssignment.findByIdAndDelete(id);

    return NextResponse.json({ message: "삭제 완료" });
  } catch (error) {
    console.error("자리배치 삭제 에러:", error);
    return NextResponse.json({ error: "서버 내부 에러" }, { status: 500 });
  }
}
