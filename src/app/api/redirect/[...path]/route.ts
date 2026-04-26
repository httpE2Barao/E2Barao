import { NextRequest, NextResponse } from 'next/server';

const SOCIAL_REDIRECTS: Record<string, string> = {
  github: 'https://github.com/httpE2Barao',
  linkedin: 'https://linkedin.com/in/e2barao',
  email: 'mailto:e2barao@hotmail.com',
};

export async function GET(request: NextRequest) {
  const { pathname } = new URL(request.url);
  const path = pathname.slice(1).toLowerCase();

  if (SOCIAL_REDIRECTS[path]) {
    return NextResponse.redirect(SOCIAL_REDIRECTS[path]);
  }

  if (path.startsWith('github.com/')) {
    const target = 'https://' + path;
    return NextResponse.redirect(target);
  }

  if (path.startsWith('linkedin.com/')) {
    const target = 'https://' + path;
    return NextResponse.redirect(target);
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}