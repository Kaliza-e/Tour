import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin") && !["ADMIN", "REVIEWER"].includes(String(token?.role))) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Protect author/writer routes — require authentication
    const writerPaths = ["/dashboard", "/researcher", "/workspace", "/submit", "/achievements", "/settings", "/my-submissions"];
    const isWriterPath = writerPaths.some((p) => path === p || path.startsWith(`${p}/`));

    if (isWriterPath && !token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(url);
    }

    // Redirect authenticated users away from auth pages
    const authPaths = ["/login", "/join"];
    const isAuthPath = authPaths.some((p) => path === p || path.startsWith(`${p}/`));

    if (isAuthPath && token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (path.startsWith("/admin")) {
          return ["ADMIN", "REVIEWER"].includes(String(token?.role));
        }
        const writerPaths = ["/dashboard", "/researcher", "/workspace", "/submit", "/achievements", "/settings", "/my-submissions"];
        const isWriterPath = writerPaths.some((p) => path === p || path.startsWith(`${p}/`));

        // Allow access to writer paths only if authenticated
        if (isWriterPath) {
          return !!token;
        }

        // Allow all other paths
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/researcher/:path*",
    "/workspace/:path*",
    "/submit/:path*",
    "/achievements/:path*",
    "/settings/:path*",
    "/my-submissions/:path*",
    "/admin/:path*",
    "/login",
    "/join",
  ],
};