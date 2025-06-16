import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import Season from "@/src/models/season";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  try {
    const season = await Season.findById(params.id).populate("members");
    if (!season) {
      return NextResponse.json({ message: "시즌을 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json(season.members); // ✅ 단원 목록만 반환
  } catch (err) {
    console.error("시즌 멤버 조회 실패:", err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
