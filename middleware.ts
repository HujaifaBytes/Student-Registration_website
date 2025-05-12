import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define paths that require authentication
  const isAdminPath = path.startsWith("/admin") && !path.startsWith("/admin/login")

  // Get the admin session cookie
  const adminSession = request.cookies.get("admin_session")?.value

  // Check if the user is logged in
  const isLoggedIn = adminSession ? JSON.parse(adminSession).loggedIn : false

  // If the path requires authentication and the user is not logged in, redirect to login
  if (isAdminPath && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  // If the user is already logged in and tries to access the login page, redirect to dashboard
  if (path === "/admin/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
