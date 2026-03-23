import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { ROLE_DASHBOARD_MAP, canAccess } from '@/lib/roles'
import { Role } from '@/types'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET

  // NextAuth v5 (Auth.js) uses 'authjs.session-token' cookie on HTTP
  // and '__Secure-authjs.session-token' on HTTPS
  const isSecure = req.nextUrl.protocol === 'https:'
  const cookieName = isSecure
    ? '__Secure-authjs.session-token'
    : 'authjs.session-token'

  const token = await getToken({ req, secret, cookieName })
  const role = token?.role as Role | undefined

  // Debug logging for Vercel
  if (!token) {
    const cookies = req.cookies.getAll().map(c => c.name)
    console.log(`[middleware] No token found. Path: ${pathname}, Cookies: [${cookies.join(', ')}], CookieName tried: ${cookieName}`)
  }

  if (pathname.startsWith('/dashboard')) {
    if (!role) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    if (!canAccess(role, pathname)) {
      return NextResponse.redirect(new URL(ROLE_DASHBOARD_MAP[role], req.url))
    }
  }

  if (pathname === '/login' && role) {
    return NextResponse.redirect(new URL(ROLE_DASHBOARD_MAP[role], req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
