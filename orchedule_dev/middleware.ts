import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.get('orchedule-auth')?.value === '1';

  // 1. 로그인 상태인데 /login 접근 → 홈으로 리디렉션
  if (pathname.startsWith('/login') && isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. 보호 경로 목록
  const protectedPaths = ['/menu', '/board', '/practice', '/admin'];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  // 3. 로그인 안 돼있는데 보호 경로 접근 → /login
  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/menu/:path*', '/board/:path*', '/practice/:path*', '/admin/:path*', '/login'],
};
