import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORIES, categoryOf, problemHref } from '@/lib/categories';
import { extractQuestions, plainText, teaser } from '@/lib/docs/tree';
import { readSettings } from '@/lib/docs/store';
import { loadQuestion, renderAnswerHtml } from '@/lib/docs/question';
import { buildMetadata, breadcrumbJsonLd, graph, problemJsonLd, truncate } from '@/lib/seo';
import { ProBadge } from '@/components/ProBadge';
import { ChevronLeft, ChevronRight } from '@/components/icons';
import JsonLd from '@/components/JsonLd';
import DocReadView from '@/components/docs/DocReadView';
import QuestionControls from '@/components/problems/QuestionControls';
import RailToggle from '@/components/problems/RailToggle';
import { ActionsSlot, InsightsSlot, ProAnswerSlot, QuestionStateProvider } from '@/components/problems/QuestionState';
import DifficultyBadge from '@/components/DifficultyBadge';

// CACHED page, identical for every visitor. Rebuilt when an admin saves (refreshAll in docs-actions.js) and daily.
// Visitor-specific parts come from /api/problems/<id>/state in the browser.
export const revalidate = 86400;

// Empty list: pages are built on first request, then cached (no database needed at build time).
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await loadQuestion(slug);
  if (!data) return { robots: { index: false, follow: true } };
  const { problem, found } = data;
  const cat = categoryOf(problem.topic.slug);
  return buildMetadata({
    title: problem.title,
    description: truncate(teaser(found.body, 160) || `${CATEGORIES[cat].short} interview question on ${problem.topic.name}.`, 155),
    path: problemHref(problem.slug, problem.topic.slug),
    image: `/problems/${problem.slug}/opengraph-image`,
  });
}

export default async function QuestionPage({ params }) {
  const { slug } = await params;
  const data = await loadQuestion(slug);
  if (!data) notFound();
  const { problem, found } = data;
  const { topic } = problem;

  const open = !problem.proOnly;

  const category = categoryOf(topic.slug);
  const listPath = CATEGORIES[category].path;
  const settings = readSettings(topic.settings);

  const questions = extractQuestions(topic.content);
  const at = questions.findIndex((q) => q.id === slug);
  const prev = at > 0 ? questions[at - 1] : null;
  const next = at >= 0 && at < questions.length - 1 ? questions[at + 1] : null;
  const percent = at >= 0 && questions.length ? ((at + 1) / questions.length) * 100 : 0;
  const prevHref = prev ? problemHref(prev.id, topic.slug) : null;
  const nextHref = next ? problemHref(next.id, topic.slug) : null;
  const pad = (n) => String(n).padStart(2, '0');

  const html = open ? renderAnswerHtml(found) : null;
  const hint = open ? '' : teaser(found.body);
  const hasAnswer = found.body.some((n) => plainText(n).trim() || n.type !== 'paragraph');

  const jsonLd = graph(
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Problems', path: '/problems' },
      ...(category !== 'ai' ? [{ name: CATEGORIES[category].label.trim(), path: listPath }] : []),
      { name: problem.title, path: problemHref(problem.slug, topic.slug) },
    ]),
    problemJsonLd({ ...problem, description: teaser(found.body, 300) }),
  );

  const difficulty = questions[at]?.difficulty;

  return (
    <main className="mx-auto w-full max-w-7xl px-3.5 pb-8 pt-3 sm:px-6 sm:pb-14 sm:pt-6 lg:px-8">
      <JsonLd data={jsonLd} />

      <QuestionStateProvider key={problem.slug} slug={problem.slug}>
        <div className="q-grid grid gap-x-8 xl:gap-x-10 lg:grid-cols-[var(--q-rail-w,17rem)_minmax(0,1fr)]">
          <aside className="q-rail hidden lg:block" aria-label="Questions in this topic">
            <div className="sticky top-24">
              <RailToggle />
              <div className="q-rail-body">
                <Link href={listPath} prefetch={false} className="inline-flex items-center gap-1 pr-9 text-xs text-muted transition-colors hover:text-ink">
                  <ChevronLeft width={14} height={14} /> {CATEGORIES[category].label.trim()} questions
                </Link>
                <p className="mt-3 text-sm font-semibold">{topic.name}</p>
                <p className="mt-0.5 text-xs text-muted">{questions.length} questions</p>

                <div className="q-rail-scroll relative mt-4 max-h-[calc(100vh-13rem)] overflow-y-auto pr-2">
                  <ol className="space-y-0.5">
                    {questions.map((q, i) => {
                      const current = i === at;
                      return (
                        <li key={q.id}>
                          <Link
                            href={problemHref(q.id, topic.slug)}
                            prefetch={false}
                            aria-current={current ? 'page' : undefined}
                            data-q-current={current ? '' : undefined}
                            className={`flex gap-2.5 rounded-lg px-2.5 py-2 text-[0.8125rem] leading-snug transition-colors ${
                              current ? 'font-medium text-ink' : 'text-muted hover:bg-surface-2/60 hover:text-ink'
                            }`}
                          >
                            <span className="w-5 shrink-0 pt-px text-right font-mono text-[0.7rem] tabular-nums opacity-70">{pad(i + 1)}</span>
                            <span className="line-clamp-2">{q.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>
            </div>
          </aside>

          <div className="q-main min-w-0 w-full">
            <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-1.5 text-xs text-muted lg:hidden">
              <Link href={listPath} prefetch={false} className="hover:text-ink">{CATEGORIES[category].label.trim()} questions</Link>
              <span aria-hidden="true">/</span>
              <Link href={`${listPath}#topic-${topic.slug}`} prefetch={false} className="truncate hover:text-ink">{topic.name}</Link>
            </nav>

            <header className="q-head">
              <div className="relative">
                <div className="flex items-center gap-2 text-xs">
                  {at >= 0 && <span className="rounded-md bg-accent-soft px-1.5 py-0.5 font-mono text-[0.7rem] font-bold tracking-wider text-accent">Q{pad(at + 1)}</span>}
                  <span className="truncate font-medium text-muted">{topic.name}</span>
                  {at >= 0 && <span className="ml-auto shrink-0 tabular-nums text-muted">{at + 1} / {questions.length}</span>}
                </div>

                <h1 className="mt-2 text-balance text-[1.2rem] font-semibold leading-snug tracking-tight sm:mt-3 sm:text-[1.75rem] sm:leading-tight">{problem.title}</h1>

                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 sm:mt-4 sm:gap-2">
                  {difficulty && <DifficultyBadge difficulty={difficulty} />}
                  {problem.proOnly && <ProBadge />}
                  <InsightsSlot />
                  <div className="flex flex-wrap items-center gap-1.5 sm:ml-auto sm:gap-2">
                    <ActionsSlot problemId={problem.id} />
                    <QuestionControls prevHref={prevHref} nextHref={nextHref} />
                  </div>
                </div>
              </div>

              {at >= 0 && (
                <div className="absolute inset-x-0 bottom-0 h-[3px] bg-line/60" role="progressbar" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={at + 1} aria-label="Position in this topic">
                  <div className="h-full rounded-r-full bg-accent" style={{ width: `${percent}%` }} />
                </div>
              )}
            </header>

            <article className="q-read q-answer mt-3 min-w-0 sm:mt-4">
              {open ? (
                hasAnswer ? (
                  <DocReadView slug={`q-${problem.slug}`} html={html} headingFont={settings.headingFont} textFont={settings.textFont} />
                ) : (
                  <p className="text-muted">The answer to this question is being written.</p>
                )
              ) : (
                <ProAnswerSlot slug={problem.slug} hint={hint} headingFont={settings.headingFont} textFont={settings.textFont} />
              )}
            </article>

            {(prev || next) && (
              <nav aria-label="Question navigation" className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-3">
                {prev ? (
                  <Link href={prevHref} className="q-nav-card group">
                    <span className="flex items-center gap-1 text-[0.7rem] font-medium uppercase tracking-wide text-muted">
                      <ChevronLeft width={14} height={14} /> Previous
                    </span>
                    <span className="mt-1 line-clamp-2 text-[0.8125rem] font-medium leading-snug sm:text-sm">{prev.title}</span>
                  </Link>
                ) : (
                  <span aria-hidden="true" />
                )}
                {next ? (
                  <Link href={nextHref} className="q-nav-card group text-right">
                    <span className="flex items-center justify-end gap-1 text-[0.7rem] font-medium uppercase tracking-wide text-muted">
                      Next <ChevronRight width={14} height={14} />
                    </span>
                    <span className="mt-1 line-clamp-2 text-[0.8125rem] font-medium leading-snug sm:text-sm">{next.title}</span>
                  </Link>
                ) : (
                  <span aria-hidden="true" />
                )}
              </nav>
            )}

            <p className="mt-4 hidden text-center text-xs text-muted lg:block">
              <kbd className="rounded border border-line px-1 font-mono">←</kbd> <kbd className="rounded border border-line px-1 font-mono">→</kbd> questions
              <span className="mx-2 opacity-40">·</span>
              <kbd className="rounded border border-line px-1 font-mono">B</kbd> sidebar
              <span className="mx-2 opacity-40">·</span>
              <kbd className="rounded border border-line px-1 font-mono">F</kbd> focus
            </p>
          </div>
        </div>
      </QuestionStateProvider>
    </main>
  );
}