import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BYPASS_PREFIXES = [
  '/admin',
  '/api',
  '/license/activate',
  '/api/license',
  '/_next',
  '/favicon.ico',
];

function resolveStatusUrl(request: NextRequest): URL {
  const internalBase = process.env.INTERNAL_APP_URL?.trim();
  const base =
    internalBase && internalBase.length > 0 ? internalBase : request.nextUrl.origin;
  return new URL('/api/license/status', base);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (BYPASS_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const statusUrl = resolveStatusUrl(request);
  try {
    const res = await fetch(statusUrl.toString(), {
      headers: { 'x-edzero-internal': '1' },
      cache: 'no-store',
    });
    if (!res.ok) {
      return NextResponse.redirect(new URL('/license/activate', request.url));
    }
    const data = (await res.json()) as { verified?: boolean; enforced?: boolean };
    if (data.enforced && !data.verified) {
      return NextResponse.redirect(new URL('/license/activate', request.url));
    }
  } catch {
    return NextResponse.redirect(new URL('/license/activate', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
