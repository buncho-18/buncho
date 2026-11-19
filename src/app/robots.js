// import { SITE_URL } from '@/lib/seo';

// export default function robots() {
//   return {
//     rules: [
//       {
//         userAgent: '*',
//         allow: '/',
//         disallow: [
//           '/api/',
//           '/dashboard',
//           '/admin',
//           '/jobs',
//           '/billing',
//           '/settings',
//           // Internal search results and login redirects are endless URL variations with no search value
//           '/*?q=',
//           '/*&q=',
//           '/*?tag=',
//           '/*&tag=',
//           '/*?redirect_url=',
//           '/*&redirect_url=',
//         ],
//       },
//     ],
//     sitemap: `${SITE_URL}/sitemap.xml`,
//     host: SITE_URL,
//   };
// }


import { SITE_URL } from '@/lib/seo';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard',
          '/admin',
          '/jobs',
          '/billing',
          '/settings',
          // Internal search results and login redirects are endless URL variations with no search value
          '/*?q=',
          '/*&q=',
          '/*?tag=',
          '/*&tag=',
          '/*?redirect_url=',
          '/*&redirect_url=',
          // Filter combinations of the question lists (also linked from the footer). They are noindex duplicates of the
          // main list, but Google still crawls them, and every crawl is a server call. Blocking them saves that.
          '/*?difficulty=',
          '/*&difficulty=',
          '/*?type=',
          '/*&type=',
          '/*?access=',
          '/*&access=',
          '/*?status=',
          '/*&status=',
          '/*?sub=',
          '/*&sub=',
          '/*?company=',
          '/*&company=',
          '/*?level=',
          '/*&level=',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}