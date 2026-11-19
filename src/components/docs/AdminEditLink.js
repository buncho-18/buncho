'use client';

import Link from 'next/link';
import { useViewer } from '@/components/ViewerProvider';

export default function AdminEditLink({ href }) {
  const { admin } = useViewer();
  if (!admin) return null;
  return (
    <Link href={href} prefetch={false} className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-ink hover:opacity-90">
      Edit this tab
    </Link>
  );
}