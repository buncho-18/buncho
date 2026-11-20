// The question library has four categories:
//   ai   -> /problems      (/problems/ai shows the same list)
//   hr   -> /problems/hr
//   sql  -> /problems/sql
//   core -> /problems/core (core CS subjects: Java, DBMS, CN and OS)
// All of them work the same way: the admin writes one document per category at /docs/<category>, each tab of it is a
// topic, and every Heading 2 is a question. A topic belongs to HR when its slug is "hr" or starts with "hr-", to SQL
// when it is "sql" or starts with "sql-", to Core when it is "core" or starts with "core-", and to AI otherwise
// (the doc code makes sure AI slugs never look like HR/SQL/Core).
// For Core, make one tab per subject (Java, DBMS, CN, OS) at /docs/core. Their slugs become core-java, core-dbms, ...
const hasPrefix = (slug, p) => slug === p || String(slug ?? '').startsWith(`${p}-`);

export const CATEGORIES = {
  ai: {
    key: 'ai',
    label: 'AI/ML ',
    short: 'AI',
    path: '/problems',
    title: 'AI, ML and GenAI interview questions',
    description: 'Technical questions on LLMs, RAG, deep learning, MLOps and system design.',
  },
  hr: {
    key: 'hr',
    label: 'HR ',
    short: 'HR',
    path: '/problems/hr',
    title: 'HR interview questions for AI engineers',
    description: 'Behavioural and HR questions to practise your own answers.',
  },
  sql: {
    key: 'sql',
    label: 'SQL ',
    short: 'SQL',
    path: '/problems/sql',
    title: 'SQL interview questions for AI engineers',
    description: 'SQL questions for AI, ML and data roles to practise on your own.',
  },
  core: {
    key: 'core',
    label: 'Core ',
    short: 'Core',
    path: '/problems/core',
    title: 'Core CS interview questions: Java, DBMS, CN and OS',
    description: 'Core computer science questions on Java, DBMS, computer networks and operating systems.',
  },
};

export const isHrTopic = (topicSlug) => hasPrefix(topicSlug, 'hr');
export const isSqlTopic = (topicSlug) => hasPrefix(topicSlug, 'sql');
export const isCoreTopic = (topicSlug) => hasPrefix(topicSlug, 'core');
export const categoryOf = (topicSlug) =>
  isHrTopic(topicSlug) ? 'hr' : isSqlTopic(topicSlug) ? 'sql' : isCoreTopic(topicSlug) ? 'core' : 'ai';

/** Prisma filter for `topic` that keeps only one category. 'all' (or anything else) means no filter. */
export function topicCategoryWhere(category) {
  const is = (p) => ({ OR: [{ slug: p }, { slug: { startsWith: `${p}-` } }] });
  if (category === 'hr') return is('hr');
  if (category === 'sql') return is('sql');
  if (category === 'core') return is('core');
  if (category === 'ai') return { NOT: [is('hr'), is('sql'), is('core')] };
  return undefined;
}

/** The document tab for a topic, e.g. /docs/ai/python-basics */
export const docHref = (topicSlug) => `/docs/${categoryOf(topicSlug)}/${topicSlug}`;

/** Page URL for one question: its place in the document. A question's slug is its heading anchor. */
export const problemHref = (slug, topicSlug) => `${CATEGORIES[categoryOf(topicSlug)].path}/${slug}`;