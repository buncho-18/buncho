// Choices and limits shared by the submit form (client) and the server action. No server imports here.

export const LEVELS = ['Full-time', 'Internship'];
export const OUTCOMES = ['Selected', 'Rejected', 'Waitlisted', 'Awaiting Result'];
export const COMPANY_TYPES = ['Product company', 'Startup', 'Service company', 'MNC', 'Other'];
export const ROUND_TYPES = ['Screening', 'Technical', 'System design', 'Coding', 'HR', 'Managerial', 'Other'];
export const ROUND_MODES = ['Online', 'Video call', 'On-site', 'Phone call'];
export const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];

export const LIMITS = {
  company: 80,
  role: 80,
  location: 80,
  background: 100,
  duration: 40,
  summary: { min: 40, max: 1200 },
  roundTitle: 80,
  roundSummary: 600,
  question: { min: 8, max: 600 },
  topic: 40,
  tip: 300,
  maxRounds: 8,
  maxQuestionsPerRound: 12,
  maxTips: 5,
  perDay: 3,
  perHour: 2,
};