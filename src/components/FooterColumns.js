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
    <div className={`grid grid-cols-2 gap-x-6 gap-y-7 sm:gap-y-8 md:gap-10 ${signedIn ? 'md:grid-cols-[1.5fr_repeat(2,1fr)]' : 'md:grid-cols-[1.5fr_repeat(3,1fr)]'}`}>
      <div className="col-span-2 md:col-span-1">{brand}</div>

      {columns.map((col) => (
        <nav key={col.title} aria-label={col.title}>
          <h2 className="text-[0.7rem] font-semibold uppercase tracking-wider text-ink sm:text-xs">{col.title}</h2>
          <ul className="mt-2.5 space-y-1.5 sm:mt-4 sm:space-y-2.5">
            {col.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} prefetch={false} className="inline-block py-0.5 text-sm text-muted transition-colors hover:text-accent">
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