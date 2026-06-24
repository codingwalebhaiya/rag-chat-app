
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export default function proxy(req: NextRequest) {
//   const accessToken = req.cookies.get("accessToken")?.value;
//   const refreshToken = req.cookies.get("refreshToken")?.value;

//  // Check if user is authenticated (has at least one token)
//   const isAuthenticated = !!accessToken || !!refreshToken;

  
//   // Current path
//   const pathname = req.nextUrl.pathname;
//   const isAuthPage = pathname.startsWith("/login") ||
//     pathname.startsWith("/register");

//     // Protected routes
//   const isProtectedRoute =
//     pathname.startsWith("/chats") ||
//     pathname.startsWith("/settings") ||
//     pathname === "/";

//   //const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
//   const isChat = pathname.startsWith("/chat");

//   // If user is NOT logged in and trying to access protected content

//   if (!token && (isDashboard || isChat)) {
//     return NextResponse.redirect(
//       new URL("/login", req.url)
//     );
//   }

//   // If user IS logged in and trying to hit login/register pages, bounce them to dashboard
//   if (token && isAuthPage) {
//     return NextResponse.redirect(
//       new URL("/dashboard", req.url)
//     );
//   }


//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/chat/:path*", "/login", "/register"],
// };


// middleware.ts (Advanced with Role-Based Access)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const isAuthenticated = !!accessToken || !!refreshToken;
  const pathname = req.nextUrl.pathname;

  // Decode user role from cookie or token (if you store it)
  const userRole = req.cookies.get("userRole")?.value || "USER";

  // Auth pages
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // Protected routes
  const isProtectedRoute =
    pathname.startsWith("/chats") ||
    pathname.startsWith("/settings");

  // Admin routes
  const isAdminRoute = pathname.startsWith("/admin");

  // ==========================================
  // CASE 1: Admin Routes - Admin Only
  // ==========================================
  if (isAdminRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // ==========================================
  // CASE 2: Protected Routes - Must be Authenticated
  // ==========================================
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ==========================================
  // CASE 3: Auth Pages - Already Authenticated
  // ==========================================
  if (isAuthPage && isAuthenticated) {
    // Redirect admins to admin dashboard
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ==========================================
  // CASE 4: Add Security Headers
  // ==========================================
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  
  return response;
}

export const config = {
  matcher: [
    "/chats/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/",
  ],
};