import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server'
import { LOCALES, DEFAULT_LOCALE } from '@/const/locales'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
 
  if (pathnameHasLocale) return;
 
  request.nextUrl.pathname = `/${DEFAULT_LOCALE}${pathname}`

  return NextResponse.redirect(request.nextUrl);
}
 
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
