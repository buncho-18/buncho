// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// const isProtected = createRouteMatcher(['/dashboard(.*)', '/admin(.*)', '/api/admin(.*)', '/jobs(.*)', '/billing(.*)', '/report(.*)', '/settings(.*)', '/interview-experiences/new']);

// export default clerkMiddleware(async (auth, req) => {
//   if (isProtected(req)) await auth.protect();
// });

// // Runs only where the SERVER needs the signed-in user. Public cacheable pages (question pages, docs pages,
// // interview experiences, terms, privacy, home, sitemap, robots, opengraph-image, badge) are excluded.
// export const config = {
//   matcher: [
//     '/pricing',
//     '/challenges',
//     '/problems',
//     '/problems/ai',
//     '/problems/hr',
//     '/problems/sql',
//     '/problems/core',
//     '/dashboard/:path*',
//     '/admin/:path*',
//     '/jobs/:path*',
//     '/billing/:path*',
//     '/report/:path*',
//     '/interview-experiences/new',
//     '/settings/:path*',
//     '/advertise/:path*',
//     '/onboarding/:path*',
//     '/login/:path*',
//     '/register/:path*',
//     '/docs/:category',
//     '/docs/:category/:tab/edit',
//     '/user/:username',
//     '/api/:path*',
//     '/trpc/:path*',
//     // Server actions are POSTed to the page they were called from and call auth(), so the proxy must run for them.
//     { source: '/:path*', has: [{ type: 'header', key: 'next-action' }] },
//   ],
// };


import { NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtected = createRouteMatcher(['/dashboard(.*)', '/admin(.*)', '/api/admin(.*)', '/jobs(.*)', '/billing(.*)', '/report(.*)', '/settings(.*)', '/interview-experiences/new']);

export default clerkMiddleware(async (auth, req) => {
  if (!isProtected(req)) return;

  const { userId } = await auth();
  if (userId) return;

  // Signed out. API calls get a plain 401; pages go to OUR /login (not Clerk's default sign-in page)
  // and come straight back to where they were headed after logging in.
  const { pathname, search } = req.nextUrl;
  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Please log in.' }, { status: 401 });
  }
  const login = new URL('/login', req.url);
  login.searchParams.set('redirect_url', `${pathname}${search}`);
  return NextResponse.redirect(login);
});

// Runs only where the SERVER needs the signed-in user. Public cacheable pages (question pages, docs pages,
// interview experiences, terms, privacy, home, sitemap, robots, opengraph-image, badge) are excluded.
export const config = {
  matcher: [
    '/pricing',
    '/challenges',
    '/problems',
    '/problems/ai',
    '/problems/hr',
    '/problems/sql',
    '/problems/core',
    '/dashboard/:path*',
    '/admin/:path*',
    '/jobs/:path*',
    '/billing/:path*',
    '/report/:path*',
    '/interview-experiences/new',
    '/settings/:path*',
    '/advertise/:path*',
    '/onboarding/:path*',
    '/login/:path*',
    '/register/:path*',
    '/docs/:category',
    '/docs/:category/:tab/edit',
    '/user/:username',
    '/api/:path*',
    '/trpc/:path*',
    // Server actions are POSTed to the page they were called from and call auth(), so the proxy must run for them.
    { source: '/:path*', has: [{ type: 'header', key: 'next-action' }] },
  ],
};