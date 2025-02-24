import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // console.log(token);

  // Redirect to login if not authenticated and not on public paths
  if (
    !token &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/sign-up") &&
    pathname !== "/"
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect authenticated users away from login and sign-up pages if their setup is complete
  if (token && (pathname === "/login" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // Allow users to proceed to their requested page if no redirects are needed
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
