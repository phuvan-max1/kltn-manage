import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { ROLE_DASHBOARD_MAP, canAccess } from '@/lib/roles'
import { Role } from '@/types'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const role = token?.role as Role | undefined

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
