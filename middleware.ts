import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If we are here, authorized() was true.
    // Additional logic can go here if needed.
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isPathAdmin = req.nextUrl.pathname.startsWith("/admin");
        const isLoginPage = req.nextUrl.pathname === "/admin/login";

        // Always allow the login page
        if (isLoginPage) return true;

        // For all other admin paths, require a token with admin role
        if (isPathAdmin) {
          return !!token && token.role === "admin";
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
