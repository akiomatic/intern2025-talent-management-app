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
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
}
