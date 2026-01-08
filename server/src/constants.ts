export const TPM_PILLARS = [
  'Connect Strategy to Execution',
  'Execute with Rigor',
  'Enable Scale and Velocity',
  'Lead Change',
  'Technical Domain Expertise'
] as const;

export type TPMPillar = typeof TPM_PILLARS[number];

export const IMPACT_CATEGORIES = [
  'Risk Prevented',
  'Decision Accelerated',
  'Launch Unblocked',
  'Time Saved',
  'Process Improved',
  'Change Delivered',
  'Technical Leadership'
] as const;

export type ImpactCategory = typeof IMPACT_CATEGORIES[number];

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

export type QuantificationUnit = typeof QUANTIFICATION_UNITS[number];

// Mapping of categories to typical pillars
export const CATEGORY_PILLAR_MAP: Record<ImpactCategory, TPMPillar[]> = {
  'Risk Prevented': ['Execute with Rigor', 'Technical Domain Expertise'],
  'Decision Accelerated': ['Connect Strategy to Execution', 'Lead Change'],
  'Launch Unblocked': ['Execute with Rigor', 'Enable Scale and Velocity'],
  'Time Saved': ['Enable Scale and Velocity'],
  'Process Improved': ['Enable Scale and Velocity'],
  'Change Delivered': ['Lead Change'],
  'Technical Leadership': ['Technical Domain Expertise', 'Connect Strategy to Execution']
};
