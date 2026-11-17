'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Book, Database, Users } from './icons';
import ProblemsRail from './problems/ProblemsRail';

const ICONS = { ai: Book, hr: Users, sql: Database };

/**
 * Shell for the question library.
 * Left (lg and up): a floating icon-only navigation pill (ProblemsRail) with the question types plus
 * Dashboard, Saved for later and Job prep shortcuts.
 * Right: the list for the selected type (children).
 * Below the lg breakpoint the rail becomes a row of scrollable pills above the list.
 *
 * items: [{ key, label, href, count, description }]
 */
export default function ProblemsShell({ items, children }) {
  const pathname = usePathname();
  const activeRef = useRef(null); // the active pill in the phone switch

  // Keep the active pill visible when the row is wider than the screen
  useEffect(() => {
    activeRef.current?.scrollIntoView({ inline: 'center', block: 'nearest' });
  }, [pathname]);

  // AI problems live at /problems (and /problems/ai); HR questions at /problems/hr; SQL questions at /problems/sql
  const under = (base) => pathname === base || pathname.startsWith(`${base}/`);
  const section = under('/problems/hr') ? 'hr' : under('/problems/sql') ? 'sql' : 'ai';
  const isOn = (it) => it.key === section;

  return (
    <div className="mx-auto flex w-full max-w-[96rem] flex-col gap-4 px-4 pb-16 pt-4 sm:px-6 sm:pt-6 lg:flex-row lg:gap-5">
      {/* Mobile and tablet: scrollable pills. Every item keeps its full label, so more links can be added later
          and the row just scrolls sideways instead of squeezing them. The active pill scrolls into view. */}
      <div className="relative -mx-4 sm:-mx-6 lg:hidden">
        <nav
          aria-label="Question type"
          className="no-scrollbar flex snap-x gap-2 overflow-x-auto scroll-smooth px-4 py-1 sm:px-6"
        >
          {items.map((it) => {
            const on = isOn(it);
            const Icon = ICONS[it.key] ?? Book;
            return (
              <Link
                key={it.key}
                ref={on ? activeRef : undefined}
                href={it.href}
                aria-current={on ? 'page' : undefined}
                className={`flex h-11 shrink-0 snap-start items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors active:scale-[0.97] ${
                  on
                    ? 'border-accent/50 bg-accent-soft text-ink shadow-sm'
                    : 'border-line bg-surface text-muted hover:border-muted hover:text-ink'
                }`}
              >
                <Icon width={16} height={16} className={`shrink-0 ${on ? 'text-accent' : ''}`} />
                <span className="whitespace-nowrap">{it.label.trim()}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[0.7rem] font-semibold tabular-nums ${
                    on ? 'bg-accent/15 text-accent' : 'bg-line/60 text-muted'
                  }`}
                >
                  {it.count}
                </span>
              </Link>
            );
          })}
          {/* Spacer so the last pill can scroll clear of the edge fade */}
          <span aria-hidden="true" className="w-4 shrink-0" />
        </nav>
        {/* Soft fade on the right edge hints that the row scrolls */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-canvas to-transparent" />
      </div>

      {/* Desktop: floating icon rail (question types + Dashboard, Saved, Job prep) */}
      <ProblemsRail items={items} section={section} />

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}