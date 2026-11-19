import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getOrCreateUser } from '@/lib/user';
import { isAdmin } from '@/lib/admin';
import { CATEGORIES, categoryOf } from '@/lib/categories';
import { getTab, getTabsForAdmin, readSettings } from '@/lib/docs/store';
import { EMPTY_DOC, ensureHeadingIds, extractQuestions, isDoc } from '@/lib/docs/tree';
import DocTabs from '@/components/docs/DocTabs';
import DocEditor from '@/components/docs/DocEditor';
import DocLayout from '@/components/docs/DocLayout';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Edit questions', robots: { index: false, follow: false } };

export default async function DocEditPage({ params }) {
  const { category, tab: slug } = await params;
  if (!CATEGORIES[category]) notFound();

  const admin = isAdmin(await getOrCreateUser());
  if (!admin) redirect(`/docs/${category}/${slug}`);

  const tab = await getTab(slug);
  if (!tab || categoryOf(slug) !== category) notFound();

  const tabs = await getTabsForAdmin(category);
  const settings = readSettings(tab.settings);
  const doc = isDoc(tab.content) ? ensureHeadingIds(tab.content) : EMPTY_DOC;
  const questions = extractQuestions(doc);
  const count = questions.length;

  return (
    <DocLayout
      wide={settings.wide}
      aside={
        <>
          <Link href={CATEGORIES[category].path} prefetch={false} className="mb-3 inline-flex items-center gap-1 text-xs text-muted hover:text-ink">
            ← {CATEGORIES[category].label.trim()} questions
          </Link>
          <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wide text-muted">Topics</p>
          <DocTabs category={category} tabs={tabs} activeSlug={slug} admin outline={questions} />
        </>
      }
    >
      <article className="min-w-0 pb-24">
        <DocEditor key={slug} slug={slug} title={tab.name} initialCount={count} initialContent={doc} initialSettings={settings} />
      </article>
    </DocLayout>
  );
}