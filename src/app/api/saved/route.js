import { prisma } from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/user';
import { categoryOf, problemHref } from '@/lib/categories';

export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'private, no-store' };

/** The signed-in user's saved questions, newest first. The popup groups them by category and topic. */
export async function GET() {
  try {
    const user = await getOrCreateUser();
    if (!user) return Response.json({ signedIn: false, items: [] }, { headers: NO_STORE });

    const rows = await prisma.bookmark.findMany({
      where: { userId: user.id, problem: { published: true } },
      orderBy: { createdAt: 'desc' },
      take: 500,
      select: {
        problem: {
          select: {
            id: true,
            slug: true,
            title: true,
            difficulty: true,
            topic: { select: { slug: true, name: true } },
          },
        },
      },
    });

    const items = rows.map(({ problem: p }) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      difficulty: p.difficulty,
      category: categoryOf(p.topic.slug),
      topicName: p.topic.name,
      href: problemHref(p.slug, p.topic.slug),
    }));

    return Response.json({ signedIn: true, items }, { headers: NO_STORE });
  } catch (err) {
    console.error('[api/saved]', err);
    return Response.json({ signedIn: true, items: [], error: true }, { status: 500, headers: NO_STORE });
  }
}