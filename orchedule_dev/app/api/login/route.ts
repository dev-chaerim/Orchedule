// orchedule_dev/app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'orchedule-secret-key';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // ✅ 관리자 계정
  if (email === 'admin@naver.com' && password === '1234') {
    const user = {
      id: 'admin123',  // ✅ ID 추가
      name: '관리자',
      part: '지휘자',
      role: 'admin',
    };

    const token = jwt.sign(user, SECRET, { expiresIn: '7d' });
    const res = NextResponse.json({ success: true, user });
    res.cookies.set('orchedule-auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  }

  // ✅ 일반 사용자 계정
  if (email === 'user@naver.com' && password === '1234') {
    const user = {
      id: 'user123',  // ✅ ID 추가
      name: '김단원',
      part: 'Vn1',
      role: 'user',
    };

    const token = jwt.sign(user, SECRET, { expiresIn: '7d' });
    const res = NextResponse.json({ success: true, user });
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
