import data from '@/data/interview-experiences.json';
import { prisma } from '@/lib/prisma';

export * from '@/lib/interview-experience-options';

// Two sources, merged into one list:
//  1. Curated experiences in src/data/interview-experiences.json (append an object to "experiences", no code change needed).
//  2. Community experiences that users submit at /interview-experiences/new. They live in the InterviewExperience table.

export const LEVEL_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'Full-time', label: 'Full-time' },
  { key: 'Internship', label: 'Internship' },
];

const byNewest = (a, b) => String(b.date).localeCompare(String(a.date)) || String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? ''));

/** Turns a database row into the same shape the JSON file uses, so the pages need no special cases. */
function fromRow(row) {
  const background = row.background?.trim();
  return {
    slug: row.slug,
    community: true,
    createdAt: row.createdAt.toISOString(),
    title: `${row.role} interview`,
    candidate: {
      name: row.anonymous ? 'Anonymous' : row.authorName || 'A Buncho member',
      background: background || 'Community member',
    },
    company: { name: row.companyName, type: row.companyType ?? '', location: row.location ?? '' },
    role: row.role,
    level: row.level,
    date: row.date,
    outcome: row.outcome,
    difficulty: row.difficulty,
    totalDuration: row.totalDuration || 'Not shared',
    summary: row.summary,
    tags: [],
    rounds: Array.isArray(row.rounds) ? row.rounds : [],
    tips: Array.isArray(row.tips) ? row.tips : [],
  };
}

const SELECT = {
  slug: true, companyName: true, companyType: true, location: true, role: true, level: true, date: true,
  outcome: true, difficulty: true, totalDuration: true, summary: true, anonymous: true, background: true,
  rounds: true, tips: true, createdAt: true,
  user: { select: { name: true, profileName: true } },
};

function withAuthor(row) {
  const raw = (row.user?.profileName || row.user?.name || '').trim();
  // "Ritesh Kumar" -> "Ritesh K."
  const [first, ...rest] = raw.split(/\s+/);
  const authorName = first ? (rest.length ? `${first} ${rest[rest.length - 1][0].toUpperCase()}.` : first) : '';
  return fromRow({ ...row, authorName });
}

async function getCommunityExperiences() {
  try {
    const rows = await prisma.interviewExperience.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 500,
      select: SELECT,
    });
    return rows.map(withAuthor);
  } catch (err) {
    // The page must still work before the migration is applied or if the database is asleep
    console.error('Could not load community interview experiences', err);
    return [];
  }
}

export async function getAllExperiences() {
  const community = await getCommunityExperiences();
  return [...data.experiences, ...community].sort(byNewest);
}

export async function getExperience(slug) {
  const curated = data.experiences.find((e) => e.slug === slug);
  if (curated) return curated;
  try {
    const row = await prisma.interviewExperience.findFirst({ where: { slug, published: true }, select: SELECT });
    return row ? withAuthor(row) : null;
  } catch (err) {
    console.error('Could not load interview experience', err);
    return null;
  }
}

/** Slugs of the curated experiences only. Community ones are rendered on first visit and then cached. */
export function getCuratedSlugs() {
  return data.experiences.map((e) => e.slug);
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
  'Awaiting Result': 'bg-surface-2 text-muted',
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