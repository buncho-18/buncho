'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bookmark, Book, Code, Database, Grid, Users, FileText } from '../icons';

const ICONS = { ai: Book, hr: Users, sql: Database, core: Code };

/**
 * Floating icon-only navigation pill for the /problems pages (desktop, lg and up).
 * - Top group: the question types (AI/ML, HR, SQL, Core), the active one is highlighted.
 * - Divider, then shortcuts: Dashboard, Saved for later, Job prep.
 * - Hover or keyboard focus on an icon shows its label in a tooltip to the right.
 *
 * items: [{ key, label, href, count }] (same items the shell receives)
 */
const SHORTCUTS = [
  { href: '/dashboard', label: 'Dashboard', Icon: Grid },
  { href: '/dashboard#saved', label: 'Saved for later', Icon: Bookmark },
  { href: '/jobs', label: 'Job prep', Icon: FileText },
];

function RailLink({ href, label, hint, on, children }) {
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={on ? 'page' : undefined}
      className={`group/rail relative grid h-11 w-11 place-items-center rounded-2xl transition-all duration-150 active:scale-95 ${
        on
          ? 'bg-surface-2 text-accent shadow-inner ring-1 ring-line'
          : 'text-muted hover:bg-surface-2 hover:text-ink focus-visible:bg-surface-2 focus-visible:text-ink'
      }`}
    >
      {children}
      {/* Tooltip */}
      <span
        role="tooltip"
        className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-x-1 -translate-y-1/2 whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-sm font-medium text-canvas opacity-0 shadow-lg transition-all duration-150 group-hover/rail:translate-x-0 group-hover/rail:opacity-100 group-focus-visible/rail:translate-x-0 group-focus-visible/rail:opacity-100"
      >
        {label}
        {hint != null && <span className="ml-2 text-xs font-normal opacity-60">{hint}</span>}
      </span>
    </Link>
  );
}

export default function ProblemsRail({ items, section }) {
  // Keeps the hook so the rail re-renders on route change even if the parent is cached
  usePathname();

  return (
    <aside aria-label="Quick navigation" className="relative z-40 hidden w-14 shrink-0 lg:block">
      <nav className="sticky top-[4.5rem] flex w-14 flex-col items-center gap-1.5 rounded-3xl border border-line bg-surface/90 p-1.5 shadow-lg shadow-black/10 backdrop-blur-md">
        {items.map((it) => {
          const Icon = ICONS[it.key] ?? Book;
          return (
            <RailLink key={it.key} href={it.href} label={it.label.trim()} hint={it.count} on={it.key === section}>
              <Icon width={20} height={20} />
            </RailLink>
          );
        })}

        <span aria-hidden="true" className="my-1 h-px w-7 bg-line" />

        {SHORTCUTS.map(({ href, label, Icon }) => (
          <RailLink key={href} href={href} label={label}>
            <Icon width={20} height={20} />
          </RailLink>
        ))}
      </nav>
    </aside>
  );
}