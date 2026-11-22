import { OG_SIZE, OG_TYPE, renderExperienceOg, renderOg } from '@/lib/og';
import { countQuestions, formatMonth, getExperience, hardestOf } from '@/lib/interview-experiences';
import { truncate } from '@/lib/seo';

export const alt = 'Buncho interview experience';
export const size = OG_SIZE;
export const contentType = OG_TYPE;

// Drawing an image is CPU heavy and every crawler and link preview asks for it, so render it once a day.
export const revalidate = 86400;

// Built on first request, then cached.
export async function generateStaticParams() {
  return [];
}

export default async function Image({ params }) {
  const { slug } = await params;
  const exp = await getExperience(slug);
  if (!exp) return renderOg({ eyebrow: 'Interview experiences', title: 'AI engineer interview experiences', cta: 'Read experiences' });

  return renderExperienceOg({
    role: truncate(exp.role, 60),
    company: truncate(exp.company.name, 30),
    when: formatMonth(exp.date),
    name: truncate(exp.candidate.name, 22),
    background: exp.candidate.background ? truncate(exp.candidate.background, 34) : '',
    outcome: exp.outcome,
    difficulty: exp.difficulty,
    level: exp.level,
    rounds: exp.rounds.map((r) => ({ type: truncate(r.type, 16), tone: hardestOf(r) })),
    questions: countQuestions(exp),
  });
}