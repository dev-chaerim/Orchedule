
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'orchedule-secret-key';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('orchedule-auth')?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: '토큰 없음' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    return NextResponse.json({ success: true, user: decoded });
  } catch (err) {
    console.error("JWT 에러:", err);
    return NextResponse.json({ success: false, message: '토큰 유효하지 않음' }, { status: 401 });
  }
}
