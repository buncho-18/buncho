import { redirect } from 'next/navigation';
import { getOrCreateUser } from '@/lib/user';
import { BackLink } from '@/components/jobs/ui';
import ExperienceForm from '@/components/experiences/ExperienceForm';

export const metadata = { title: 'Share your interview experience', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function NewExperiencePage() {
  const user = await getOrCreateUser();
  if (!user) redirect(`/login?redirect_url=${encodeURIComponent('/interview-experiences/new')}`);

  return (
    <div className="wrap max-w-3xl py-8 sm:py-12">
      <BackLink href="/interview-experiences">All experiences</BackLink>

      <header className="mt-6">
        <p className="text-sm font-semibold text-accent">Interview experiences</p>
        <h1 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Share your interview experience</h1>
        <p className="mt-3 max-w-xl text-sm text-muted">
          Tell others what each round was like and which questions you were asked. It shows up on the interview experiences page as soon as you submit.
        </p>
      </header>

      <div className="mt-8">
        <ExperienceForm />
      </div>
    </div>
  );
}