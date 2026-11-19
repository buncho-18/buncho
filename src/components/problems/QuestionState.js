'use client';

import Link from 'next/link';
import { createContext, useContext, useEffect, useState } from 'react';
import { useViewer } from '@/components/ViewerProvider';
import { InsightsPanel } from '@/components/Insights';
import { Lock } from '@/components/icons';
import DocReadView from '@/components/docs/DocReadView';
import QuestionActions from '@/components/problems/QuestionActions';

const StateContext = createContext({ loading: true, state: null, failed: false });

export function QuestionStateProvider({ slug, children }) {
  const viewer = useViewer();
  const [state, setState] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!viewer.signedIn) return undefined;
    let cancelled = false;
    fetch(`/api/problems/${encodeURIComponent(slug)}/state`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data?.signedIn) setState(data);
        else setFailed(true);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [viewer.signedIn, slug]);

  const loading = !viewer.loaded || (viewer.signedIn && !state && !failed);
  return <StateContext.Provider value={{ loading, state, failed }}>{children}</StateContext.Provider>;
}

const useQuestionState = () => useContext(StateContext);

const pulse = <span aria-hidden="true" className="inline-block h-8 w-32 animate-pulse rounded-full bg-surface-2" />;

export function ActionsSlot({ problemId }) {
  const { loading, state } = useQuestionState();
  const viewer = useViewer();
  if (loading) return pulse;
  return (
    <QuestionActions
      key={state ? 'ready' : 'anon'}
      problemId={problemId}
      completed={Boolean(state?.completed)}
      bookmarked={Boolean(state?.bookmarked)}
      signedIn={viewer.signedIn}
    />
  );
}

export function InsightsSlot() {
  const { loading, state } = useQuestionState();
  if (loading) return <span aria-hidden="true" className="inline-block h-7 w-44 animate-pulse rounded-full bg-surface-2" />;
  const insights = state?.insights;
  if (!insights) return <InsightsPanel pro={false} problem={null} />;
  return <InsightsPanel pro problem={{ askedByCompanies: insights.companies, askedFrequency: insights.asked }} />;
}

export function ProAnswerSlot({ slug, hint, headingFont, textFont }) {
  const { state, failed } = useQuestionState();
  const viewer = useViewer();
  const loading = viewer.signedIn && !state && !failed;

  if (state?.html) {
    return <DocReadView slug={`q-${slug}`} html={state.html} headingFont={headingFont} textFont={textFont} />;
  }
  if (state?.open) return <p className="text-muted">The answer to this question is being written.</p>;

  return (
    <div className="text-center">
      {hint && <p className="mx-auto max-w-xl text-left leading-relaxed text-muted">{hint}</p>}
      <div className="mx-auto mt-6 max-w-md rounded-2xl bg-surface-2 px-6 py-7">
        <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-surface text-muted">
          <Lock width={18} height={18} />
        </span>
        {loading ? (
          <p className="mt-3 text-sm text-muted">Checking your plan…</p>
        ) : (
          <>
            <p className="mt-3 font-semibold">This is a Pro question</p>
            <p className="mt-1 text-sm text-muted">Upgrade to Buncho Pro to read the full answer.</p>
            <Link href="/pricing" prefetch={false} className="mt-4 inline-flex h-9 items-center rounded-full bg-ink px-5 text-sm font-semibold text-bg transition-opacity hover:opacity-90">
              See Pro plans
            </Link>
          </>
        )}
      </div>
    </div>
  );
}