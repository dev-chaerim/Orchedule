// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = process.env.JWT_SECRET || 'orchedule-secret-key';
const encoder = new TextEncoder();

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('orchedule-auth')?.value;

  console.log("✅ middleware 실행됨");
  console.log("🍪 token:", token);

  const protectedPaths = ['/menu', '/board', '/practice', '/admin'];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  // 1. 로그인 상태에서 /login 접근 시 → 홈으로 리디렉션
  if (pathname.startsWith('/login')) {
    if (!token) return NextResponse.next();

    try {
      await jwtVerify(token, encoder.encode(SECRET));
      return NextResponse.redirect(new URL('/', request.url));
    } catch {
      return NextResponse.next();
    }
  }

    // ✅ reset-password 페이지 접근 차단 추가
  if (pathname.startsWith('/reset-password')) {
    if (!token) return NextResponse.next(); // 비로그인 사용자는 통과

    try {
      await jwtVerify(token, encoder.encode(SECRET));
      // 로그인 되어 있으면 홈으로 이동
      return NextResponse.redirect(new URL('/', request.url));
    } catch {
      return NextResponse.next();
    }
  }

    if (pathname.startsWith('/forgot-password')) {
    if (!token) return NextResponse.next(); // 비로그인 사용자는 통과

    try {
      await jwtVerify(token, encoder.encode(SECRET));
      return NextResponse.redirect(new URL('/', request.url));
    } catch {
      return NextResponse.next();
    }
  }



  // 2. 보호된 경로 접근 시 로그인 검증
  if (isProtected) {
    if (!token) {
      console.warn("❗ 보호 경로 접근 → 토큰 없음 → /login");
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(token, encoder.encode(SECRET));
      const user = payload as { role?: string };

      console.log("🎯 사용자 역할:", user.role);

      // 3. 일반 사용자의 /admin 접근 차단
      if (pathname.startsWith('/admin') && user.role !== 'admin') {
        console.warn("🔒 일반 사용자의 /admin 접근 차단");
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (err) {
      console.error("❌ 토큰 검증 실패:", err);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/','/menu/:path*', '/board/:path*', '/practice/:path*', '/admin/:path*', '/login', '/reset-password', '/forgot-password'],
};
