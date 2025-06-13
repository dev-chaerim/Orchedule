import { connectDB } from "@/src/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import Season from "@/src/models/season";
import "@/src/models/member"; // ✅ populate 사용 시 필요

// 🔍 시즌 목록 조회 (members 포함)
export async function GET() {
  await connectDB();

  try {
    const seasons = await Season.find().sort({ startDate: -1 }).populate("members");
    return NextResponse.json(seasons);
  } catch (error) {
    console.error("시즌 목록 조회 에러:", error);
    return NextResponse.json({ error: "서버 에러" }, { status: 500 });
  }
}

// 📝 시즌 등록
export async function POST(req: NextRequest) {
  await connectDB();

  const { name, startDate, endDate, pieces, members } = await req.json();

  if (!name || !startDate) {
    return NextResponse.json({ error: "name, startDate는 필수입니다." }, { status: 400 });
  }

  try {
    const created = await Season.create({
      name,
      startDate,
      endDate: endDate || null,
      pieces: pieces || [],
      members: members || [], // ✅ members 저장
    });

    const populated = await Season.findById(created._id).populate("members");

    return NextResponse.json(populated, { status: 201 });
  } catch (error) {
    console.error("시즌 등록 에러:", error);
    return NextResponse.json({ error: "서버 에러" }, { status: 500 });
  }
}
