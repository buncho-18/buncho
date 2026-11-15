'use client';

import { useEffect, useRef } from 'react';

const DOTS = 'radial-gradient(var(--line) 1px, transparent 1.2px)';
const DOTS_LIT = 'radial-gradient(var(--accent) 1.3px, transparent 1.6px)';
const mask = (value) => ({ maskImage: value, WebkitMaskImage: value });

// A quiet dot grid. A small circle of it lights up around the cursor, and drifts on its own
// when nobody is pointing (phones, or before the mouse moves). No re-renders: it only sets two CSS variables.
export default function HeroBackdrop() {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    const host = el?.parentElement;
    if (!el || !host) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    const measure = () => {
      const r = host.getBoundingClientRect();
      w = r.width;
      h = r.height;
    };
    measure();

    const cur = { x: w * 0.5, y: h * 0.4 };
    const target = { ...cur };
    let hovering = false;
    let raf = 0;
    const t0 = performance.now();

    const paint = () => {
      el.style.setProperty('--mx', `${cur.x}px`);
      el.style.setProperty('--my', `${cur.y}px`);
    };
    const onMove = (e) => {
      const r = host.getBoundingClientRect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
      hovering = true;
    };
    const onLeave = () => { hovering = false; };
    const tick = (now) => {
      if (!hovering) {
        const t = (now - t0) / 1000;
        target.x = w * (0.5 + 0.34 * Math.cos(t * 0.3));
        target.y = h * (0.46 + 0.3 * Math.sin(t * 0.45));
      }
      cur.x += (target.x - cur.x) * 0.07;
      cur.y += (target.y - cur.y) * 0.07;
      paint();
      raf = requestAnimationFrame(tick);
    };

    paint();
    if (!reduce) {
      host.addEventListener('pointermove', onMove);
      host.addEventListener('pointerleave', onLeave);
      window.addEventListener('resize', measure);
      raf = requestAnimationFrame(tick);
    }
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 [--mx:50%] [--my:40%]">
      {/* resting grid, fading out toward the edges */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: DOTS, backgroundSize: '24px 24px', ...mask('radial-gradient(ellipse 75% 70% at 50% 45%, black 25%, transparent 100%)') }}
      />
      {/* the same grid in the accent colour, only visible near the cursor */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: DOTS_LIT, backgroundSize: '24px 24px', ...mask('radial-gradient(220px circle at var(--mx) var(--my), black, transparent)') }}
      />
    </div>
  );
}