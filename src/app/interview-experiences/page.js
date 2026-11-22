import Link from 'next/link';
import { buildMetadata, breadcrumbJsonLd, graph } from '@/lib/seo';
import {
  LEVEL_FILTERS,
  OUTCOME_TONE,
  countQuestions,
  formatMonth,
  getAllExperiences,
  hardestOf,
} from '@/lib/interview-experiences';
import { CompanyMark, DifficultyMeter, Pipeline } from '@/components/experiences/parts';
import { ChevronRight } from '@/components/icons';
import JsonLd from '@/components/JsonLd';

const DESCRIPTION =
  'Round-by-round AI Engineer interview experiences: the questions asked in each round, with links to solutions.';

export const metadata = buildMetadata({
  title: 'AI Engineer interview experiences',
  description: DESCRIPTION,
  path: '/interview-experiences',
});

export default async function InterviewExperiencesPage({ searchParams }) {
  const { level = 'all' } = await searchParams;
  const all = await getAllExperiences();
  const list = level === 'all' ? all : all.filter((e) => e.level === level);

  const stats = [
    { n: all.length, label: 'Experiences' },
    { n: all.reduce((s, e) => s + e.rounds.length, 0), label: 'Rounds' },
    { n: all.reduce((s, e) => s + countQuestions(e), 0), label: 'Questions' },
  ];

  return (
    <div className="wrap py-10 sm:py-14">
      <JsonLd
        data={graph(
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Interview experiences', path: '/interview-experiences' },
          ]),
        )}
      />

      {/* Header */}
      <header className="max-w-2xl">
        <p className="text-sm font-semibold text-accent">Interview experiences</p>
        <h1 className="font-display mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          Know every round <span className="text-muted">before you walk in.</span>
        </h1>
        <p className="mt-4 text-muted">
          Real questions from AI Engineer interviews, grouped by round, with a link to practise each one.
        </p>
        <Link
          href="/interview-experiences/new"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-opacity hover:opacity-90"
        >
          <span aria-hidden="true">+</span> Share your experience
        </Link>
      </header>

      {/* Stats */}
      <dl className="mt-8 flex gap-8 sm:gap-12">
        {stats.map((s) => (
          <div key={s.label}>
            <dd className="font-display text-3xl font-bold tabular-nums">{s.n}</dd>
            <dt className="text-xs uppercase tracking-wider text-muted">{s.label}</dt>
          </div>
        ))}
      </dl>

      {/* Segmented filter */}
      <nav aria-label="Filter by level" className="mt-10 inline-flex rounded-full bg-surface-2 p-1">
        {LEVEL_FILTERS.map((f) => {
          const on = f.key === level;
          return (
            <Link
              key={f.key}
              href={f.key === 'all' ? '/interview-experiences' : `/interview-experiences?level=${encodeURIComponent(f.key)}`}
              aria-current={on ? 'page' : undefined}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                on ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink'
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </nav>

      {list.length === 0 ? (
        <p className="mt-10 text-muted">
          No experiences here yet.{' '}
          <Link href="/interview-experiences/new" className="font-semibold text-accent underline underline-offset-4">Be the first to share one.</Link>
        </p>
      ) : (
        <ul className="mt-6 grid gap-5 md:grid-cols-2">
          {list.map((e) => (
            <li key={e.slug}>
              <Link
                href={`/interview-experiences/${e.slug}`}
                className="group flex h-full flex-col gap-6 rounded-2xl border border-line bg-surface p-6 transition duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg hover:shadow-black/5"
              >
                <div className="flex items-start gap-3">
                  <CompanyMark name={e.company.name} />
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-lg font-semibold leading-snug">{e.role}</h2>
                    <p className="truncate text-sm text-muted">
                      {e.company.name} · {formatMonth(e.date)}
                      {e.community && <span className="ml-2 rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium">Community</span>}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${OUTCOME_TONE[e.outcome] ?? 'bg-surface-2 text-muted'}`}>
                    {e.outcome}
                  </span>
                </div>

                <Pipeline rounds={e.rounds} />

                <p className="line-clamp-2 text-sm text-muted">{e.summary}</p>

                <div className="mt-auto flex items-center justify-between text-sm">
                  <span className="flex items-center gap-3">
                    <DifficultyMeter level={e.difficulty} />
                    <span className="text-muted">{countQuestions(e)} questions</span>
                  </span>
                  <ChevronRight width={18} height={18} className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}