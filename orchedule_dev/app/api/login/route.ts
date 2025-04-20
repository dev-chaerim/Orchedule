import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!;
if (!SECRET) throw new Error('JWT_SECRET 환경변수가 설정되지 않았습니다.');

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (email === 'test@naver.com' && password === '1234') {
    const user = {
      name: '김단원',
      part: 'Vn1',
      role: 'user',
    };

    const token = jwt.sign(user, SECRET, { expiresIn: '7d' });

    const res = NextResponse.json({ success: true });
    res.cookies.set('orchedule-auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  }

  return NextResponse.json(
    { success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
    { status: 401 }
  );
}
