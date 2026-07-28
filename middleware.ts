import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET })
  const pathname = req.nextUrl.pathname

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // If not logged in, or not an ADMIN, redirect to home page
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // If a logged-in ADMIN tries to access /login or /admin/login, maybe redirect to /admin
  if ((pathname === '/login' || pathname === '/admin/login') && token?.role === 'ADMIN') {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  // If a logged-in non-ADMIN tries to access /admin/login, redirect to /
  if (pathname === '/admin/login' && token && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
