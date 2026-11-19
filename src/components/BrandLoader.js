// Every piece of the logo, in reading order: the tile, then b u n c h o and the dot.
// x / y: where the piece starts (rem, negative = left / up, positive = right / down), r: its starting tilt (deg).
const PIECES = [
  { x: -15, y: 3, r: -40 }, // tile
  { x: 13, y: -3.5, r: 35 }, // b
  { x: -11, y: 4, r: -30 }, // u
  { x: 14, y: -3, r: 45 }, // n
  { x: -12, y: 3.5, r: -35 }, // c
  { x: 11, y: -4, r: 30 }, // h
  { x: -14, y: 3, r: -45 }, // o
  { x: 12, y: -3, r: 60 }, // dot (only used for the scatter at the end)
];
const LETTERS = 'buncho'.split('');

// Little light sparks that stream in from both sides toward the logo while it is being built.
// x / y: start offset (rem), d: extra delay (s), s: size (px).
const SPARKS = [
  { x: -18, y: -2, d: 0, s: 5 },
  { x: 17, y: 2.5, d: 0.1, s: 4 },
  { x: -15, y: 3.5, d: 0.2, s: 6 },
  { x: 16, y: -3, d: 0.3, s: 4 },
  { x: -20, y: 0.5, d: 0.4, s: 3 },
  { x: 19, y: -0.5, d: 0.5, s: 5 },
  { x: -13, y: -3.5, d: 0.6, s: 4 },
  { x: 14, y: 3.5, d: 0.7, s: 3 },
  { x: -17, y: 1.5, d: 0.8, s: 5 },
  { x: 18, y: -2, d: 0.9, s: 4 },
];

const piece = (i) => {
  const p = PIECES[i];
  return { '--i': i, '--x': `${p.x}rem`, '--y': `${p.y}rem`, '--r': `${p.r}deg` };
};

// Animated logo shown while a page loads (used by every loading.js). Pure CSS (see the "Brand loader" block in
// globals.css), so it costs no JavaScript and can be a server component.
//
// 1. The tile and each letter fly in from the left and the right and lock together.
// 2. A light ball hops across the word, one letter at a time (each letter squashes and glows when it lands on it)
//    and settles into place as the final dot.
// 3. A band of light sweeps over the finished logo.
// After a pause the pieces scatter again and it replays, for as long as the page is still loading.
export default function BrandLoader({ label = 'Loading', fill = true }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`grid place-items-center overflow-hidden px-4 ${fill ? 'min-h-[calc(100dvh-4rem)]' : 'py-24'}`}
    >
      <div className="bl-stage relative flex items-center gap-4 sm:gap-5">
        {/* soft glow behind the finished logo */}
        <span aria-hidden="true" className="bl-glow pointer-events-none absolute -inset-x-10 -inset-y-8 rounded-full" />

        {/* sparks streaming toward the logo */}
        {SPARKS.map((k, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="bl-spark pointer-events-none absolute left-1/2 top-1/2 rounded-full bg-[#34d67b]"
            style={{ '--x': `${k.x}rem`, '--y': `${k.y}rem`, '--sd': `${k.d}s`, width: k.s, height: k.s }}
          />
        ))}

        {/* the tile */}
        <span aria-hidden="true" className="bl-piece relative grid h-[4.5rem] w-[4.5rem] place-items-center sm:h-24 sm:w-24" style={piece(0)}>
          <span className="bl-tile relative grid h-full w-full place-items-center rounded-[1.4rem] bg-[#04140a] text-[3.2rem] font-extrabold leading-none text-[#34d67b] sm:rounded-[1.7rem] sm:text-[4.25rem] dark:bg-[#34d67b] dark:text-[#04140a]">
            <span className="-translate-y-0.5 sm:-translate-y-1">b</span>
          </span>
        </span>

        {/* the wordmark, one piece per letter */}
        <span aria-hidden="true" className="relative flex items-baseline text-[3.2rem] font-extrabold leading-none tracking-tight text-ink sm:text-[4.25rem]">
          {LETTERS.map((c, i) => (
            <span key={i} className="bl-piece" style={piece(i + 1)}>
              {/* squashes and lights up when the ball lands on it */}
              <span className="bl-squash" style={{ '--k': i }}>
                {c}
              </span>
            </span>
          ))}
          {/* the final dot only appears when the ball settles into its place */}
          <span className="bl-dot text-[#34d67b]" style={piece(LETTERS.length + 1)}>
            .
          </span>

          {/* the ball: hops across the letters, one by one, and ends as the dot */}
          <span aria-hidden="true" className="bl-ballx pointer-events-none absolute">
            <span className="bl-bally block h-full w-full rounded-full bg-[#34d67b]" />
          </span>
        </span>

        {/* a band of light that sweeps across the finished logo */}
        <span aria-hidden="true" className="bl-shine pointer-events-none absolute inset-0 overflow-hidden rounded-3xl" />

        <span className="sr-only">{label}…</span>
      </div>
    </div>
  );
}