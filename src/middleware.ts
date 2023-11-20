import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import {} from 'next-auth/middleware';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request });
  const isAuthRoute = pathname.startsWith('/auth');

  if (isAuthRoute) {
    if (pathname === '/auth' || pathname === '/auth/') {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }

    if (token) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }
}
