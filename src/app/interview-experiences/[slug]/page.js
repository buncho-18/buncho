import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata, breadcrumbJsonLd, graph, truncate } from '@/lib/seo';
import {
  OUTCOME_TONE,
  countQuestions,
  difficultyCounts,
  formatMonth,
  getAllExperiences,
  getExperience,
  hardestOf,
} from '@/lib/interview-experiences';
import { CompanyMark, DifficultyBar, DifficultyMeter, Pipeline, TONE_BG } from '@/components/experiences/parts';
import { BackLink } from '@/components/jobs/ui';
import { ChevronDown } from '@/components/icons';
import JsonLd from '@/components/JsonLd';

// Pre-render every experience at build time. Data comes from src/data/interview-experiences.json.
export function generateStaticParams() {
  return getAllExperiences().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const exp = getExperience(slug);
  if (!exp) return { robots: { index: false, follow: true } };
  return buildMetadata({
    title: exp.title,
    description: truncate(exp.summary, 155),
    path: `/interview-experiences/${exp.slug}`,
  });
}

function SolutionLink({ solution }) {
  if (!solution?.url) return <span className="text-xs text-muted">Solution coming soon</span>;
  const cls =
    'group/s inline-flex items-center gap-1 text-xs font-semibold text-accent underline-offset-4 hover:underline';
  const label = (
    <>
      {solution.label || 'View solution'}
      <span aria-hidden="true" className="transition-transform group-hover/s:translate-x-0.5">→</span>
    </>
  );
  return solution.url.startsWith('/') ? (
    <Link href={solution.url} className={cls}>{label}</Link>
  ) : (
    <a href={solution.url} target="_blank" rel="noopener noreferrer" className={cls}>{label}</a>
  );
}

export default async function ExperiencePage({ params }) {
  const { slug } = await params;
  const exp = getExperience(slug);
  if (!exp) notFound();

  const counts = difficultyCounts(exp);
  const facts = [
    { k: 'Rounds', v: exp.rounds.length },
    { k: 'Questions', v: countQuestions(exp) },
    { k: 'Level', v: exp.level },
    { k: 'Timeline', v: exp.totalDuration },
  ];

  return (
    <div className="wrap max-w-3xl py-8 sm:py-12">
      <JsonLd
        data={graph(
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Interview experiences', path: '/interview-experiences' },
            { name: exp.title, path: `/interview-experiences/${exp.slug}` },
          ]),
        )}
      />

      <BackLink href="/interview-experiences">All experiences</BackLink>

      {/* Header */}
      <header className="mt-6">
        <div className="flex items-center gap-4">
          <CompanyMark name={exp.company.name} size={56} />
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{exp.role}</h1>
            <p className="text-sm text-muted">{exp.company.name} · {exp.company.location} · {formatMonth(exp.date)}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${OUTCOME_TONE[exp.outcome] ?? 'bg-surface-2 text-muted'}`}>
            {exp.outcome}
          </span>
          <DifficultyMeter level={exp.difficulty} />
          {!exp.verified && (
            <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-muted">
              Sample: illustrative, not a verified submission
            </span>
          )}
        </div>

        <p className="mt-5 leading-relaxed text-muted">{exp.summary}</p>
        <p className="mt-2 text-xs text-muted">Shared by {exp.candidate.name} · {exp.candidate.background}</p>
      </header>

      {/* Overview */}
      <section aria-label="Overview" className="mt-8 rounded-2xl bg-surface-2/60 p-5 sm:p-6">
        <dl className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          {facts.map((f) => (
            <div key={f.k} className="min-w-0">
              <dd className="font-display text-lg font-bold leading-snug">{f.v}</dd>
              <dt className="text-xs uppercase tracking-wider text-muted">{f.k}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-6">
          <Pipeline rounds={exp.rounds} anchors />
        </div>

        <div className="mt-6">
          <DifficultyBar counts={counts} legend />
        </div>
      </section>

      {/* Round timeline */}
      <ol className="relative mt-10 space-y-4 before:absolute before:bottom-6 before:left-[17px] before:top-6 before:w-px before:bg-line max-sm:before:hidden">
        {exp.rounds.map((r) => {
          const tone = hardestOf(r);
          return (
            <li key={r.id} id={r.id} className="relative sm:pl-12">
              <span
                aria-hidden="true"
                className={`absolute left-0 top-5 hidden h-9 w-9 place-items-center rounded-full text-xs font-bold text-white ring-4 ring-bg sm:grid ${TONE_BG[tone]}`}
              >
                {r.id.toUpperCase()}
              </span>

              <details open className="group rounded-2xl border border-line bg-surface">
                <summary className="flex cursor-pointer list-none items-center gap-3 rounded-2xl p-5 [&::-webkit-details-marker]:hidden">
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white sm:hidden ${TONE_BG[tone]}`}>
                    {r.id.toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-base font-semibold leading-snug sm:text-lg">{r.title}</h2>
                    <p className="mt-0.5 text-xs text-muted">
                      {[r.mode, r.duration, `${r.questions.length} questions`].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <DifficultyMeter level={tone} label={false} />
                  <ChevronDown width={18} height={18} className="shrink-0 text-muted transition-transform group-open:rotate-180" />
                </summary>

                <div className="border-t border-line px-5 pb-2 pt-4">
                  <p className="text-sm leading-relaxed text-muted">{r.summary}</p>

                  <ol className="mt-3 divide-y divide-line">
                    {r.questions.map((q, i) => (
                      <li key={q.id} className="flex gap-3 py-4">
                        <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${TONE_BG[q.difficulty]}`} title={q.difficulty.toLowerCase()} />
                        <div className="min-w-0 flex-1">
                          <p className="leading-relaxed">
                            <span className="mr-1.5 font-semibold text-muted">Q{i + 1}.</span>
                            {q.text}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                            {q.topic && <span className="text-xs font-medium text-muted"># {q.topic}</span>}
                            <SolutionLink solution={q.solution} />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </details>
            </li>
          );
        })}
      </ol>

      {/* Tips */}
      {exp.tips?.length > 0 && (
        <section className="mt-10 rounded-2xl bg-accent-soft p-6" aria-labelledby="tips">
          <h2 id="tips" className="font-display text-lg font-semibold">What to take away</h2>
          <ol className="mt-4 space-y-3">
            {exp.tips.map((t, i) => (
              <li key={t} className="flex gap-3 text-sm leading-relaxed">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent text-[11px] font-bold text-accent-ink">{i + 1}</span>
                <span>{t}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}