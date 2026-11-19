import { prisma } from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/user';
import { getIsPro } from '@/lib/subscription';
import { isAdmin } from '@/lib/admin';
import { canAccessProblem } from '@/lib/pro-access';
import { loadQuestion, readInsights, renderAnswerHtml } from '@/lib/docs/question';

export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'private, no-store' };

export async function GET(_req, { params }) {
  const { slug } = await params;
  try {
    const user = await getOrCreateUser();
    if (!user) return Response.json({ signedIn: false }, { headers: NO_STORE });

    const data = await loadQuestion(slug);
    if (!data) return Response.json({ signedIn: true, found: false }, { status: 404, headers: NO_STORE });
    const { problem, found } = data;

    const [pro, progress, bookmark] = await Promise.all([
      getIsPro(user.id),
      prisma.problemProgress.findUnique({ where: { userId_problemId: { userId: user.id, problemId: problem.id } }, select: { status: true } }),
      prisma.bookmark.findUnique({ where: { userId_problemId: { userId: user.id, problemId: problem.id } }, select: { id: true } }),
    ]);

    const privileged = pro || isAdmin(user);
    const open = canAccessProblem(problem, pro) || isAdmin(user);

    return Response.json(
      {
        signedIn: true,
        found: true,
        completed: progress?.status === 'COMPLETED',
        bookmarked: Boolean(bookmark),
        insights: privileged ? readInsights(problem.topic.content, slug) : null,
        html: problem.proOnly && open ? renderAnswerHtml(found) : null,
        open,
      },
      { headers: NO_STORE },
    );
  } catch (err) {
    console.error('[api/problems/state]', err);
    return Response.json({ signedIn: false, error: true }, { status: 500, headers: NO_STORE });
  }
}