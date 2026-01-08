import { createClient } from '@supabase/supabase-js';
import type { JobFamily, ImpactCategory, CraftSkillName, Impact } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Database types
export interface DbImpact {
  id: string;
  user_id: string;
  title: string;
  description: string;
  job_family: string;
  impact_category: string;
  pillars: string[];
  quantified_value: number | null;
  quantified_unit: string | null;
  date: string;
  program_tags: string[];
  stakeholders: string[];
  evidence_links: string[];
  source: string;
  created_at: string;
  updated_at: string;
}

// Convert database record to app format
export function dbToImpact(db: DbImpact): Impact {
  return {
    id: db.id,
    title: db.title,
    description: db.description,
    jobFamily: db.job_family as JobFamily,
    impactCategory: db.impact_category as ImpactCategory,
    pillars: db.pillars as CraftSkillName[],
    quantifiedValue: db.quantified_value,
    quantifiedUnit: db.quantified_unit,
    date: db.date,
    programTags: db.program_tags,
    stakeholders: db.stakeholders,
    evidenceLinks: db.evidence_links,
    source: db.source,
    createdAt: db.created_at,
    updatedAt: db.updated_at
  };
}

// Convert app format to database record
export function impactToDb(impact: any, userId: string): Partial<DbImpact> {
  return {
    user_id: userId,
    title: impact.title,
    description: impact.description,
    job_family: impact.jobFamily || 'TPM',
    impact_category: impact.impactCategory,
    pillars: impact.pillars,
    quantified_value: impact.quantifiedValue || null,
    quantified_unit: impact.quantifiedUnit || null,
    date: impact.date,
    program_tags: impact.programTags || [],
    stakeholders: impact.stakeholders || [],
    evidence_links: impact.evidenceLinks || [],
    source: impact.source || 'web'
  };
}
