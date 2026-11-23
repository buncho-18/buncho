'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { setCompleted, toggleBookmark } from '@/app/actions';
import { Bookmark, Check } from '@/components/icons';

// "Mark as done" and "Save" on a question page. Signed-out visitors are sent to log in.
export default function QuestionActions({ problemId, completed, bookmarked, signedIn }) {
  const [done, setDone] = useState(completed);
  const [saved, setSaved] = useState(bookmarked);
  const [pending, start] = useTransition();
  const [error, setError] = useState(null);

  const base = 'inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium transition-colors disabled:opacity-60 sm:h-8 sm:px-3.5';
  const idle = 'border-line bg-surface text-muted hover:bg-surface-2 hover:text-ink';
  const on = 'border-accent/40 bg-accent-soft text-ink';

  if (!signedIn) {
    return (
      <Link href="/login" className={`${base} ${idle}`}>
        <Check width={14} height={14} /> <span className="sm:hidden">Log in to track</span>
        <span className="hidden sm:inline">Log in to track progress</span>
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        disabled={pending}
        aria-pressed={done}
        onClick={() => {
          const next = !done;
          setDone(next);
          setError(null);
          start(async () => {
            const res = await setCompleted(problemId, next);
            if (!res.ok) {
              setDone(!next);
              setError(res.error);
            }
          });
        }}
        className={`${base} ${done ? on : idle}`}
      >
        <Check width={14} height={14} className={done ? 'text-accent' : ''} /> {done ? 'Done' : 'Mark as done'}
      </button>
      <button
        type="button"
        disabled={pending}
        aria-pressed={saved}
        onClick={() => {
          const next = !saved;
          setSaved(next);
          setError(null);
          start(async () => {
            const res = await toggleBookmark(problemId);
            if (!res.ok) {
              setSaved(!next);
              setError(res.error);
            }
          });
        }}
        className={`${base} ${saved ? on : idle}`}
      >
        <Bookmark width={14} height={14} filled={saved} className={saved ? 'text-accent' : ''} /> {saved ? 'Saved' : 'Save'}
      </button>
      {error && <p role="alert" className="basis-full text-xs text-hard">{error}</p>}
    </>
  );
}