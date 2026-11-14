import data from '@/data/interview-experiences.json';

// All interview experiences live in src/data/interview-experiences.json.
// To add one, append an object to "experiences" using the same shape. No code change is needed.

export const LEVEL_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'Full-time', label: 'Full-time' },
  { key: 'Internship', label: 'Internship' },
];

const byNewest = (a, b) => String(b.date).localeCompare(String(a.date));

export function getAllExperiences() {
  return [...data.experiences].sort(byNewest);
}

export function getExperience(slug) {
  return data.experiences.find((e) => e.slug === slug) ?? null;
}

export function countQuestions(exp) {
  return exp.rounds.reduce((n, r) => n + r.questions.length, 0);
}

/** "2026-09" -> "Sep 2026" */
export function formatMonth(value) {
  const d = new Date(`${value}-01T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export const OUTCOME_TONE = {
  Selected: 'bg-easy/15 text-easy',
  Rejected: 'bg-hard/15 text-hard',
  Waitlisted: 'bg-medium/15 text-medium',
};

const RANK = { EASY: 1, MEDIUM: 2, HARD: 3 };

/** Hardest question difficulty inside one round: 'EASY' | 'MEDIUM' | 'HARD'. */
export function hardestOf(round) {
  return round.questions.reduce((top, q) => (RANK[q.difficulty] > RANK[top] ? q.difficulty : top), 'EASY');
}

/** { EASY: n, MEDIUM: n, HARD: n } across every round of an experience. */
export function difficultyCounts(exp) {
  const counts = { EASY: 0, MEDIUM: 0, HARD: 0 };
  exp.rounds.forEach((r) => r.questions.forEach((q) => { counts[q.difficulty] += 1; }));
  return counts;
}