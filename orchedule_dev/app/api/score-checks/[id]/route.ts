import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import Score from "@/src/models/score";

// GET: 특정 보잉체크 조회
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await connectDB();
  const { id } = await context.params;

  const score = await Score.findById(id);

  if (!score || score.type !== "bowing") {
    return NextResponse.json(
      { error: "보잉체크 악보를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  return NextResponse.json(score);
}

// DELETE: 삭제
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await connectDB();
  const { id } = await context.params;

  const score = await Score.findById(id);
  if (!score || score.type !== "bowing") {
    return NextResponse.json(
      { error: "보잉체크 악보를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  await Score.findByIdAndDelete(id);
  return NextResponse.json({ message: "삭제 완료" });
}

// PUT: 수정
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await connectDB();
  const { id } = await context.params;
  const body = await req.json();

  const updated = await Score.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    return NextResponse.json({ error: "수정 실패" }, { status: 404 });
  }

  return NextResponse.json(updated);
}
