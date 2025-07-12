import { NextRequest, NextResponse } from 'next/server';

// Define quais rotas serão protegidas por este middleware
export const config = {
  matcher: '/admin',
};

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');
  const url = req.nextUrl;

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    const validUser = process.env.ADMIN_USER;
    const validPass = process.env.ADMIN_PASS;

    if (user === validUser && pwd === validPass) {
      return NextResponse.next();
    }
  }

  url.pathname = '/api/auth';
  return NextResponse.rewrite(url);
}