import { auth } from "@/auth"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isAdminLoginRoute = nextUrl.pathname === "/admin/login"
  const isCustomerLoginRoute = nextUrl.pathname === "/login"
  const isAdminRoute = nextUrl.pathname.startsWith("/admin") && !isAdminLoginRoute
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard")

  // Allow auth api routes
  if (isApiAuthRoute) return

  const role = (req.auth?.user as any)?.role

  // Handle users trying to access login pages while already logged in
  if (isLoggedIn && (isAdminLoginRoute || isCustomerLoginRoute)) {
    if (role === "ADMIN" || role === "STORE_MANAGER" || role === "INVENTORY_MANAGER") {
      return Response.redirect(new URL("/admin", nextUrl))
    }
    return Response.redirect(new URL("/", nextUrl))
  }

  // Protect admin routes
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/admin/login", nextUrl))
    }
    if (role !== "ADMIN" && role !== "STORE_MANAGER" && role !== "INVENTORY_MANAGER") {
      return Response.redirect(new URL("/", nextUrl))
    }
    return
  }

  // Protect customer dashboard
  if (isDashboardRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/login", nextUrl))
    }
    return
  }
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
