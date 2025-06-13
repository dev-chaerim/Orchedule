import { connectDB } from "@/src/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import Season from "@/src/models/season";
import "@/src/models/member"; // ✅ populate 사용 시 필요

// 🔍 시즌 단건 조회
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const season = await Season.findById(params.id).populate("members");

    if (!season) {
      return NextResponse.json({ error: "시즌을 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json(season);
  } catch (error) {
    console.error("시즌 조회 에러:", error);
    return NextResponse.json({ error: "서버 에러" }, { status: 500 });
  }
}

// ✏️ 시즌 수정
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  const { name, startDate, endDate, pieces, members } = await req.json();

  try {
    const updated = await Season.findByIdAndUpdate(
      params.id,
      {
        name,
        startDate,
        endDate: endDate || null,
        pieces: pieces || [],
        members: members || [], // ✅ members 수정 반영
      },
      { new: true }
    ).populate("members");

    return NextResponse.json(updated);
  } catch (error) {
    console.error("시즌 수정 에러:", error);
    return NextResponse.json({ error: "서버 에러" }, { status: 500 });
  }
}

// 🗑️ 시즌 삭제
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    await Season.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "시즌 삭제 완료" });
  } catch (error) {
    console.error("시즌 삭제 에러:", error);
    return NextResponse.json({ error: "서버 에러" }, { status: 500 });
  }
}
