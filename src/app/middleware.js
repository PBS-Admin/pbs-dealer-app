import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    try {
      const token = req.nextauth.token;

      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.error('Middleware error:', error);
      // Redirect to login on any errors
      return NextResponse.redirect(new URL('/login', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
      error: '/error',
    },
  }
);

export const config = {
  matcher: ['/protected/:path*'],
};
