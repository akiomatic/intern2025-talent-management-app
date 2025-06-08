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
    '/((?!_next).*)',
  ],
}
