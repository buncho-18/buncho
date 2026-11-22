'use client';

import { useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { submitExperience } from '@/app/interview-experiences/actions';
import {
  COMPANY_TYPES,
  DIFFICULTIES,
  LEVELS,
  LIMITS,
  OUTCOMES,
  ROUND_MODES,
  ROUND_TYPES,
} from '@/lib/interview-experience-options';
import { Close } from '@/components/icons';
import Spinner from '@/components/Spinner';

const input =
  'w-full rounded-xl border border-line bg-surface-2/40 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-muted/70 focus:border-accent focus:bg-surface focus:ring-4 focus:ring-accent/15';
const label = 'text-sm font-medium';
const card = 'rounded-2xl border border-line bg-surface p-5 sm:p-6';
const DIFF_LABEL = { EASY: 'Easy', MEDIUM: 'Medium', HARD: 'Hard' };
const DIFF_ON = { EASY: 'bg-easy text-white', MEDIUM: 'bg-medium text-white', HARD: 'bg-hard text-white' };

// Local ids keep React keys stable while rows are added and removed. They are not sent to the server.
let uid = 0;
const nextId = () => { uid += 1; return uid; };
const newQuestion = () => ({ key: nextId(), text: '', topic: '', difficulty: 'MEDIUM' });
const newRound = () => ({
  key: nextId(), title: '', type: 'Technical', mode: 'Online', duration: '', summary: '', questions: [newQuestion()],
});

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function Field({ id, text, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className={label}>{text}</label>
      <div className="mt-2">{children}</div>
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export default function ExperienceForm() {
  const router = useRouter();
  const topRef = useRef(null);
  const [pending, start] = useTransition();
  const [error, setError] = useState(null);
  const [doneSlug, setDoneSlug] = useState(null);

  const [f, setF] = useState({
    companyName: '', companyType: '', location: '', role: '', level: 'Full-time',
    date: currentMonth(), outcome: 'Awaiting Result', totalDuration: '', background: '', summary: '', anonymous: false,
  });
  const [rounds, setRounds] = useState(() => [newRound()]);
  const [tips, setTips] = useState(['']);

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const patchRound = (key, patch) => setRounds((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  const patchQuestion = (rk, qk, patch) =>
    setRounds((rs) => rs.map((r) => (r.key === rk ? { ...r, questions: r.questions.map((q) => (q.key === qk ? { ...q, ...patch } : q)) } : r)));
  const addQuestion = (rk) =>
    setRounds((rs) => rs.map((r) => (r.key === rk && r.questions.length < LIMITS.maxQuestionsPerRound ? { ...r, questions: [...r.questions, newQuestion()] } : r)));
  const removeQuestion = (rk, qk) =>
    setRounds((rs) => rs.map((r) => (r.key === rk && r.questions.length > 1 ? { ...r, questions: r.questions.filter((q) => q.key !== qk) } : r)));

  const ready =
    f.companyName.trim() &&
    f.role.trim() &&
    f.date &&
    f.summary.trim().length >= LIMITS.summary.min &&
    rounds.length > 0 &&
    rounds.every((r) => r.title.trim() && r.questions.some((q) => q.text.trim().length >= LIMITS.question.min));

  function submit(e) {
    e.preventDefault();
    setError(null);
    start(async () => {
      const res = await submitExperience({
        ...f,
        rounds: rounds.map(({ key, questions, ...r }) => ({ ...r, questions: questions.map(({ key: _k, ...q }) => q) })),
        tips,
      });
      if (!res.ok) {
        setError(res.error);
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      setDoneSlug(res.slug);
      router.refresh();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (doneSlug) {
    return (
      <div className="rounded-2xl border border-accent/40 bg-accent-soft p-6 sm:p-8">
        <h2 className="text-xl font-semibold tracking-tight">Thank you. Your experience is live.</h2>
        <p className="mt-2 text-sm text-muted">It now appears in the interview experiences list, so others can learn from it.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={`/interview-experiences/${doneSlug}`} className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink hover:opacity-90">
            View my experience
          </Link>
          <Link href="/interview-experiences" className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-surface-2">
            All experiences
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-8" noValidate>
      <div ref={topRef} className="scroll-mt-24">
        {error && (
          <p role="alert" className="rounded-xl border border-hard/40 bg-hard/10 px-4 py-3 text-sm font-medium text-hard">{error}</p>
        )}
      </div>

      {/* 1. The interview */}
      <section className={`${card} space-y-5`} aria-labelledby="about-h">
        <h2 id="about-h" className="text-base font-semibold">About the interview</h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="company" text="Company">
            <input id="company" value={f.companyName} onChange={set('companyName')} maxLength={LIMITS.company} placeholder="e.g. Mid-size fintech company" className={input} />
          </Field>
          <Field id="role" text="Role">
            <input id="role" value={f.role} onChange={set('role')} maxLength={LIMITS.role} placeholder="e.g. GenAI Engineer" className={input} />
          </Field>
          <Field id="ctype" text="Company type (optional)">
            <select id="ctype" value={f.companyType} onChange={set('companyType')} className={input}>
              <option value="">Choose one…</option>
              {COMPANY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field id="location" text="Location (optional)">
            <input id="location" value={f.location} onChange={set('location')} maxLength={LIMITS.location} placeholder="e.g. Bengaluru (hybrid)" className={input} />
          </Field>
          <Field id="level" text="Level">
            <select id="level" value={f.level} onChange={set('level')} className={input}>
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
          <Field id="date" text="Interview month">
            <input id="date" type="month" value={f.date} max={currentMonth()} onChange={set('date')} className={input} />
          </Field>
          <Field id="outcome" text="Outcome">
            <select id="outcome" value={f.outcome} onChange={set('outcome')} className={input}>
              {OUTCOMES.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
          <Field id="duration" text="Total timeline (optional)" hint="From first call to the final decision.">
            <input id="duration" value={f.totalDuration} onChange={set('totalDuration')} maxLength={LIMITS.duration} placeholder="e.g. 2 weeks" className={input} />
          </Field>
        </div>

        <Field id="background" text="Your background (optional)" hint="Shown under the summary, for example “1.5 years of experience” or “Final-year B.Tech”.">
          <input id="background" value={f.background} onChange={set('background')} maxLength={LIMITS.background} className={input} />
        </Field>

        <Field id="summary" text="Summary">
          <textarea
            id="summary" value={f.summary} onChange={set('summary')} rows={4} maxLength={LIMITS.summary.max}
            placeholder="How many rounds were there, what did they cover, and which rounds were the hardest?"
            className={`${input} resize-y`}
          />
          <p className="mt-1 text-right text-xs tabular-nums text-muted">{f.summary.length} / {LIMITS.summary.max}</p>
        </Field>
      </section>

      {/* 2. Rounds */}
      <section aria-labelledby="rounds-h" className="space-y-4">
        <div>
          <h2 id="rounds-h" className="text-base font-semibold">Rounds and questions</h2>
          <p className="mt-1 text-xs text-muted">Add one block per round, then list the questions you remember from it.</p>
        </div>

        {rounds.map((r, ri) => (
          <fieldset key={r.key} className={`${card} space-y-5`}>
            <legend className="sr-only">Round {ri + 1}</legend>
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-sm font-semibold">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-accent text-[11px] font-bold text-accent-ink">R{ri + 1}</span>
                Round {ri + 1}
              </span>
              {rounds.length > 1 && (
                <button
                  type="button"
                  onClick={() => setRounds((rs) => rs.filter((x) => x.key !== r.key))}
                  className="text-xs font-semibold text-muted hover:text-hard"
                >
                  Remove round
                </button>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id={`rt-${r.key}`} text="Round title">
                <input id={`rt-${r.key}`} value={r.title} onChange={(e) => patchRound(r.key, { title: e.target.value })} maxLength={LIMITS.roundTitle} placeholder="e.g. Online assessment" className={input} />
              </Field>
              <Field id={`rty-${r.key}`} text="Type">
                <select id={`rty-${r.key}`} value={r.type} onChange={(e) => patchRound(r.key, { type: e.target.value })} className={input}>
                  {ROUND_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field id={`rm-${r.key}`} text="Mode">
                <select id={`rm-${r.key}`} value={r.mode} onChange={(e) => patchRound(r.key, { mode: e.target.value })} className={input}>
                  {ROUND_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </Field>
              <Field id={`rd-${r.key}`} text="Duration (optional)">
                <input id={`rd-${r.key}`} value={r.duration} onChange={(e) => patchRound(r.key, { duration: e.target.value })} maxLength={LIMITS.duration} placeholder="e.g. 60 min" className={input} />
              </Field>
            </div>

            <Field id={`rs-${r.key}`} text="What happened in this round? (optional)">
              <textarea id={`rs-${r.key}`} value={r.summary} onChange={(e) => patchRound(r.key, { summary: e.target.value })} rows={2} maxLength={LIMITS.roundSummary} className={`${input} resize-y`} />
            </Field>

            <div>
              <p className={label}>Questions asked</p>
              <ol className="mt-3 space-y-3">
                {r.questions.map((q, qi) => (
                  <li key={q.key} className="rounded-xl bg-surface-2/50 p-3.5">
                    <div className="flex items-start gap-2">
                      <span className="mt-2.5 text-xs font-semibold text-muted">Q{qi + 1}.</span>
                      <textarea
                        aria-label={`Round ${ri + 1} question ${qi + 1}`}
                        value={q.text}
                        onChange={(e) => patchQuestion(r.key, q.key, { text: e.target.value })}
                        rows={2}
                        maxLength={LIMITS.question.max}
                        placeholder="Write the question as closely as you remember it"
                        className={`${input} resize-y`}
                      />
                      {r.questions.length > 1 && (
                        <button
                          type="button"
                          aria-label={`Remove question ${qi + 1}`}
                          onClick={() => removeQuestion(r.key, q.key)}
                          className="mt-1.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-hard"
                        >
                          <Close width={16} height={16} />
                        </button>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3 pl-6">
                      <input
                        aria-label={`Round ${ri + 1} question ${qi + 1} topic`}
                        value={q.topic}
                        onChange={(e) => patchQuestion(r.key, q.key, { topic: e.target.value })}
                        maxLength={LIMITS.topic}
                        placeholder="Topic, e.g. RAG"
                        className={`${input} !w-40 !py-1.5`}
                      />
                      <div role="radiogroup" aria-label="Difficulty" className="inline-flex rounded-full bg-surface p-0.5 ring-1 ring-line">
                        {DIFFICULTIES.map((d) => {
                          const on = q.difficulty === d;
                          return (
                            <button
                              key={d}
                              type="button"
                              role="radio"
                              aria-checked={on}
                              onClick={() => patchQuestion(r.key, q.key, { difficulty: d })}
                              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${on ? DIFF_ON[d] : 'text-muted hover:text-ink'}`}
                            >
                              {DIFF_LABEL[d]}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>

              {r.questions.length < LIMITS.maxQuestionsPerRound && (
                <button type="button" onClick={() => addQuestion(r.key)} className="mt-3 text-sm font-semibold text-accent hover:underline">
                  + Add a question
                </button>
              )}
            </div>
          </fieldset>
        ))}

        {rounds.length < LIMITS.maxRounds && (
          <button
            type="button"
            onClick={() => setRounds((rs) => [...rs, newRound()])}
            className="w-full rounded-2xl border border-dashed border-line py-3.5 text-sm font-semibold text-muted transition-colors hover:border-accent hover:text-accent"
          >
            + Add another round
          </button>
        )}
      </section>

      {/* 3. Tips */}
      <section className={`${card} space-y-4`} aria-labelledby="tips-h">
        <div>
          <h2 id="tips-h" className="text-base font-semibold">What to take away (optional)</h2>
          <p className="mt-1 text-xs text-muted">Up to {LIMITS.maxTips} tips for someone preparing for the same interview.</p>
        </div>
        {tips.map((t, i) => (
          <div key={i} className="flex items-start gap-2">
            <input
              aria-label={`Tip ${i + 1}`}
              value={t}
              onChange={(e) => setTips((ts) => ts.map((x, j) => (j === i ? e.target.value : x)))}
              maxLength={LIMITS.tip}
              placeholder="e.g. Revise how to evaluate a RAG pipeline end to end"
              className={input}
            />
            {tips.length > 1 && (
              <button
                type="button"
                aria-label={`Remove tip ${i + 1}`}
                onClick={() => setTips((ts) => ts.filter((_, j) => j !== i))}
                className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-hard"
              >
                <Close width={16} height={16} />
              </button>
            )}
          </div>
        ))}
        {tips.length < LIMITS.maxTips && (
          <button type="button" onClick={() => setTips((ts) => [...ts, ''])} className="text-sm font-semibold text-accent hover:underline">
            + Add a tip
          </button>
        )}
      </section>

      {/* 4. Submit */}
      <div className={`${card} space-y-5`}>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" checked={f.anonymous} onChange={set('anonymous')} className="mt-0.5 h-4 w-4 accent-accent" />
          <span>
            <span className="font-medium">Post anonymously</span>
            <span className="block text-xs text-muted">Your name is hidden. It will show as “Anonymous”.</span>
          </span>
        </label>

        <p className="text-xs text-muted">
          Please do not share confidential company material or personal details of interviewers. Only describe what you were asked.
        </p>

        <button
          type="submit"
          disabled={pending || !ready}
          aria-busy={pending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending && <Spinner size={14} />}
          {pending ? 'Publishing…' : 'Publish my experience'}
        </button>
      </div>
    </form>
  );
}