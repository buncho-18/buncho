'use server';

import { randomBytes } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getOrCreateUser } from '@/lib/user';
import {
  COMPANY_TYPES,
  DIFFICULTIES,
  LEVELS,
  LIMITS,
  OUTCOMES,
  ROUND_MODES,
  ROUND_TYPES,
} from '@/lib/interview-experience-options';

const fail = (error) => ({ ok: false, error });
const clean = (v, max) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
// Keeps line breaks (for the summary and round notes), collapses everything else
const cleanText = (v, max) => String(v ?? '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim().slice(0, max);
const RANK = { EASY: 1, MEDIUM: 2, HARD: 3 };

function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

/** Saves an interview experience. This is a public endpoint, so everything is checked again here. */
export async function submitExperience(input) {
  const user = await getOrCreateUser();
  if (!user) return fail('Please log in to share your experience.');

  const companyName = clean(input?.companyName, LIMITS.company);
  if (!companyName) return fail('Add the company name.');

  const role = clean(input?.role, LIMITS.role);
  if (!role) return fail('Add the role you interviewed for.');

  if (!LEVELS.includes(input?.level)) return fail('Choose Full-time or Internship.');
  if (!OUTCOMES.includes(input?.outcome)) return fail('Choose the outcome.');

  const date = String(input?.date ?? '');
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(date)) return fail('Choose the month of the interview.');
  const now = new Date();
  const thisMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
  if (date > thisMonth) return fail('The interview month cannot be in the future.');
  if (Number(date.slice(0, 4)) < 2015) return fail('That interview month looks too old.');

  const companyType = COMPANY_TYPES.includes(input?.companyType) ? input.companyType : null;
  const location = clean(input?.location, LIMITS.location) || null;
  const background = clean(input?.background, LIMITS.background) || null;
  const totalDuration = clean(input?.totalDuration, LIMITS.duration) || null;

  const summary = cleanText(input?.summary, LIMITS.summary.max);
  if (summary.length < LIMITS.summary.min) return fail('Write a short summary of how the interview went (a couple of sentences).');

  // Rounds and questions
  if (!Array.isArray(input?.rounds) || input.rounds.length === 0) return fail('Add at least one round.');
  if (input.rounds.length > LIMITS.maxRounds) return fail(`You can add up to ${LIMITS.maxRounds} rounds.`);

  const rounds = [];
  let hardest = 'EASY';
  for (let i = 0; i < input.rounds.length; i += 1) {
    const r = input.rounds[i];
    const id = `r${i + 1}`;
    const title = clean(r?.title, LIMITS.roundTitle);
    if (!title) return fail(`Round ${i + 1}: add a title, for example "Technical round 1".`);

    const rawQuestions = Array.isArray(r?.questions) ? r.questions : [];
    if (rawQuestions.length > LIMITS.maxQuestionsPerRound) return fail(`Round ${i + 1}: add up to ${LIMITS.maxQuestionsPerRound} questions.`);

    const questions = [];
    for (const q of rawQuestions) {
      const text = cleanText(q?.text, LIMITS.question.max);
      if (!text) continue; // empty rows are ignored
      if (text.length < LIMITS.question.min) return fail(`Round ${i + 1}: one question is too short.`);
      const difficulty = DIFFICULTIES.includes(q?.difficulty) ? q.difficulty : 'MEDIUM';
      if (RANK[difficulty] > RANK[hardest]) hardest = difficulty;
      questions.push({
        id: `${id}-q${questions.length + 1}`,
        text,
        topic: clean(q?.topic, LIMITS.topic) || null,
        difficulty,
        solution: null,
      });
    }
    if (questions.length === 0) return fail(`Round ${i + 1}: add at least one question you were asked.`);

    rounds.push({
      id,
      title,
      type: ROUND_TYPES.includes(r?.type) ? r.type : 'Other',
      mode: ROUND_MODES.includes(r?.mode) ? r.mode : null,
      duration: clean(r?.duration, LIMITS.duration) || null,
      summary: cleanText(r?.summary, LIMITS.roundSummary),
      questions,
    });
  }

  const tips = (Array.isArray(input?.tips) ? input.tips : [])
    .map((t) => cleanText(t, LIMITS.tip))
    .filter(Boolean)
    .slice(0, LIMITS.maxTips);

  // Rate limit
  const nowMs = Date.now();
  const [lastHour, lastDay] = await Promise.all([
    prisma.interviewExperience.count({ where: { userId: user.id, createdAt: { gte: new Date(nowMs - 3600 * 1000) } } }),
    prisma.interviewExperience.count({ where: { userId: user.id, createdAt: { gte: new Date(nowMs - 86400 * 1000) } } }),
  ]);
  if (lastHour >= LIMITS.perHour || lastDay >= LIMITS.perDay) return fail('You have shared a few experiences already. Please try again later.');

  const base = slugify(`${role} ${companyName}`) || 'interview-experience';
  const slug = `${base}-${randomBytes(3).toString('hex')}`;

  await prisma.interviewExperience.create({
    data: {
      slug,
      userId: user.id,
      companyName,
      companyType,
      location,
      role,
      level: input.level,
      date,
      outcome: input.outcome,
      difficulty: hardest,
      totalDuration,
      summary,
      anonymous: input?.anonymous === true,
      background,
      rounds,
      tips,
    },
  });

  revalidatePath('/interview-experiences');
  revalidatePath('/sitemap.xml');
  return { ok: true, slug };
}