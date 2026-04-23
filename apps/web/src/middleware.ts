import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedPrefixes = ["/app", "/dashboard", "/admin"];
const authRoutes = ["/login", "/register", "/forgot"];

export default async function middleware(req: NextRequest) {
  if (process.env.E2E_BYPASS_AUTH === "1") {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/admin") && token?.role !== "super_admin") {
    return NextResponse.redirect(new URL("/app", req.url));
  }

  if (isAuthRoute && token) {
    if (token.role === "super_admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.redirect(new URL("/app", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/dashboard/:path*", "/admin/:path*", "/login", "/register", "/forgot"],
};
