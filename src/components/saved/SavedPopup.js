'use client';

import Link from 'next/link';
import { useCallback, useEffect, useId, useMemo, useRef, useState, useTransition } from 'react';
import { toggleBookmark } from '@/app/actions';
import DifficultyBadge from '@/components/DifficultyBadge';
import { Bookmark, Close } from '@/components/icons';

const CATEGORY_ORDER = ['ai', 'hr', 'sql', 'core'];
const CATEGORY_LABEL = { ai: 'AI/ML', hr: 'HR', sql: 'SQL', core: 'Core' };

/**
 * "Saved for later" popup. Opens right on the page (no redirect to the dashboard).
 * Saved questions are grouped by category tab (All, AI/ML, HR, SQL, Core) and, inside a tab, by topic
 * (for example Java, DBMS, CN, OS under Core).
 *
 * variant:
 *  - "bar"   : the bordered button next to the pace planner
 *  - "rail"  : the icon with a tooltip in the floating rail
 *  - "side"  : a full-width sidebar row
 *  - "card"  : the wide accent button used on the dashboard card
 */
export default function SavedPopup({ variant = 'bar', label = 'Saved for later', count, className = '' }) {
  const ref = useRef(null);
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(null); // null = not loaded yet
  const [error, setError] = useState(false);
  const [signedIn, setSignedIn] = useState(true);
  const [tab, setTab] = useState('all');
  const [query, setQuery] = useState('');
  const [, start] = useTransition();

  const load = useCallback(async () => {
    setError(false);
    try {
      const res = await fetch('/api/saved', { cache: 'no-store' });
      if (!res.ok) throw new Error('failed');
      const data = await res.json();
      setSignedIn(data.signedIn !== false);
      setItems(data.items ?? []);
    } catch {
      setError(true);
      setItems((prev) => prev ?? []);
    }
  }, []);

  // Fresh list every time the popup opens, so a question saved a moment ago shows up
  useEffect(() => {
    if (open) load();
  }, [open, load]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const counts = useMemo(() => {
    const c = { all: items?.length ?? 0 };
    for (const key of CATEGORY_ORDER) c[key] = 0;
    for (const it of items ?? []) c[it.category] = (c[it.category] ?? 0) + 1;
    return c;
  }, [items]);

  // If the active tab empties out (last item un-saved), fall back to All
  useEffect(() => {
    if (tab !== 'all' && items && counts[tab] === 0) setTab('all');
  }, [tab, items, counts]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const visible = (items ?? []).filter(
      (it) => (tab === 'all' || it.category === tab) && (!q || it.title.toLowerCase().includes(q)),
    );
    // Group by category (on the All tab) then topic. Insertion order keeps the newest saves first.
    const map = new Map();
    for (const it of visible) {
      const key = tab === 'all' ? `${it.category}::${it.topicName}` : it.topicName;
      if (!map.has(key)) {
        map.set(key, { key, category: it.category, topic: it.topicName, list: [] });
      }
      map.get(key).list.push(it);
    }
    const out = [...map.values()];
    if (tab === 'all') out.sort((a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category));
    return out;
  }, [items, tab, query]);

  const remove = (item) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id)); // optimistic
    start(async () => {
      const res = await toggleBookmark(item.id);
      if (!res?.ok) load(); // put it back if the server refused
    });
  };

  const total = items?.length ?? count ?? 0;

  const trigger = {
    bar: (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={label}
        title={label}
        className={`flex h-full w-12 shrink-0 items-center justify-center rounded-2xl border border-line bg-surface text-sm font-medium transition-colors hover:border-muted sm:w-auto sm:gap-2 sm:px-4 ${className}`}
      >
        <Bookmark width={18} height={18} />
        <span className="hidden sm:inline">{label}</span>
      </button>
    ),
    rail: (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={label}
        className={`group/rail relative grid h-11 w-11 place-items-center rounded-2xl text-muted transition-all duration-150 hover:bg-surface-2 hover:text-ink focus-visible:bg-surface-2 focus-visible:text-ink active:scale-95 ${className}`}
      >
        <Bookmark width={20} height={20} />
        <span
          role="tooltip"
          className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-x-1 -translate-y-1/2 whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-sm font-medium text-canvas opacity-0 shadow-lg transition-all duration-150 group-hover/rail:translate-x-0 group-hover/rail:opacity-100 group-focus-visible/rail:translate-x-0 group-focus-visible/rail:opacity-100"
        >
          {label}
        </span>
      </button>
    ),
    side: (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-ink ${className}`}
      >
        <Bookmark width={18} height={18} />
        <span className="min-w-0 flex-1 truncate">{label}</span>
      </button>
    ),
    card: (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className={`w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink transition-opacity hover:opacity-90 ${className}`}
      >
        View all saved
      </button>
    ),
  }[variant];

  const tabs = [{ key: 'all', label: 'All' }, ...CATEGORY_ORDER.map((k) => ({ key: k, label: CATEGORY_LABEL[k] }))];

  return (
    <>
      {trigger}

      <dialog
        ref={ref}
        aria-labelledby={titleId}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
        className="m-auto w-[min(calc(100vw-1.5rem),40rem)] max-w-none rounded-2xl border border-line bg-surface p-0 text-ink shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm max-sm:mb-0 max-sm:mt-auto max-sm:w-full max-sm:rounded-b-none"
      >
        <div className="flex h-[min(40rem,88dvh)] flex-col max-sm:h-[88dvh]">
          <div aria-hidden="true" className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-line sm:hidden" />

          <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 max-sm:pt-3">
            <div className="min-w-0">
              <h2 id={titleId} className="text-lg font-semibold tracking-tight">Saved for later</h2>
              <p className="mt-0.5 text-sm text-muted">
                {items === null ? 'Loading…' : `${total} question${total === 1 ? '' : 's'} saved`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-2 hover:bg-line"
            >
              <Close />
            </button>
          </div>

          {/* Category tabs */}
          <div className="border-b border-line px-5 py-3">
            <div role="tablist" aria-label="Saved questions by category" className="no-scrollbar flex gap-2 overflow-x-auto">
              {tabs.map((t) => {
                const on = tab === t.key;
                return (
                  <button
                    key={t.key}
                    role="tab"
                    type="button"
                    aria-selected={on}
                    onClick={() => setTab(t.key)}
                    className={`flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-sm font-semibold transition-colors ${
                      on
                        ? 'border-accent/50 bg-accent-soft text-ink'
                        : 'border-line bg-surface text-muted hover:border-muted hover:text-ink'
                    }`}
                  >
                    {t.label}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[0.7rem] tabular-nums ${
                        on ? 'bg-accent/15 text-accent' : 'bg-line/60 text-muted'
                      }`}
                    >
                      {counts[t.key] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
            {total > 6 && (
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search saved questions"
                aria-label="Search saved questions"
                className="mt-3 h-9 w-full rounded-lg border border-line bg-surface-2/60 px-3 text-sm outline-none placeholder:text-muted focus:border-accent"
              />
            )}
          </div>

          {/* List */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
            {items === null ? (
              <div className="space-y-2" aria-hidden="true">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-12 animate-pulse rounded-lg bg-surface-2" />
                ))}
              </div>
            ) : !signedIn ? (
              <div className="rounded-lg bg-surface-2/60 px-4 py-5 text-sm text-muted">
                <Link href="/login" className="font-medium text-accent hover:underline">Log in</Link> to save questions and find them here.
              </div>
            ) : error && !items.length ? (
              <div className="rounded-lg bg-surface-2/60 px-4 py-5 text-sm text-muted">
                Couldn&apos;t load your saved questions.{' '}
                <button type="button" onClick={load} className="font-medium text-accent hover:underline">Try again</button>
              </div>
            ) : !groups.length ? (
              <div className="rounded-lg bg-surface-2/60 px-4 py-5 text-sm text-muted">
                {query
                  ? 'No saved question matches your search.'
                  : tab === 'all'
                    ? 'Nothing saved yet. Use Save on any question to collect it here.'
                    : `No saved ${CATEGORY_LABEL[tab]} questions yet.`}
              </div>
            ) : (
              <div className="space-y-5">
                {groups.map((g) => (
                  <section key={g.key} aria-label={g.topic}>
                    <h3 className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
                      {tab === 'all' && (
                        <span className="rounded-md bg-accent/12 px-1.5 py-0.5 text-[0.65rem] text-accent">
                          {CATEGORY_LABEL[g.category]}
                        </span>
                      )}
                      <span className="truncate">{g.topic}</span>
                      <span className="font-normal normal-case tracking-normal">({g.list.length})</span>
                    </h3>
                    <ul className="-mx-2 space-y-0.5">
                      {g.list.map((item) => (
                        <li key={item.id} className="group flex items-center gap-1 rounded-lg transition-colors hover:bg-surface-2">
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="flex min-w-0 flex-1 items-start justify-between gap-3 px-2 py-2.5 text-sm"
                          >
                            <span className="min-w-0 flex-1 break-words font-medium">{item.title}</span>
                            <DifficultyBadge difficulty={item.difficulty} plain />
                          </Link>
                          <button
                            type="button"
                            onClick={() => remove(item)}
                            aria-label={`Remove ${item.title} from saved`}
                            title="Remove from saved"
                            className="mr-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-accent transition-colors hover:bg-line"
                          >
                            <Bookmark width={16} height={16} filled />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}