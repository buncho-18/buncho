import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = 'image/png';

const GREEN = '#34d67b';
const DARK = '#04140a';
const TEXT = '#f3f5f9';
const MUTED = '#9aa6b5';
const AMBER = '#f5b942';

const DIFF_COLOR = { Easy: GREEN, Medium: AMBER, Hard: '#ff6b6b' };

function Brand() {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 52,
          height: 52,
          borderRadius: 14,
          background: GREEN,
          color: DARK,
          fontSize: 38,
          fontWeight: 800,
          marginRight: 14,
        }}
      >
        b
      </div>
      <div style={{ display: 'flex', fontSize: 36, fontWeight: 800, color: TEXT }}>
        buncho<span style={{ color: GREEN }}>.</span>
      </div>
    </div>
  );
}

/** Headline made of separate words so wrapped lines work and chosen words can be green. */
function Headline({ title, highlight = [], size }) {
  const marked = new Set(highlight.map((w) => w.toLowerCase()));
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', fontSize: size, fontWeight: 800, lineHeight: 1.08, letterSpacing: -2 }}>
      {title.split(' ').map((word, i) => (
        <span
          key={`${word}-${i}`}
          style={{ marginRight: Math.round(size * 0.26), color: marked.has(word.toLowerCase().replace(/[^a-z0-9+]/g, '')) ? GREEN : TEXT }}
        >
          {word}
        </span>
      ))}
    </div>
  );
}

/** A small "daily practice" card, so the picture shows what the product gives you. */
function PreviewCard() {
  const bars = [
    ['RAG', 80],
    ['LLMs', 64],
    ['SQL', 45],
  ];
  return (
    <div style={{ display: 'flex', position: 'relative', width: 430, height: 410, alignItems: 'center', justifyContent: 'center' }}>
      {/* A second card behind, for depth */}
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          left: 6,
          top: 24,
          width: 370,
          height: 350,
          borderRadius: 30,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          transform: 'rotate(-6deg)',
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 380,
          padding: 28,
          borderRadius: 28,
          background: 'rgba(24,30,27,0.96)',
          border: '1px solid rgba(255,255,255,0.16)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
          transform: 'rotate(3deg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', fontSize: 19, color: MUTED, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>Daily practice</div>
          <div
            style={{
              display: 'flex',
              padding: '5px 14px',
              borderRadius: 999,
              background: 'rgba(52,214,123,0.16)',
              color: GREEN,
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            Voice + text
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 14 }}>
          <div style={{ display: 'flex', fontSize: 84, fontWeight: 800, letterSpacing: -3, lineHeight: 1, color: TEXT }}>7</div>
          <div style={{ display: 'flex', fontSize: 28, color: MUTED, marginLeft: 8 }}>day streak</div>
        </div>

        {bars.map(([label, value]) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, color: MUTED }}>
              <span>{label}</span>
              <span style={{ color: TEXT, fontWeight: 700 }}>{value}%</span>
            </div>
            <div style={{ display: 'flex', height: 10, borderRadius: 999, background: 'rgba(255,255,255,0.1)', marginTop: 7 }}>
              <div style={{ display: 'flex', width: `${value}%`, height: 10, borderRadius: 999, background: GREEN }} />
            </div>
          </div>
        ))}

        <div
          style={{
            display: 'flex',
            alignSelf: 'flex-start',
            marginTop: 20,
            padding: '8px 16px',
            borderRadius: 12,
            background: 'rgba(52,214,123,0.14)',
            color: GREEN,
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          Keep the streak going
        </div>
      </div>
    </div>
  );
}

function CallToAction({ text }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 32px',
        borderRadius: 999,
        background: GREEN,
        color: DARK,
        fontSize: 30,
        fontWeight: 800,
        boxShadow: '0 12px 40px rgba(52,214,123,0.4)',
      }}
    >
      <span>{text}</span>
      {/* Arrow drawn with borders, so it does not depend on a font */}
      <div
        style={{
          display: 'flex',
          width: 14,
          height: 14,
          marginLeft: 14,
          borderTop: `5px solid ${DARK}`,
          borderRight: `5px solid ${DARK}`,
          transform: 'rotate(45deg)',
        }}
      />
    </div>
  );
}

/**
 * Branded 1200x630 share card, used for the site default, every topic and every problem.
 * - chips: short labels shown under the text (topic, difficulty, time)
 * - highlight: words of the title to show in green
 * - preview: true adds the mock "daily practice" card on the right (the site default and list pages)
 * - cta: text of the button drawn in the bottom right
 * X draws the page title over the bottom-left of the image, so that corner is kept empty.
 */
export function renderOg({ eyebrow, title, subtitle, chips = [], highlight = [], preview = false, cta = 'Start practicing free' }) {
  const size = preview
    ? title.length > 60 ? 46 : title.length > 40 ? 52 : 58
    : title.length > 90 ? 52 : title.length > 55 ? 62 : 74;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '40px 64px',
          backgroundImage:
            'radial-gradient(circle at 88% 22%, rgba(52,214,123,0.30) 0%, rgba(52,214,123,0) 42%), radial-gradient(circle at 6% 100%, rgba(52,214,123,0.14) 0%, rgba(52,214,123,0) 38%), linear-gradient(135deg, #0c2216 0%, #121513 50%, #0a0d0b 100%)',
          color: TEXT,
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Brand />
          <div
            style={{
              display: 'flex',
              padding: '8px 22px',
              borderRadius: 999,
              border: '2px solid rgba(52,214,123,0.5)',
              color: GREEN,
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            buncho.live
          </div>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: preview ? 640 : '100%' }}>
            {eyebrow && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                  padding: '8px 20px',
                  borderRadius: 999,
                  background: 'rgba(52,214,123,0.12)',
                  border: '1px solid rgba(52,214,123,0.35)',
                  color: GREEN,
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                }}
              >
                <div style={{ display: 'flex', width: 10, height: 10, borderRadius: 999, background: GREEN, marginRight: 12 }} />
                <span>{eyebrow}</span>
              </div>
            )}

            <div style={{ display: 'flex', marginTop: 22 }}>
              <Headline title={title} highlight={highlight} size={size} />
            </div>

            {subtitle && (
              <div style={{ display: 'flex', marginTop: 18, fontSize: preview ? 28 : 30, color: MUTED, lineHeight: 1.35 }}>{subtitle}</div>
            )}

            {chips.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 26 }}>
                {chips.map((c) => (
                  <div
                    key={c}
                    style={{
                      display: 'flex',
                      marginRight: 12,
                      marginBottom: 8,
                      padding: '9px 20px',
                      borderRadius: 999,
                      fontSize: 24,
                      fontWeight: 700,
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: DIFF_COLOR[c] ?? TEXT,
                    }}
                  >
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>

          {preview && <PreviewCard />}
        </div>

        {/* Bottom row: button on the right. The bottom-left is kept clear for the title X draws there. */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <CallToAction text={cta} />
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}

/* ---------- Interview experience card ---------- */

// The whole card takes the colour of the result, so a link preview says "selected" or "rejected" before anyone reads it.
const OUTCOME_COLOR = { Selected: GREEN, Rejected: '#ff6b6b', Waitlisted: AMBER, 'Awaiting Result': '#c3ccd8' };
const TONE_COLOR = { EASY: GREEN, MEDIUM: AMBER, HARD: '#ff6b6b' };
const TONE_STEPS = { EASY: 1, MEDIUM: 2, HARD: 3 };
const TONE_LABEL = { EASY: 'Easy', MEDIUM: 'Medium', HARD: 'Hard' };
const INK_SOFT = 'rgba(4,20,10,0.72)';

/** Three bars filled by difficulty, drawn with plain boxes. */
function Meter({ tone, on, off }) {
  const steps = TONE_STEPS[tone] ?? 1;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{ display: 'flex', width: 8, height: 6 + i * 6, marginLeft: i > 1 ? 4 : 0, borderRadius: 3, background: i <= steps ? on : off }}
        />
      ))}
    </div>
  );
}

/** Tick, cross or ring, built from boxes so it does not depend on a font. */
function OutcomeGlyph({ outcome }) {
  if (outcome === 'Selected') {
    return <div style={{ display: 'flex', width: 11, height: 21, marginTop: -4, borderRight: `5px solid ${DARK}`, borderBottom: `5px solid ${DARK}`, transform: 'rotate(45deg)' }} />;
  }
  if (outcome === 'Rejected') {
    return (
      <div style={{ display: 'flex', position: 'relative', width: 26, height: 26 }}>
        <div style={{ display: 'flex', position: 'absolute', left: 0, top: 10, width: 26, height: 5, borderRadius: 3, background: DARK, transform: 'rotate(45deg)' }} />
        <div style={{ display: 'flex', position: 'absolute', left: 0, top: 10, width: 26, height: 5, borderRadius: 3, background: DARK, transform: 'rotate(-45deg)' }} />
      </div>
    );
  }
  return <div style={{ display: 'flex', width: 22, height: 22, borderRadius: 999, border: `5px solid ${DARK}` }} />;
}

/** The candidate card: who shared it, the result, and every round with its difficulty. */
function ExperienceCard({ name, background, outcome, difficulty, rounds }) {
  const color = OUTCOME_COLOR[outcome] ?? OUTCOME_COLOR['Awaiting Result'];
  // Four rows is what fits: with more rounds, show three and count the rest
  const shown = rounds.length > 4 ? rounds.slice(0, 3) : rounds;
  const extra = rounds.length - shown.length;
  const edge = `4px solid ${DARK}`;

  return (
    <div style={{ display: 'flex', position: 'absolute', left: 696, top: 96, width: 448, height: 500 }}>
      {/* Second card behind, for depth */}
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          left: 14,
          top: 14,
          width: 420,
          height: 460,
          boxSizing: 'border-box',
          borderRadius: 34,
          background: 'rgba(255,255,255,0.45)',
          border: edge,
          transform: 'rotate(-5deg)',
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          left: 0,
          top: 8,
          width: 440,
          boxSizing: 'border-box',
          padding: 26,
          borderRadius: 34,
          background: '#ffffff',
          border: edge,
          boxShadow: `10px 10px 0 ${DARK}`,
          transform: 'rotate(2deg)',
        }}
      >
        {/* Who */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 58,
              height: 58,
              borderRadius: 18,
              background: DARK,
              color,
              fontSize: 30,
              fontWeight: 800,
              marginRight: 14,
            }}
          >
            {(name || '?').trim().charAt(0).toUpperCase()}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ display: 'flex', fontSize: 29, fontWeight: 800, color: DARK }}>{name}</div>
            {background && <div style={{ display: 'flex', fontSize: 18, color: '#5b6b60', marginTop: 2 }}>{background}</div>}
          </div>
        </div>

        {/* Result */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 20, padding: '12px 18px', borderRadius: 22, background: DARK }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 46, height: 46, borderRadius: 999, background: color, marginRight: 14 }}>
            <OutcomeGlyph outcome={outcome} />
          </div>
          <div style={{ display: 'flex', flex: 1, fontSize: outcome.length > 10 ? 28 : 36, fontWeight: 800, color }}>{outcome}</div>
          {outcome.length <= 10 && <div style={{ display: 'flex', marginRight: 10, fontSize: 20, fontWeight: 700, color: TEXT }}>{TONE_LABEL[difficulty] ?? ''}</div>}
          <Meter tone={difficulty} on={TONE_COLOR[difficulty] ?? color} off="rgba(255,255,255,0.22)" />
        </div>

        {/* Rounds */}
        <div style={{ display: 'flex', marginTop: 20, fontSize: 18, fontWeight: 700, color: '#5b6b60' }}>Round by round</div>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
          {shown.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 36, marginRight: 14 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: 999,
                    background: TONE_COLOR[r.tone] ?? GREEN,
                    border: `3px solid ${DARK}`,
                    color: DARK,
                    fontSize: 16,
                    fontWeight: 800,
                  }}
                >
                  {`R${i + 1}`}
                </div>
                {/* Line down to the next round */}
                {(i < shown.length - 1 || extra > 0) && <div style={{ display: 'flex', width: 4, height: 14, background: DARK }} />}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, height: 36 }}>
                <div style={{ display: 'flex', flex: 1, fontSize: 22, fontWeight: 700, color: DARK }}>{r.type}</div>
                <Meter tone={r.tone} on={DARK} off="rgba(4,20,10,0.16)" />
              </div>
            </div>
          ))}
          {extra > 0 && <div style={{ display: 'flex', height: 36, alignItems: 'center', marginLeft: 50, fontSize: 19, fontWeight: 700, color: '#5b6b60' }}>{`+${extra} more ${extra === 1 ? 'round' : 'rounds'}`}</div>}
        </div>
      </div>
    </div>
  );
}

/** Largest headline size that keeps the title within about two lines of the big type (or three of the small). */
function headlineSize(text) {
  for (const size of [92, 72, 56, 48]) {
    const maxChars = Math.floor(600 / (size * 0.58));
    let lines = 1;
    let len = 0;
    for (const word of text.split(' ')) {
      const add = (len ? 1 : 0) + word.length;
      if (len + add > maxChars) { lines += 1; len = word.length; } else len += add;
    }
    if (lines * size * 1.02 <= 200) return size;
  }
  return 48;
}

/**
 * 1200x630 share card for one interview experience. Flat colour, no gradients.
 * The background is the colour of the result (green selected, coral rejected, amber waitlisted).
 * `rounds` is [{ type, tone }] in order, tone being the hardest question of that round.
 * The bottom-left corner stays clear for the title bar X draws there.
 */
export function renderExperienceOg({ role, company, when, name, background, outcome, difficulty, level, rounds, questions }) {
  const color = OUTCOME_COLOR[outcome] ?? OUTCOME_COLOR['Awaiting Result'];
  const path = rounds.map((r) => ({ type: r.type, tone: r.tone }));
  const size = headlineSize(role);
  const chips = [level, `${path.length} ${path.length === 1 ? 'round' : 'rounds'}`, `${questions} questions`].filter(Boolean);

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: color, color: DARK, fontFamily: 'sans-serif' }}>
        {/* Brand */}
        <div style={{ display: 'flex', position: 'absolute', left: 64, top: 44, alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 52,
              height: 52,
              borderRadius: 15,
              background: DARK,
              color,
              fontSize: 38,
              fontWeight: 800,
              marginRight: 14,
            }}
          >
            b
          </div>
          <div style={{ display: 'flex', fontSize: 36, fontWeight: 800, color: DARK }}>buncho.</div>
        </div>
        <div style={{ display: 'flex', position: 'absolute', right: 64, top: 44, padding: '7px 22px', borderRadius: 999, border: `3px solid ${DARK}`, fontSize: 24, fontWeight: 800 }}>
          buncho.live
        </div>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', left: 64, top: 128, width: 600 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 0, fontSize: size, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3 }}>
            {role.split(' ').map((word, i) => (
              <span key={`${word}-${i}`} style={{ marginRight: Math.round(size * 0.24) }}>
                {word}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', marginTop: 16, fontSize: 30, fontWeight: 700, color: INK_SOFT, lineHeight: 1.25 }}>
            {[company, when].filter(Boolean).join(', ')}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 22 }}>
            {chips.map((c) => (
              <div
                key={c}
                style={{ display: 'flex', marginRight: 12, marginBottom: 8, padding: '8px 20px', borderRadius: 999, border: `3px solid ${DARK}`, fontSize: 23, fontWeight: 800 }}
              >
                {c}
              </div>
            ))}
          </div>
        </div>

        {/* Button, sitting above the corner X covers with its title */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            left: 64,
            top: 470,
            alignItems: 'center',
            padding: '12px 14px 12px 34px',
            borderRadius: 999,
            background: DARK,
            color: TEXT,
            fontSize: 30,
            fontWeight: 800,
            boxShadow: '7px 7px 0 rgba(255,255,255,0.85)',
          }}
        >
          <span>Read the full experience</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, marginLeft: 22, borderRadius: 999, background: color }}>
            {/* Arrow drawn with borders, so it does not depend on a font */}
            <div style={{ display: 'flex', width: 15, height: 15, marginLeft: -4, borderTop: `5px solid ${DARK}`, borderRight: `5px solid ${DARK}`, transform: 'rotate(45deg)' }} />
          </div>
        </div>

        <ExperienceCard name={name} background={background} outcome={outcome} difficulty={difficulty} rounds={path} />
      </div>
    ),
    { ...OG_SIZE },
  );
}