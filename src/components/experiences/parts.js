import { hardestOf } from '@/lib/interview-experiences';

// Small visual building blocks for the interview-experience pages (server safe, no hooks).

export const TONE_BG = { EASY: 'bg-easy', MEDIUM: 'bg-medium', HARD: 'bg-hard' };
export const TONE_TEXT = { EASY: 'text-easy', MEDIUM: 'text-medium', HARD: 'text-hard' };
export const LEVEL_LABEL = { EASY: 'Easy', MEDIUM: 'Medium', HARD: 'Hard' };
const FILLED = { EASY: 1, MEDIUM: 2, HARD: 3 };

/** Initial in a soft square, used instead of logos. */
export function CompanyMark({ name, size = 44 }) {
  return (
    <span
      aria-hidden="true"
      className="grid shrink-0 place-items-center rounded-xl bg-surface-2 font-display font-bold text-ink"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {(name || '?').trim().charAt(0).toUpperCase()}
    </span>
  );
}

/** Three small bars, filled by difficulty. */
export function DifficultyMeter({ level, label = true }) {
  return (
    <span className={`inline-flex items-center gap-2 text-xs font-medium ${TONE_TEXT[level]}`} title={`${LEVEL_LABEL[level]} difficulty`}>
      <span aria-hidden="true" className="flex items-end gap-0.5">
        {[1, 2, 3].map((i) => (
          <span key={i} className={`w-1 rounded-sm ${i <= FILLED[level] ? 'bg-current' : 'bg-line'}`} style={{ height: 6 + i * 3 }} />
        ))}
      </span>
      {label && LEVEL_LABEL[level]}
    </span>
  );
}

/** One-line stacked bar: share of easy / medium / hard questions. */
export function DifficultyBar({ counts, legend = false }) {
  const total = counts.EASY + counts.MEDIUM + counts.HARD || 1;
  return (
    <div>
      <div className="flex h-2 w-full gap-0.5 overflow-hidden rounded-full" role="img"
        aria-label={`${counts.EASY} easy, ${counts.MEDIUM} medium, ${counts.HARD} hard questions`}>
        {['EASY', 'MEDIUM', 'HARD'].map((k) =>
          counts[k] > 0 ? <span key={k} className={`${TONE_BG[k]} first:rounded-l-full last:rounded-r-full`} style={{ width: `${(counts[k] / total) * 100}%` }} /> : null,
        )}
      </div>
      {legend && (
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          {['EASY', 'MEDIUM', 'HARD'].map((k) => (
            <li key={k} className="inline-flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${TONE_BG[k]}`} /> {counts[k]} {LEVEL_LABEL[k].toLowerCase()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * The interview as a path: R1 ── R2 ── R3. Each node is coloured by the hardest question in that round.
 * With `anchors` the nodes link to #<round id> and show the round type underneath.
 */
export function Pipeline({ rounds, anchors = false }) {
  return (
    <ol className="flex w-full items-start" aria-label="Interview rounds">
      {rounds.map((r, i) => {
        const tone = hardestOf(r);
        const node = (
          <span className={`grid h-9 w-9 place-items-center rounded-full text-xs font-bold text-white shadow-sm transition-transform ${TONE_BG[tone]} ${anchors ? 'group-hover:scale-110' : ''}`}>
            {r.id.toUpperCase()}
          </span>
        );
        return (
          <li key={r.id} className={`flex items-start ${i < rounds.length - 1 ? 'flex-1' : ''}`}>
            {anchors ? (
              <a href={`#${r.id}`} className="group flex w-16 flex-col items-center gap-1.5 text-center" title={`${r.title} (${LEVEL_LABEL[tone]})`}>
                {node}
                <span className="text-[11px] font-medium leading-tight text-muted group-hover:text-ink">{r.type}</span>
              </a>
            ) : (
              <span title={`${r.title} (${LEVEL_LABEL[tone]})`}>{node}</span>
            )}
            {i < rounds.length - 1 && <span aria-hidden="true" className="mx-1 mt-[18px] h-px flex-1 bg-line" />}
          </li>
        );
      })}
    </ol>
  );
}