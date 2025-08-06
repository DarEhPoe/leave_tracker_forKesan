import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserPermissions } from "@/lib/getUserInfoFromKinde";

const protectedRoutes = [
  'leave_tracker',
  'employee',
  'department',
  'summary',
  'tracker_type',
];

export default withAuth(
  async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const permissions = await getUserPermissions();

    const matchesProtected = protectedRoutes.some((route) => pathname.includes(route));
    const isUnauthorized =
      matchesProtected &&
      !permissions.includes('admin') &&
      !permissions.includes('manager') &&
      pathname !== '/leave_register' &&
      pathname !== '/leave_noti';

    if (isUnauthorized) {
      const url = request.nextUrl.clone();
      url.pathname = '/leave_register';
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    isReturnToCurrentPage: true,
  }
);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|auth|favicon.ico|robots.txt|images|login|$).*)',
  ],
};
