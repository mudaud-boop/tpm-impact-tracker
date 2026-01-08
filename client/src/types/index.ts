export type JobFamily = 'TPM' | 'PgM' | 'PjM' | 'BizOps';

export interface Impact {
  id: string;
  title: string;
  description: string;
  jobFamily: JobFamily;
  impactCategory: ImpactCategory;
  pillars: CraftSkillName[];  // renamed from pillars but keeping for backward compat
  quantifiedValue: number | null;
  quantifiedUnit: string | null;
  date: string;
  programTags: string[];
  stakeholders: string[];
  evidenceLinks: string[];
  source: string;
  createdAt: string;
  updatedAt: string;
}

// Shared craft skills (all job families)
export type SharedCraftSkill =
  | 'Connect Strategy to Execution'
  | 'Execute with Rigor'
  | 'Enable Scale and Velocity'
  | 'Lead Change';

// Job-family specific craft skills
export type TPMSpecificSkill = 'Technical Domain Expertise';
export type PgMSpecificSkill = 'Domain Expertise';
export type BizOpsSpecificSkill = 'Solve Business Problems';

export type CraftSkillName =
  | SharedCraftSkill
  | TPMSpecificSkill
  | PgMSpecificSkill
  | BizOpsSpecificSkill;

// Legacy alias for backward compatibility
export type TPMPillar = CraftSkillName;

export type ImpactCategory =
  | 'Risk Prevented'
  | 'Decision Accelerated'
  | 'Launch Unblocked'
  | 'Time Saved'
  | 'Process Improved'
  | 'Change Delivered'
  | 'Technical Leadership';

export const SHARED_CRAFT_SKILLS: SharedCraftSkill[] = [
  'Connect Strategy to Execution',
  'Execute with Rigor',
  'Enable Scale and Velocity',
  'Lead Change'
];

export const JOB_SPECIFIC_SKILLS: Record<JobFamily, CraftSkillName> = {
  TPM: 'Technical Domain Expertise',
  PgM: 'Domain Expertise',
  PjM: 'Domain Expertise',
  BizOps: 'Solve Business Problems'
};

// Get all craft skills for a job family
export function getCraftSkillsForJobFamily(jobFamily: JobFamily): CraftSkillName[] {
  return [...SHARED_CRAFT_SKILLS, JOB_SPECIFIC_SKILLS[jobFamily]];
}

// Legacy alias
export const TPM_PILLARS: CraftSkillName[] = getCraftSkillsForJobFamily('TPM');

export const JOB_FAMILIES: { value: JobFamily; label: string }[] = [
  { value: 'TPM', label: 'Technical Program Manager' },
  { value: 'PgM', label: 'Program Manager' },
  { value: 'PjM', label: 'Project Manager' },
  { value: 'BizOps', label: 'Business Operations' }
];

export const IMPACT_CATEGORIES: ImpactCategory[] = [
  'Risk Prevented',
  'Decision Accelerated',
  'Launch Unblocked',
  'Time Saved',
  'Process Improved',
  'Change Delivered',
  'Technical Leadership'
];

export const QUANTIFICATION_UNITS = [
  'days',
  'hours',
  'weeks',
  'dollars',
  'percent',
  'teams',
  'people',
  'incidents',
  'meetings'
] as const;

export interface Stats {
  totalImpacts: number;
  byPillar: Record<string, number>;
  byCategory: Record<string, number>;
  quantifiedTotals: Record<string, number>;
  monthlyTrend: Record<string, number>;
  pillarCoverage: Record<string, number>;
}

export interface ClassificationResult {
  category: ImpactCategory;
  pillars: CraftSkillName[];
  suggestedMetrics: string[];
  confidence: number;
}

export interface SummaryResponse {
  period: { start: string; end: string };
  totalImpacts: number;
  byPillar: Record<string, { title: string; quantifiedValue: number | null; quantifiedUnit: string | null }[]>;
  quantifiedTotals: Record<string, number>;
}
