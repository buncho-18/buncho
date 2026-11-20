// The liquid drops that arrive from the left and the right and merge into the logo.
// x / y: where a drop starts (rem), s: its size as a share of the tile, d: extra delay (s).
const DROPS = [
  { x: -15, y: -1, s: 0.78, d: 0 },
  { x: 15, y: 1, s: 0.78, d: 0.05 },
  { x: -11, y: 3.5, s: 0.3, d: 0.15 },
  { x: 12, y: -3.5, s: 0.34, d: 0.2 },
  { x: -9, y: -3, s: 0.22, d: 0.25 },
  { x: 10, y: 3, s: 0.26, d: 0.1 },
];

// Animated logo shown while a page loads (used by every loading.js). Pure CSS + one inline SVG filter (see the
// "Brand loader" block in globals.css), so it costs no JavaScript and can be a server component.
//
// 1. Liquid drops come in from the left and the right and melt together (gooey effect) into one blob.
// 2. The blob morphs into the glass logo tile with a spring.
// 3. A band of light sweeps over the logo.
// After a pause it dissolves and replays, for as long as the page is still loading.
export default function BrandLoader({ label = 'Loading', fill = true }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`grid place-items-center overflow-hidden px-4 ${fill ? 'min-h-[calc(100dvh-4rem)]' : 'py-24'}`}
    >
      {/* the gooey filter: blur the drops, then sharpen the alpha so touching drops fuse into one shape */}
      <svg aria-hidden="true" focusable="false" width="0" height="0" className="absolute">
        <defs>
          <filter id="bl-goo" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
          </filter>
        </defs>
      </svg>

      <div className="bl-stage relative">
        <span aria-hidden="true" className="bl-tilebox">
          <span className="bl-goo">
            {DROPS.map((k, i) => (
              <i
                key={i}
                className="bl-drop"
                style={{ '--bx': `${k.x}rem`, '--by': `${k.y}rem`, '--bs': k.s, '--bd': `${k.d}s` }}
              />
            ))}
          </span>
          <span className="bl-tile">
            <span className="bl-b">b</span>
          </span>
          {/* a band of light that sweeps across the finished logo */}
          <span className="bl-shine" />
        </span>

        <span className="sr-only">{label}…</span>
      </div>
    </div>
  );
}