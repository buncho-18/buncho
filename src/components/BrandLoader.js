const LETTERS = 'buncho'.split('');

// Animated logo shown while a page loads (used by every loading.js). Pure CSS (see the "Brand loader" block in
// globals.css), so it costs no JavaScript and can be a server component.
//
// The "b" tile flies in from the left and the wordmark from the right, they meet and snap together into the logo
// (with a flash), the letters ripple, then the two halves part and the whole thing plays again, for as long as the
// page is still loading. It appears after a short delay, so a page that loads instantly never flashes it.
export default function BrandLoader({ label = 'Loading', fill = true }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`grid place-items-center overflow-hidden px-4 ${fill ? 'min-h-[calc(100dvh-4rem)]' : 'py-24'}`}
    >
      <div className="bl-stage flex flex-col items-center">
        <div className="flex items-center gap-4 sm:gap-5">
          {/* left half: the tile */}
          <span aria-hidden="true" className="bl-left relative grid h-[4.5rem] w-[4.5rem] place-items-center sm:h-24 sm:w-24">
            <span className="bl-halo absolute -inset-6 rounded-full" />
            <span className="bl-ring absolute -inset-1 rounded-[1.9rem]" />
            <span className="bl-tile relative grid h-full w-full place-items-center rounded-[1.4rem] bg-[#04140a] text-[3.2rem] font-extrabold leading-none text-[#34d67b] sm:rounded-[1.7rem] sm:text-[4.25rem] dark:bg-[#34d67b] dark:text-[#04140a]">
              <span className="-translate-y-0.5 sm:-translate-y-1">b</span>
            </span>
          </span>

          {/* right half: the wordmark */}
          <span aria-hidden="true" className="bl-right relative flex items-baseline text-[3.2rem] font-extrabold leading-none tracking-tight text-ink sm:text-[4.25rem]">
            {/* the flash where the two halves meet */}
            <span className="bl-joint pointer-events-none absolute -left-5 top-1/2 h-16 w-16 -translate-y-1/2 sm:-left-6 sm:h-24 sm:w-24" />
            {LETTERS.map((c, i) => (
              <span key={i} className="bl-letter" style={{ '--i': i }}>
                {c}
              </span>
            ))}
            <span className="bl-dot text-[#34d67b]" style={{ '--i': LETTERS.length }}>
              .
            </span>
          </span>
        </div>

        {/* progress */}
        <span aria-hidden="true" className="mt-9 block h-1 w-40 overflow-hidden rounded-full bg-line sm:w-48">
          <span className="bl-bar block h-full w-1/3 rounded-full bg-accent" />
        </span>

        <span className="sr-only">{label}…</span>
      </div>
    </div>
  );
}