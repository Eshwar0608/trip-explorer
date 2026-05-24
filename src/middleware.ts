import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

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
        if (path.startsWith("/dashboard")) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
