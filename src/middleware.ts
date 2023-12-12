import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const isAuthRoute = pathname.startsWith('/auth');

	if (isAuthRoute) {
		if (pathname === '/auth' || pathname === '/auth/') {
			return NextResponse.redirect(new URL('/auth/sign-in', request.url));
		}
	}
}
