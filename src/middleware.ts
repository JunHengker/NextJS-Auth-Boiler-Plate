import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });
  const pathname = req.nextUrl.pathname;

  const protectedRoutes = ["/protected"];

  if (protectedRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
