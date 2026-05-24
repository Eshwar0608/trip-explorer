import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/dashboard/add-place")) {
      if (token?.role !== "admin" && token?.role !== "customer") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      return NextResponse.next();
    }

    if (path.startsWith("/dashboard/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (path.startsWith("/dashboard/customer") && token?.role !== "customer") {
      if (token?.role === "admin") {
        return NextResponse.redirect(new URL("/dashboard/admin", req.url));
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        if (!path.startsWith("/dashboard")) {
          return true;
        }

        if (!token) {
          return false;
        }

        if (path.startsWith("/dashboard/add-place")) {
          return token.role === "admin" || token.role === "customer";
        }

        if (path.startsWith("/dashboard/admin")) {
          return token.role === "admin";
        }

        if (path.startsWith("/dashboard/customer")) {
          return token.role === "customer";
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
