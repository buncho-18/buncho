// import { Fragment } from 'react';
// import Link from 'next/link';
// import { auth } from '@clerk/nextjs/server';
// import Logo from '@/components/Logo';
// import JsonLd from '@/components/JsonLd';
// import HeroBackdrop from '@/components/home/HeroBackdrop';
// import { Book, Chat, ChevronRight, Grid, Tag, Users } from '@/components/icons';
// import { getTotalProblemCount } from '@/lib/problems';
// import {
//   SITE_NAME,
//   SITE_TAGLINE,
//   SITE_DESCRIPTION,
//   X_HANDLE,
//   X_URL,
//   buildMetadata,
//   graph,
//   organizationJsonLd,
//   websiteJsonLd,
// } from '@/lib/seo';

// export const metadata = buildMetadata({
//   absoluteTitle: `${SITE_NAME}: ${SITE_TAGLINE}`,
//   description: SITE_DESCRIPTION,
//   path: '/',
// });

// const FAQ = [
//   {
//     q: 'What is Buncho?',
//     a: 'Buncho is an interview practice platform for AI, machine learning and generative AI engineers. You answer real interview questions by speaking or typing, then practise again until it comes out clearly.',
//   },
//   {
//     q: 'Which topics and question types are covered?',
//     a: 'Topics include machine learning fundamentals, deep learning, generative AI and LLMs, RAG and vector databases, Python for AI and ML, and production AI engineering. Questions range from conceptual and practical exercises to debugging, system design and case studies.',
//   },
//   {
//     q: 'Can I answer out loud instead of typing?',
//     a: 'Yes. Use the microphone to dictate your answer, or type it. Explaining a long scenario out loud is closer to a real interview.',
//   },
//   {
//     q: 'Do I get model answers or AI feedback?',
//     a: 'No. Buncho gives you real interview questions to practise on. Your answers are private and saved for you to revisit, and there are no model answers or AI scoring.',
//   },
//   {
//     q: 'Is Buncho free?',
//     a: 'You can start practicing for free. Create a free account to save answers and track your streak and progress.',
//   },
// ];

// // Floating topic chips around the launcher (wide screens only, purely decorative)
// const CHIPS = [
//   ['RAG', 'bg-accent', 'left-[7%] top-[16%] -rotate-6'],
//   ['LLM evaluation', 'bg-[#6b78ff]', 'left-[8%] top-[44%] rotate-3'],
//   ['Agents', 'bg-medium', 'left-[9%] top-[72%] -rotate-3'],
//   ['System design', 'bg-hard', 'right-[8%] top-[15%] rotate-6'],
//   ['Embeddings', 'bg-easy', 'right-[3%] top-[46%] -rotate-3'],
//   ['SQL', 'bg-accent', 'right-[10%] top-[74%] rotate-3'],
//   ['Python', 'bg-[#6b78ff]', 'left-[24%] top-[88%] rotate-2'],
//   ['MLOps', 'bg-medium', 'right-[26%] top-[89%] -rotate-2'],
// ];

// function Chips() {
//   return (
//     <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
//       {CHIPS.map(([label, dot, pos], i) => (
//         <span
//           key={label}
//           style={{ '--d': `${(i * 0.9) % 5}s` }}
//           className={`chip-float absolute hidden items-center gap-2 rounded-full border border-line bg-surface/80 px-3.5 py-1.5 text-xs font-semibold text-muted shadow-sm backdrop-blur xl:inline-flex ${pos}`}
//         >
//           <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
//           {label}
//         </span>
//       ))}
//     </div>
//   );
// }

// // Floating icon rail (wide screens). Sits inside the page instead of being glued to the edge.
// function RailLink({ href, label, children }) {
//   return (
//     <Link
//       href={href}
//       aria-label={label}
//       className="group/r relative grid h-11 w-11 place-items-center rounded-xl text-muted transition hover:bg-surface-2 hover:text-ink"
//     >
//       {children}
//       <span className="pointer-events-none absolute left-full z-10 ml-3 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs font-medium text-bg opacity-0 transition-opacity group-hover/r:opacity-100">
//         {label}
//       </span>
//     </Link>
//   );
// }

// // What each card contains, drawn as a tiny preview so the page is not just text and buttons.
// const PREVIEW_Q = [
//   ['Explain chunking trade-offs in RAG', 'bg-easy'],
//   ['Debug a retriever with low recall', 'bg-medium'],
//   ['Design an LLM evaluation pipeline', 'bg-hard'],
// ];
// const PREVIEW_R = [['R1', 'bg-easy', 'var(--easy)'], ['R2', 'bg-medium', 'var(--medium)'], ['R3', 'bg-hard', 'var(--hard)'], ['R4', 'bg-easy', 'var(--easy)']];

// function QuestionPreview() {
//   return (
//     <ul aria-hidden="true" className="flex h-[108px] w-full flex-col justify-center gap-2.5 rounded-xl bg-surface-2/70 px-4 text-left text-xs font-medium">
//       {PREVIEW_Q.map(([t, dot]) => (
//         <li key={t} className="flex items-center gap-2.5">
//           <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
//           <span className="truncate">{t}</span>
//         </li>
//       ))}
//     </ul>
//   );
// }

// function RoundsPreview() {
//   return (
//     <div aria-hidden="true" className="flex h-[108px] w-full items-center rounded-xl bg-surface-2/70 px-5">
//       {PREVIEW_R.map(([r, c, ring], i) => (
//         <Fragment key={r}>
//           <span
//             style={{ '--ring': ring, '--d': `${i * 0.7}s` }}
//             className={`node-ping grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white ${c}`}
//           >
//             {r}
//           </span>
//           {i < PREVIEW_R.length - 1 && <span className="mx-1 h-px flex-1 bg-line" />}
//         </Fragment>
//       ))}
//     </div>
//   );
// }

// // Big launcher card. The Start button stretches over the whole card (after:inset-0), so the entire card is clickable.
// // Keep the Link un-positioned, otherwise the stretched area would only cover the button.
// function LaunchCard({ href, icon, title, subtitle, tone, preview, index }) {
//   const t = {
//     blue: {
//       tile: 'bg-[#4a56e8]/15 text-[#7a86ff]',
//       btn: 'bg-[#4a56e8] text-white hover:bg-[#5a66f0]',
//       glow: 'hover:shadow-[0_20px_50px_-15px_rgba(74,86,232,0.55)] hover:border-[#4a56e8]/50',
//     },
//     green: {
//       tile: 'bg-accent/15 text-accent',
//       btn: 'bg-accent text-accent-ink hover:opacity-90',
//       glow: 'hover:shadow-[0_20px_50px_-15px_rgba(52,214,123,0.5)] hover:border-accent/50',
//     },
//   }[tone];
//   return (
//     <div
//       style={{ '--i': index }}
//       className={`rise group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-surface p-6 transition duration-300 hover:-translate-y-1 ${t.glow}`}
//     >
//       <div className="relative flex flex-col items-center text-center">
//         <span className={`grid h-16 w-16 place-items-center rounded-2xl ${t.tile}`}>{icon}</span>
//         <h2 className="font-display mt-4 text-xl font-bold">{title}</h2>
//         <p className="mt-1 text-sm text-muted">{subtitle}</p>
//       </div>
//       <div className="relative mt-5 [@media(max-height:780px)]:hidden">{preview}</div>
//       <Link
//         href={href}
//         className={`mt-5 flex w-full items-center justify-between rounded-xl px-5 py-3.5 text-lg font-bold transition after:absolute after:inset-0 after:z-10 ${t.btn}`}
//       >
//         Start <ChevronRight width={20} height={20} className="transition-transform group-hover:translate-x-1" />
//       </Link>
//     </div>
//   );
// }

// // Shown at the bottom of the launcher. Change the name here.
// const CREATOR = { name: 'Ritesh' };

// function CreatorCard() {
//   const inner = (
//     <>
//       {/* avatar with a slowly orbiting ring */}
//       <span className="relative grid h-11 w-11 shrink-0 place-items-center">
//         <span
//           aria-hidden="true"
//           className="ring-spin absolute inset-0 rounded-full"
//           style={{ background: 'conic-gradient(from 0deg, transparent 0 40%, var(--accent) 100%)' }}
//         />
//         <span className="relative grid h-[38px] w-[38px] place-items-center rounded-full bg-surface font-display text-base font-bold">
//           {CREATOR.name.charAt(0)}
//         </span>
//       </span>

//       <span className="min-w-0 text-left leading-tight">
//         <span className="block text-sm font-semibold">Built by {CREATOR.name}</span>
//         <span className="block truncate text-xs text-muted">
//           {X_HANDLE ? `Follow ${X_HANDLE} on X` : 'Creator of Buncho'}
//         </span>
//       </span>

//       {X_URL && (
//         <span
//           aria-hidden="true"
//           className="ml-2 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-2 text-muted transition-colors duration-300 group-hover:bg-ink group-hover:text-bg"
//         >
//           <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
//             <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
//           </svg>
//         </span>
//       )}
//     </>
//   );

//   const cls =
//     'rise group mt-5 inline-flex items-center gap-3 rounded-full border border-line bg-surface/80 p-1.5 pr-2 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg hover:shadow-black/10';

//   return X_URL ? (
//     <a href={X_URL} target="_blank" rel="noopener noreferrer" aria-label={`${CREATOR.name} on X`} style={{ '--i': 6 }} className={cls}>
//       {inner}
//     </a>
//   ) : (
//     <div style={{ '--i': 6 }} className={`${cls} pr-5`}>{inner}</div>
//   );
// }

// export default async function LandingPage() {
//   const { userId } = await auth();
//   let total = 0;
//   try {
//     total = await getTotalProblemCount(); // every published question: AI + HR + SQL
//   } catch {
//     // The page should still render if the database is unreachable
//   }

//   const faqJsonLd = {
//     '@type': 'FAQPage',
//     mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
//   };

//   return (
//     <>
//       <JsonLd data={graph(organizationJsonLd(), websiteJsonLd(), faqJsonLd)} />

//       <section className="relative isolate flex min-h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden lg:h-[calc(100dvh-4rem)] lg:min-h-[30rem]">
//         <HeroBackdrop />
//         <Chips />

//         {/* Floating icon rail (wide screens) */}
//         <nav
//           aria-label="Quick links"
//           className="absolute left-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-1 rounded-2xl border border-line bg-surface/80 p-1.5 shadow-sm backdrop-blur xl:flex"
//         >
//           <RailLink href={userId ? '/dashboard' : '/register'} label={userId ? 'Dashboard' : 'Create free account'}><Grid width={20} height={20} /></RailLink>
//           <RailLink href="/interview-experiences" label="Interview experiences"><Chat width={20} height={20} /></RailLink>
//           <RailLink href="/pricing" label="Pricing"><Tag width={20} height={20} /></RailLink>
//           <span aria-hidden="true" className="mx-2 my-1 h-px bg-line" />
//           <RailLink href={userId ? '/settings/profile' : '/login'} label={userId ? 'Profile' : 'Log in'}><Users width={20} height={20} /></RailLink>
//         </nav>

//         {/* Launcher */}
//         <div className="flex w-full flex-col items-center px-4 py-10">
//           <div className="rise relative" style={{ '--i': 0 }}>
//             <Logo size="xl" className="scale-[0.8] sm:scale-100" />
//           </div>
//           <p className="rise font-display mt-5 text-center text-lg font-semibold text-muted sm:text-xl" style={{ '--i': 1 }}>
//             A place where AI engineers <span className="text-ink">get interview-ready</span>
//           </p>

//           <div className="mt-10 grid w-full max-w-[46rem] gap-4 sm:grid-cols-2 [@media(max-height:780px)]:mt-6">
//             <LaunchCard
//               index={2}
//               tone="blue"
//               href="/problems"
//               title="Practice Problems"
//               subtitle="Answer real AI and ML questions"
//               icon={<Book width={30} height={30} strokeWidth={1.8} />}
//               preview={<QuestionPreview />}
//             />
//             <LaunchCard
//               index={3}
//               tone="green"
//               href="/interview-experiences"
//               title="Interview Experiences"
//               subtitle="See what each round really asks"
//               icon={<Chat width={30} height={30} strokeWidth={1.8} />}
//               preview={<RoundsPreview />}
//             />
//           </div>

//           {total > 0 && (
//             <p className="rise mt-8 inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-4 py-1.5 text-sm font-medium text-muted backdrop-blur" style={{ '--i': 5 }}>
//               <span className="h-2 w-2 animate-pulse rounded-full bg-accent" aria-hidden="true" />
//               {total.toLocaleString('en-IN')} questions to practise
//             </p>
//           )}

//           <CreatorCard />
//         </div>
//       </section>

//       {/* FAQ (kept for search engines and first-time visitors) */}
//       <section aria-labelledby="faq" className="mx-auto w-full max-w-2xl px-4 py-16">
//         <h2 id="faq" className="font-display text-2xl font-bold tracking-tight">Questions</h2>
//         <div className="mt-6 divide-y divide-line border-y border-line">
//           {FAQ.map((f) => (
//             <details key={f.q} className="group py-4">
//               <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
//                 {f.q}
//                 <span aria-hidden="true" className="text-muted transition-transform group-open:rotate-45">+</span>
//               </summary>
//               <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
//             </details>
//           ))}
//         </div>
//       </section>
//     </>
//   );
// }


import { Fragment } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import JsonLd from '@/components/JsonLd';
import HeroBackdrop from '@/components/home/HeroBackdrop';
import AuthRailLink from '@/components/home/AuthRailLink';
import { Book, Chat, ChevronRight, Grid, Tag, Users } from '@/components/icons';
import { getTotalProblemCount } from '@/lib/problems';
import {
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  X_HANDLE,
  X_URL,
  buildMetadata,
  graph,
  organizationJsonLd,
  websiteJsonLd,
} from '@/lib/seo';

// The home page is cached and the same for everybody: it does not ask who is signed in (the two account links of the
// icon rail decide that in the browser) and the question count is cached for an hour.
export const revalidate = 3600;

export const metadata = buildMetadata({
  absoluteTitle: `${SITE_NAME}: ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  path: '/',
});

const FAQ = [
  {
    q: 'What is Buncho?',
    a: 'Buncho is an interview practice platform for AI, machine learning and generative AI engineers. You answer real interview questions by speaking or typing, then practise again until it comes out clearly.',
  },
  {
    q: 'Which topics and question types are covered?',
    a: 'Topics include machine learning fundamentals, deep learning, generative AI and LLMs, RAG and vector databases, Python for AI and ML, and production AI engineering. Questions range from conceptual and practical exercises to debugging, system design and case studies.',
  },
  {
    q: 'Can I answer out loud instead of typing?',
    a: 'Yes. Use the microphone to dictate your answer, or type it. Explaining a long scenario out loud is closer to a real interview.',
  },
  {
    q: 'Do I get model answers or AI feedback?',
    a: 'No. Buncho gives you real interview questions to practise on. Your answers are private and saved for you to revisit, and there are no model answers or AI scoring.',
  },
  {
    q: 'Is Buncho free?',
    a: 'You can start practicing for free. Create a free account to save answers and track your streak and progress.',
  },
];

// Floating topic chips around the launcher (wide screens only, purely decorative)
const CHIPS = [
  ['RAG', 'bg-accent', 'left-[7%] top-[16%] -rotate-6'],
  ['LLM evaluation', 'bg-[#6b78ff]', 'left-[8%] top-[44%] rotate-3'],
  ['Agents', 'bg-medium', 'left-[9%] top-[72%] -rotate-3'],
  ['System design', 'bg-hard', 'right-[8%] top-[15%] rotate-6'],
  ['Embeddings', 'bg-easy', 'right-[3%] top-[46%] -rotate-3'],
  ['SQL', 'bg-accent', 'right-[10%] top-[74%] rotate-3'],
  ['Python', 'bg-[#6b78ff]', 'left-[24%] top-[88%] rotate-2'],
  ['MLOps', 'bg-medium', 'right-[26%] top-[89%] -rotate-2'],
];

function Chips() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      {CHIPS.map(([label, dot, pos], i) => (
        <span
          key={label}
          style={{ '--d': `${(i * 0.9) % 5}s` }}
          className={`chip-float absolute hidden items-center gap-2 rounded-full border border-line bg-surface/80 px-3.5 py-1.5 text-xs font-semibold text-muted shadow-sm backdrop-blur xl:inline-flex ${pos}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
          {label}
        </span>
      ))}
    </div>
  );
}

// Floating icon rail (wide screens). Sits inside the page instead of being glued to the edge.
function RailLink({ href, label, children }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="group/r relative grid h-11 w-11 place-items-center rounded-xl text-muted transition hover:bg-surface-2 hover:text-ink"
    >
      {children}
      <span className="pointer-events-none absolute left-full z-10 ml-3 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs font-medium text-bg opacity-0 transition-opacity group-hover/r:opacity-100">
        {label}
      </span>
    </Link>
  );
}

// What each card contains, drawn as a tiny preview so the page is not just text and buttons.
const PREVIEW_Q = [
  ['Explain chunking trade-offs in RAG', 'bg-easy'],
  ['Debug a retriever with low recall', 'bg-medium'],
  ['Design an LLM evaluation pipeline', 'bg-hard'],
];
const PREVIEW_R = [['R1', 'bg-easy', 'var(--easy)'], ['R2', 'bg-medium', 'var(--medium)'], ['R3', 'bg-hard', 'var(--hard)'], ['R4', 'bg-easy', 'var(--easy)']];

function QuestionPreview() {
  return (
    <ul aria-hidden="true" className="flex h-[108px] w-full flex-col justify-center gap-2.5 rounded-xl bg-surface-2/70 px-4 text-left text-xs font-medium">
      {PREVIEW_Q.map(([t, dot]) => (
        <li key={t} className="flex items-center gap-2.5">
          <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
          <span className="truncate">{t}</span>
        </li>
      ))}
    </ul>
  );
}

function RoundsPreview() {
  return (
    <div aria-hidden="true" className="flex h-[108px] w-full items-center rounded-xl bg-surface-2/70 px-5">
      {PREVIEW_R.map(([r, c, ring], i) => (
        <Fragment key={r}>
          <span
            style={{ '--ring': ring, '--d': `${i * 0.7}s` }}
            className={`node-ping grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white ${c}`}
          >
            {r}
          </span>
          {i < PREVIEW_R.length - 1 && <span className="mx-1 h-px flex-1 bg-line" />}
        </Fragment>
      ))}
    </div>
  );
}

// Big launcher card. The Start button stretches over the whole card (after:inset-0), so the entire card is clickable.
// Keep the Link un-positioned, otherwise the stretched area would only cover the button.
function LaunchCard({ href, icon, title, subtitle, tone, preview, index }) {
  const t = {
    blue: {
      tile: 'bg-[#4a56e8]/15 text-[#7a86ff]',
      btn: 'bg-[#4a56e8] text-white hover:bg-[#5a66f0]',
      glow: 'hover:shadow-[0_20px_50px_-15px_rgba(74,86,232,0.55)] hover:border-[#4a56e8]/50',
    },
    green: {
      tile: 'bg-accent/15 text-accent',
      btn: 'bg-accent text-accent-ink hover:opacity-90',
      glow: 'hover:shadow-[0_20px_50px_-15px_rgba(52,214,123,0.5)] hover:border-accent/50',
    },
  }[tone];
  return (
    <div
      style={{ '--i': index }}
      className={`rise group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-surface p-6 transition duration-300 hover:-translate-y-1 ${t.glow}`}
    >
      <div className="relative flex flex-col items-center text-center">
        <span className={`grid h-16 w-16 place-items-center rounded-2xl ${t.tile}`}>{icon}</span>
        <h2 className="font-display mt-4 text-xl font-bold">{title}</h2>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      </div>
      <div className="relative mt-5 [@media(max-height:780px)]:hidden">{preview}</div>
      <Link
        href={href}
        className={`mt-5 flex w-full items-center justify-between rounded-xl px-5 py-3.5 text-lg font-bold transition after:absolute after:inset-0 after:z-10 ${t.btn}`}
      >
        Start <ChevronRight width={20} height={20} className="transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

// Shown at the bottom of the launcher. Change the name here.
const CREATOR = { name: 'Ritesh' };

function CreatorCard() {
  const inner = (
    <>
      {/* avatar with a slowly orbiting ring */}
      <span className="relative grid h-11 w-11 shrink-0 place-items-center">
        <span
          aria-hidden="true"
          className="ring-spin absolute inset-0 rounded-full"
          style={{ background: 'conic-gradient(from 0deg, transparent 0 40%, var(--accent) 100%)' }}
        />
        <span className="relative grid h-[38px] w-[38px] place-items-center rounded-full bg-surface font-display text-base font-bold">
          {CREATOR.name.charAt(0)}
        </span>
      </span>

      <span className="min-w-0 text-left leading-tight">
        <span className="block text-sm font-semibold">Built by {CREATOR.name}</span>
        <span className="block truncate text-xs text-muted">
          {X_HANDLE ? `Follow ${X_HANDLE} on X` : 'Creator of Buncho'}
        </span>
      </span>

      {X_URL && (
        <span
          aria-hidden="true"
          className="ml-2 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-2 text-muted transition-colors duration-300 group-hover:bg-ink group-hover:text-bg"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </span>
      )}
    </>
  );

  const cls =
    'rise group mt-5 inline-flex items-center gap-3 rounded-full border border-line bg-surface/80 p-1.5 pr-2 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg hover:shadow-black/10';

  return X_URL ? (
    <a href={X_URL} target="_blank" rel="noopener noreferrer" aria-label={`${CREATOR.name} on X`} style={{ '--i': 6 }} className={cls}>
      {inner}
    </a>
  ) : (
    <div style={{ '--i': 6 }} className={`${cls} pr-5`}>{inner}</div>
  );
}

export default async function LandingPage() {
  let total = 0;
  try {
    total = await getTotalProblemCount(); // every published question: AI + HR + SQL
  } catch {
    // The page should still render if the database is unreachable
  }

  const faqJsonLd = {
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      <JsonLd data={graph(organizationJsonLd(), websiteJsonLd(), faqJsonLd)} />

      <section className="relative isolate flex min-h-[calc(100dvh-4rem)] items-center justify-center overflow-hidden lg:h-[calc(100dvh-4rem)] lg:min-h-[30rem]">
        <HeroBackdrop />
        <Chips />

        {/* Floating icon rail (wide screens) */}
        <nav
          aria-label="Quick links"
          className="absolute left-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-1 rounded-2xl border border-line bg-surface/80 p-1.5 shadow-sm backdrop-blur xl:flex"
        >
          <AuthRailLink signedIn={{ href: '/dashboard', label: 'Dashboard' }} signedOut={{ href: '/register', label: 'Create free account' }}><Grid width={20} height={20} /></AuthRailLink>
          <RailLink href="/interview-experiences" label="Interview experiences"><Chat width={20} height={20} /></RailLink>
          <RailLink href="/pricing" label="Pricing"><Tag width={20} height={20} /></RailLink>
          <span aria-hidden="true" className="mx-2 my-1 h-px bg-line" />
          <AuthRailLink signedIn={{ href: '/settings/profile', label: 'Profile' }} signedOut={{ href: '/login', label: 'Log in' }}><Users width={20} height={20} /></AuthRailLink>
        </nav>

        {/* Launcher */}
        <div className="flex w-full flex-col items-center px-4 py-10">
          <div className="rise relative" style={{ '--i': 0 }}>
            <Logo size="xl" className="scale-[0.8] sm:scale-100" />
          </div>
          <p className="rise font-display mt-5 text-center text-lg font-semibold text-muted sm:text-xl" style={{ '--i': 1 }}>
            A place where AI engineers <span className="text-ink">get interview-ready</span>
          </p>

          <div className="mt-10 grid w-full max-w-[46rem] gap-4 sm:grid-cols-2 [@media(max-height:780px)]:mt-6">
            <LaunchCard
              index={2}
              tone="blue"
              href="/problems"
              title="Practice Problems"
              subtitle="Answer real AI and ML questions"
              icon={<Book width={30} height={30} strokeWidth={1.8} />}
              preview={<QuestionPreview />}
            />
            <LaunchCard
              index={3}
              tone="green"
              href="/interview-experiences"
              title="Interview Experiences"
              subtitle="See what each round really asks"
              icon={<Chat width={30} height={30} strokeWidth={1.8} />}
              preview={<RoundsPreview />}
            />
          </div>

          {total > 0 && (
            <p className="rise mt-8 inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-4 py-1.5 text-sm font-medium text-muted backdrop-blur" style={{ '--i': 5 }}>
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent" aria-hidden="true" />
              {total.toLocaleString('en-IN')} questions to practise
            </p>
          )}

          <CreatorCard />
        </div>
      </section>

      {/* FAQ (kept for search engines and first-time visitors) */}
      <section aria-labelledby="faq" className="mx-auto w-full max-w-2xl px-4 py-16">
        <h2 id="faq" className="font-display text-2xl font-bold tracking-tight">Questions</h2>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden="true" className="text-muted transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}