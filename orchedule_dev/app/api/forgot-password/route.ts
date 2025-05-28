import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import Member from "@/src/models/member";
import PasswordResetToken from "@/src/models/passwordResetToken";
import { sendResetEmail } from "@/src/lib/mail/sendResetEmail";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "이메일이 필요합니다." }, { status: 400 });
    }

    const user = await Member.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "가입된 이메일이 아닙니다." }, { status: 404 });
    }

    // 기존 토큰 삭제
    await PasswordResetToken.deleteMany({ email });

    // 토큰 생성 (랜덤 문자열)
    const token = crypto.randomBytes(32).toString("hex");

    // 토큰 저장 (1시간 유효)
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1시간
    await PasswordResetToken.create({ email, token, expiresAt });

    // 메일 전송
    await sendResetEmail(email, token);

    return NextResponse.json({ message: "재설정 링크가 전송되었습니다." });
  } catch (err) {
    console.error("비밀번호 재설정 요청 오류:", err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
