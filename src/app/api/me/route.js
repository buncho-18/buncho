import { getOrCreateUser } from '@/lib/user';
import { getIsPro } from '@/lib/subscription';
import { isAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'private, no-store' };

export async function GET() {
  try {
    const user = await getOrCreateUser();
    if (!user) return Response.json({ signedIn: false }, { headers: NO_STORE });

    const pro = await getIsPro(user.id);
    return Response.json(
      {
        signedIn: true,
        isPro: pro,
        admin: isAdmin(user),
        profile: { name: user.name ?? null, email: user.email ?? null, imageUrl: user.imageUrl ?? null, username: user.username ?? null },
      },
      { headers: NO_STORE },
    );
  } catch (err) {
    console.error('[api/me]', err);
    return Response.json({ signedIn: false, error: true }, { status: 500, headers: NO_STORE });
  }
}