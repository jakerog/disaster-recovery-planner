import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req: NextRequest & { auth: any }) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // Public paths
  if (nextUrl.pathname === "/" || nextUrl.pathname === "/login") {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Admin protection
  if (nextUrl.pathname.startsWith("/admin")) {
    if (userRole !== "Admin") return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Report protection
  if (nextUrl.pathname.startsWith("/reports")) {
    if (!["Admin", "Moderator", "Report"].includes(userRole)) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  // Exercise and Availability are for all authenticated users (RBAC handled at component level for editing)

  return NextResponse.next();
});

export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"] };
