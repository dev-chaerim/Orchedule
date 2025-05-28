// app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import Member from '@/src/models/member';
import { connectDB } from '@/src/lib/mongoose';

const SECRET = process.env.JWT_SECRET || 'orchedule-secret-key';

export async function POST(req: NextRequest) {
  await connectDB();

  const { email, password } = await req.json();

  // ✅ DB에서 이메일로 사용자 찾기
  const member = await Member.findOne({ email });

  if (!member) {
    return NextResponse.json(
      { success: false, message: '사용자를 찾을 수 없습니다.' },
      { status: 404 }
    );
  }

   const isPasswordValid = await bcrypt.compare(password, member.password);

  // ✅ 패스워드 확인 (지금은 임시로 '1234' 고정)
  if (!isPasswordValid) {
    return NextResponse.json(
      { success: false, message: '비밀번호가 틀렸습니다.' },
      { status: 401 }
    );
  }

  // ✅ 토큰 발급
  const token = jwt.sign(
    {
      id: member._id,
      name: member.name,
      part: member.part,
      role: member.role ?? 'user',
    },
    SECRET,
    { expiresIn: '7d' }
  );

 const res = NextResponse.json({
  success: true,
  user: {
    id: member._id,
    name: member.name,
    part: member.part,
    email: member.email,
    role: member.role,
  },
});

console.log("@@@res", res)


  // ✅ 쿠키에 토큰 저장
  res.cookies.set('orchedule-auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
