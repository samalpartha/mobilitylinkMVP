
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME, APP_ROUTES } from './lib/authConstants'; 

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuthCookie = request.cookies.has(AUTH_COOKIE_NAME);

  const isAuthPage = pathname === APP_ROUTES.LOGIN || pathname === APP_ROUTES.REGISTER;

  // If authenticated
  if (hasAuthCookie) {
    if (isAuthPage) { // Trying to access login or register page while authenticated
      return NextResponse.redirect(new URL(APP_ROUTES.DASHBOARD, request.url));
    }
    if (pathname === '/') { // Accessing root while authenticated
       return NextResponse.redirect(new URL(APP_ROUTES.DASHBOARD, request.url));
    }
    // For any other path, allow access (user is authenticated)
    return NextResponse.next();
  }

  // If not authenticated
  if (!isAuthPage) { // Trying to access any protected page
    return NextResponse.redirect(new URL(APP_ROUTES.LOGIN, request.url));
  }
  
  // If on login/register page and not authenticated, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (static assets)
     * This will include '/', '/login', '/dashboard', etc.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};
