'use client';

import Link from 'next/link';
import { useViewer } from '@/components/ViewerProvider';

export default function AuthRailLink({ signedIn, signedOut, children }) {
  const viewer = useViewer();
  const { href, label } = viewer.signedIn ? signedIn : signedOut;
  return (
    <Link
      href={href}
      prefetch={false}
      aria-label={label}
      className="group/r relative grid h-11 w-11 place-items-center rounded-xl text-muted transition hover:bg-surface-2 hover:text-ink"
    >
      {children}
      <span className="pointer-events-none absolute left-full z-10 ml-3 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs font-medium text-bg opacity-0 transition-opacity group-hover/r:opacity-100">
        {label}
      </span>
    </Link>
  );
}