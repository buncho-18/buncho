import Link from 'next/link';
import Logo from './Logo';
import FooterColumns from './FooterColumns';
import { ChevronRight } from './icons';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer mt-2 border-t border-line bg-surface sm:mt-6">
      <div className="mx-auto w-full max-w-[96rem] px-4 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        <FooterColumns
          brand={
            <div>
              <Link href="/" aria-label="Buncho home" className="inline-block">
                <Logo />
              </Link>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted sm:mt-4">
                Practice for AI, ML and GenAI engineering interviews. Answer out loud or in writing, every day.
              </p>
              <Link
                href="/problems"
                prefetch={false}
                className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-semibold text-accent-ink transition-opacity hover:opacity-90 sm:mt-5"
              >
                Start practicing <ChevronRight width={16} height={16} />
              </Link>
            </div>
          }
        />

        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-line py-4 text-xs text-muted sm:mt-12 sm:flex-row sm:items-center sm:py-6 sm:text-sm">
          <p>&copy; {year} Buncho. Built for engineers preparing for AI roles.</p>
          <a href="#main" className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-ink">
            Back to top <span aria-hidden="true">&uarr;</span>
          </a>
        </div>
      </div>
    </footer>
  );
}