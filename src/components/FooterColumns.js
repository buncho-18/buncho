'use client';

import Link from 'next/link';
import { useViewer } from './ViewerProvider';

const COLUMNS = [
  {
    title: 'Practice',
    links: [
      { href: '/problems', label: 'All problems' },
      { href: '/problems?difficulty=EASY', label: 'Easy warm-ups' },
      { href: '/problems?difficulty=HARD', label: 'Hard challenges' },
      { href: '/problems?type=SYSTEM_DESIGN', label: 'System design' },
      { href: '/interview-experiences', label: 'Interview Experience' },
    ],
  },
  {
    title: 'Your space',
    links: [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/dashboard#saved', label: 'Saved problems' },
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
      { href: '/report', label: 'Report a problem' },
    ],
  },
  {
    title: 'Account',
    links: [
      { href: '/register', label: 'Create free account' },
      { href: '/login', label: 'Log in' },
    ],
  },
];

export default function FooterColumns({ brand }) {
  const { signedIn } = useViewer();
  const columns = signedIn ? COLUMNS.filter((c) => c.title !== 'Account') : COLUMNS;
  return (
    <div className={`grid gap-10 ${signedIn ? 'md:grid-cols-[1.5fr_repeat(2,1fr)]' : 'md:grid-cols-[1.5fr_repeat(3,1fr)]'}`}>
      {brand}

      {columns.map((col) => (
        <nav key={col.title} aria-label={col.title}>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink">{col.title}</h2>
          <ul className="mt-4 space-y-2.5">
            {col.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} prefetch={false} className="text-sm text-muted transition-colors hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </div>
  );
}