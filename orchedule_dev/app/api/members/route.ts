import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import Member from "@/src/models/member";
import bcrypt from "bcrypt";

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
    const { name, part, email, password } = await req.json();

    if (!name || !part || !email || !password) {
      return NextResponse.json({ message: "모든 필드가 필요합니다." }, { status: 400 });
    }

    const existing = await Member.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: "이미 존재하는 이메일입니다." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newMember = await Member.create({
      name,
      part,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(newMember, { status: 201 });
  } catch (err) {
    console.error("멤버 추가 실패:", err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}



