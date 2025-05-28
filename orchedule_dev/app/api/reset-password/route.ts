import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import Member from "@/src/models/member";
import PasswordResetToken from "@/src/models/passwordResetToken";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { token, password } = await req.json();

    if (!token || !password || password.length < 10) {
      return NextResponse.json({ message: "유효하지 않은 요청입니다." }, { status: 400 });
    }

    // 토큰 조회
    const tokenRecord = await PasswordResetToken.findOne({ token });

    if (!tokenRecord) {
      return NextResponse.json({ message: "유효하지 않은 토큰입니다." }, { status: 400 });
    }

    if (tokenRecord.expiresAt < new Date()) {
      return NextResponse.json({ message: "토큰이 만료되었습니다." }, { status: 400 });
    }

    // 사용자 조회
    const user = await Member.findOne({ email: tokenRecord.email });
    if (!user) {
      return NextResponse.json({ message: "사용자를 찾을 수 없습니다." }, { status: 404 });
    }

    // 비밀번호 해시 후 저장
    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    await user.save();

    // 토큰 삭제
    await PasswordResetToken.deleteOne({ token });

    return NextResponse.json({ message: "비밀번호가 성공적으로 변경되었습니다." });
  } catch (err) {
    console.error("비밀번호 재설정 오류:", err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
