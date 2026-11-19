import { cache } from 'react';
import { generateHTML } from '@tiptap/html/server';
import { prisma } from '@/lib/prisma';
import { continueNumbering, extractQuestions, findQuestion, isDoc } from './tree';
import { buildExtensions } from './extensions';
import { enhanceDocHtml } from './highlight';

export const loadQuestion = cache(async (slug) => {
  const problem = await prisma.problem.findFirst({
    where: { slug, published: true },
    select: {
      id: true,
      slug: true,
      title: true,
      proOnly: true,
      difficulty: true,
      estimatedMinutes: true,
      roles: true,
      subcategory: true,
      isChallenge: true,
      createdAt: true,
      updatedAt: true,
      topic: { select: { slug: true, name: true, content: true, settings: true } },
    },
  });
  if (!problem || !isDoc(problem.topic.content)) return null;
  const found = findQuestion(problem.topic.content, slug);
  if (!found) return null;
  return { problem, found };
});

export function renderAnswerHtml(found) {
  return enhanceDocHtml(
    generateHTML({ type: 'doc', content: found.body.length ? continueNumbering(found.body) : [{ type: 'paragraph' }] }, buildExtensions()),
  );
}

export function readInsights(topicContent, slug) {
  const q = extractQuestions(topicContent).find((item) => item.id === slug);
  return { companies: q?.companies ?? [], asked: q?.asked ?? null };
}