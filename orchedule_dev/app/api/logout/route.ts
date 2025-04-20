// app/api/logout/route.ts
import { NextResponse } from 'next/server';

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set('orchedule-auth', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0, // 쿠키 즉시 삭제
  });
  return res;
}
