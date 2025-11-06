/*
 * @Author: VBlazing
 * @Date: 2025-11-06 22:32:53
 * @LastEditors: VBlazing
 * @LastEditTime: 2025-11-06 23:02:07
 * @Description: proxy 代理
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  console.log('request', request)
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
}