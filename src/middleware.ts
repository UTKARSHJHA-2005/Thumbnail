// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request,secret:process.env.AUTH_SECRET });

  // If the user is not authenticated, redirect to /signin
  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Protect only specific routes
export const config = {
  matcher: ["/dashboard/:path*"], // add more routes as needed
};
