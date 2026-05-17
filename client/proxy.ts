
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("accessToken");

  const isAuthPage = req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/register");

  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");

  // if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  if (!token && isDashboard) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  // if user is logged in and trying to access auth pages, redirect to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(
      new URL("/dashboard", req.url)
    );
  }


  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};