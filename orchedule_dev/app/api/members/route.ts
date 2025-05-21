import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import { Member } from "@/src/models/member";

export async function GET() {
  try {
    await connectDB();
    const members = await Member.find().sort({ part: 1, name: 1 });
    return NextResponse.json(members);
  } catch (error) {
    console.error("멤버 목록 조회 실패:", error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { _id, name, part } = await req.json();

    if (!_id || !name || !part) {
      return NextResponse.json({ message: "모든 필드가 필요합니다." }, { status: 400 });
    }

    const newMember = await Member.create({ _id, name, part });

    return NextResponse.json(newMember, { status: 201 });
  } catch (err) {
    console.error("멤버 추가 실패:", err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

