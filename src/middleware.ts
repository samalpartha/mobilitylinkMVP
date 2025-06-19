import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// Changed to relative path
import { AUTH_COOKIE_NAME, APP_ROUTES } from './lib/authConstants'; 

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuthCookie = request.cookies.has(AUTH_COOKIE_NAME);

  const isLoginPage = pathname === APP_ROUTES.LOGIN;

  // If authenticated
  if (hasAuthCookie) {
    if (isLoginPage) { // Trying to access login page while authenticated
      return NextResponse.redirect(new URL(APP_ROUTES.DASHBOARD, request.url));
    }
    if (pathname === '/') { // Accessing root while authenticated
       return NextResponse.redirect(new URL(APP_ROUTES.DASHBOARD, request.url));
    }
    // For any other path, allow access (user is authenticated)
    // This assumes all other paths covered by the matcher are protected.
    return NextResponse.next();
  }

  // If not authenticated
  // The matcher already excludes /api, /_next/static, /_next/image, /favicon.ico, /assets
  // So all other paths are app pages/routes.
  if (!isLoginPage) { // Trying to access any page other than login (e.g., /, /dashboard, /profile)
    return NextResponse.redirect(new URL(APP_ROUTES.LOGIN, request.url));
  }
  
  // If on login page and not authenticated, allow access
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
