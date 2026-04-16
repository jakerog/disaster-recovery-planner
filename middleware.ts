import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = (req.auth?.user as any)?.role;

  // Public paths
  if (nextUrl.pathname === "/" || nextUrl.pathname === "/login") {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Admin protection - Allow Admin and Moderator
  if (nextUrl.pathname.startsWith("/admin")) {
    if (!["Admin", "Moderator"].includes(userRole)) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  // Report protection
  if (nextUrl.pathname.startsWith("/reports")) {
    if (!["Admin", "Moderator", "Report"].includes(userRole)) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons|workbox).*)"]
};
