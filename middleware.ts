import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/v2')) {
    const basicAuth = req.headers.get('authorization');
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');
      const validUser = process.env.ADMIN_USER;
      const validPass = process.env.ADMIN_PASS;
      if (user === validUser && pwd === validPass) {
        return NextResponse.redirect(new URL('/admin/v2/dashboard', req.url));
      }
    }
    url.pathname = '/api/auth';
    return NextResponse.rewrite(url);
  }

  if (pathname.startsWith('/admin/v2')) {
    const basicAuth = req.headers.get('authorization');
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

  if (pathname.startsWith('/v2/') || pathname.startsWith('/v2.1/') || pathname.startsWith('/v2.2/')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const toV2: Record<string, string> = {
    '/projects': '/v2/projects',
    '/Projects': '/v2/projects',
    '/experiences': '/v2/experiences',
    '/Experiences': '/v2/experiences',
    '/tecs': '/v2/tecs',
    '/Tecs': '/v2/tecs',
    '/contacts': '/v2/contacts',
    '/Contacts': '/v2/contacts',
  };

  const redirectPath = toV2[pathname];
  if (redirectPath) {
    return NextResponse.redirect(new URL(redirectPath, req.url), 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'
  ],
};