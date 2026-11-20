// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
// const isProtected = createRouteMatcher(['/dashboard(.*)', '/admin(.*)', '/api/admin(.*)', '/jobs(.*)', '/billing(.*)', '/report(.*)', '/settings(.*)']);

// export default clerkMiddleware(async (auth, req) => {
//   if (isProtected(req)) await auth.protect();
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and static files
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|txt|xml)).*)',
//     '/(api|trpc)(.*)',
//   ],
// };



import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtected = createRouteMatcher(['/dashboard(.*)', '/admin(.*)', '/api/admin(.*)', '/jobs(.*)', '/billing(.*)', '/report(.*)', '/settings(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) await auth.protect();
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