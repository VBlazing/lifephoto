/*
 * @Author: VBlazing
 * @Date: 2025-11-06 22:32:53
 * @LastEditors: VBlazing
 * @LastEditTime: 2025-11-18 10:08:02
 * @Description: proxy 代理
 */
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname.endsWith('/')) {
    return NextResponse.redirect(new URL('/beauty', request.url))
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
}