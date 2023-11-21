import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
// import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthRoute = pathname.startsWith('/auth');
  const token = await getToken({ req: request });
  // const isProtectedRoute = [
  //   '/home',
  //   '/favorite',
  //   '/notifications',
  //   '/questions',
  //   '/search',
  //   '/subjects',
  //   '/users',
  // ].some((route) => pathname.startsWith(route));

  if (isAuthRoute) {
    if (token) {
      return NextResponse.redirect(new URL('/home', request.url));
    }

    if (pathname === '/auth' || pathname === '/auth/') {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }
  }

  // if (isProtectedRoute && !token) {
  //   return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  // }
}
