import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import Score from "@/models/score";

export const dynamic = "force-dynamic";

// ✅ DELETE /api/scores/[id]
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await context.params;

  try {
    const deleted = await Score.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: "악보를 찾을 수 없습니다." }, { status: 404 });
    }
    return NextResponse.json({ message: "삭제 완료" });
  } catch (err) {
    console.error("악보 삭제 실패:", err);
    return NextResponse.json({ message: "악보 삭제 실패" }, { status: 500 });
  }
}


export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const { id } = await params;

  try {
    const sheet = await Score.findById(id);
    if (!sheet) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json(sheet);
  } catch (err) {
    console.error("악보 상세 조회 실패:", err);
    return NextResponse.json({ message: "조회 실패" }, { status: 500 });
  }
}


export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const { id } = await params;

  try {
    const updateData = await req.json();

    const updated = await Score.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("악보 수정 실패:", err);
    return NextResponse.json({ message: "수정 실패" }, { status: 500 });
  }
}
