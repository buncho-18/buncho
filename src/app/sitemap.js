import { prisma } from '@/lib/prisma';
import { SITE_URL } from '@/lib/seo';
import { problemHref } from '@/lib/categories';
import { getAllExperiences } from '@/lib/interview-experiences';

// Rebuilt at most once an hour, so new problems show up without hitting the database on every crawl.
export const revalidate = 3600;

// Bump these when the legal text actually changes, so lastModified stays truthful.
const TERMS_UPDATED = new Date('2026-10-22');
const PRIVACY_UPDATED = new Date('2026-10-22');

export default async function sitemap() {
  const now = new Date();
  const experiences = await getAllExperiences();
  const entries = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/problems`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/problems/hr`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/problems/sql`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/problems/core`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/interview-experiences`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    ...experiences.map((e) => ({
      url: `${SITE_URL}/interview-experiences/${e.slug}`,
      lastModified: new Date(e.date),
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
    { url: `${SITE_URL}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/terms`, lastModified: TERMS_UPDATED, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified: PRIVACY_UPDATED, changeFrequency: 'yearly', priority: 0.3 },
  ];

  try {
    const [questions, profiles] = await Promise.all([
      // One entry per FREE question page (/problems/<slug>). Pro-only pages only show a teaser,
      // which Google treats as thin content, so they stay out of the sitemap.
      prisma.problem.findMany({
        where: { published: true, proOnly: false },
        select: { slug: true, updatedAt: true, topic: { select: { slug: true } } },
        orderBy: { updatedAt: 'desc' },
      }),
      // Public profiles with at least one solved problem (empty profiles are noindex, so keep them out)
      prisma.user.findMany({
        where: { username: { not: null }, profilePublic: true, showStats: true, progress: { some: { status: 'COMPLETED' } } },
        select: { username: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' },
        take: 500,
      }),
    ]);

    questions.forEach((q) => {
      entries.push({
        url: `${SITE_URL}${problemHref(q.slug, q.topic.slug)}`,
        lastModified: q.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });

    profiles.forEach((u) => {
      entries.push({ url: `${SITE_URL}/user/${u.username}`, lastModified: u.updatedAt, changeFrequency: 'weekly', priority: 0.3 });
    });
  } catch (err) {
    // If the database is unreachable the static pages are still returned instead of failing the build
    console.error('[sitemap] could not load problems', err);
  }

  return entries;
}