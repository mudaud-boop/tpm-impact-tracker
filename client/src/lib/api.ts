import { supabase, dbToImpact, impactToDb } from './supabase';
import type { Impact, Stats, ClassificationResult, SummaryResponse } from '@/types';

// Impact CRUD
export async function getImpacts(filters?: {
  startDate?: string;
  endDate?: string;
  pillar?: string;
  category?: string;
}): Promise<Impact[]> {
  let query = supabase
    .from('impacts')
    .select('*')
    .order('date', { ascending: false });

  if (filters?.startDate) {
    query = query.gte('date', filters.startDate);
  }
  if (filters?.endDate) {
    query = query.lte('date', filters.endDate);
  }
  if (filters?.category) {
    query = query.eq('impact_category', filters.category);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  let impacts = (data || []).map(dbToImpact);

  // Filter by pillar in JS since it's an array
  if (filters?.pillar) {
    impacts = impacts.filter((impact) =>
      impact.pillars.includes(filters.pillar as any)
    );
  }

  return impacts;
}

export async function getImpact(id: string): Promise<Impact> {
  const { data, error } = await supabase
    .from('impacts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return dbToImpact(data);
}

export async function createImpact(impact: Partial<Impact>): Promise<Impact> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const dbData = impactToDb(impact, user.id);

  const { data, error } = await supabase
    .from('impacts')
    .insert(dbData)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return dbToImpact(data);
}

export async function updateImpact(id: string, impact: Partial<Impact>): Promise<Impact> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const dbData = impactToDb(impact, user.id);
  delete (dbData as any).user_id; // Don't update user_id

  const { data, error } = await supabase
    .from('impacts')
    .update(dbData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return dbToImpact(data);
}

export async function deleteImpact(id: string): Promise<void> {
  const { error } = await supabase
    .from('impacts')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

// Stats
export async function getStats(filters?: {
  startDate?: string;
  endDate?: string;
}): Promise<Stats> {
  const impacts = await getImpacts(filters);

  const byPillar: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  const quantifiedTotals: Record<string, number> = {};
  const monthlyTrend: Record<string, number> = {};

  impacts.forEach((impact: Impact) => {
    // Count pillars
    impact.pillars.forEach(pillar => {
      byPillar[pillar] = (byPillar[pillar] || 0) + 1;
    });

    // Count categories
    byCategory[impact.impactCategory] = (byCategory[impact.impactCategory] || 0) + 1;

    // Sum quantified values
    if (impact.quantifiedValue && impact.quantifiedUnit) {
      quantifiedTotals[impact.quantifiedUnit] =
        (quantifiedTotals[impact.quantifiedUnit] || 0) + impact.quantifiedValue;
    }

    // Monthly trend
    const month = impact.date.substring(0, 7); // YYYY-MM
    monthlyTrend[month] = (monthlyTrend[month] || 0) + 1;
  });

  // Calculate pillar coverage (percentage)
  const allPillars = [
    'Connect Strategy to Execution',
    'Execute with Rigor',
    'Enable Scale and Velocity',
    'Lead Change',
    'Technical Domain Expertise',
    'Domain Expertise',
    'Solve Business Problems'
  ];

  const pillarCoverage: Record<string, number> = {};
  allPillars.forEach(pillar => {
    pillarCoverage[pillar] = byPillar[pillar] || 0;
  });

  return {
    totalImpacts: impacts.length,
    byPillar,
    byCategory,
    quantifiedTotals,
    monthlyTrend,
    pillarCoverage
  };
}

// AI Classification (mock for now - can integrate with Claude API later)
export async function classifyImpact(description: string): Promise<ClassificationResult> {
  // Simple keyword-based classification
  const lowerDesc = description.toLowerCase();

  const pillars: string[] = [];
  let category = 'Process Improved';

  // Detect pillars based on keywords
  if (lowerDesc.includes('strategy') || lowerDesc.includes('roadmap') || lowerDesc.includes('vision') || lowerDesc.includes('okr')) {
    pillars.push('Connect Strategy to Execution');
  }
  if (lowerDesc.includes('deliver') || lowerDesc.includes('launch') || lowerDesc.includes('ship') || lowerDesc.includes('release') || lowerDesc.includes('milestone')) {
    pillars.push('Execute with Rigor');
  }
  if (lowerDesc.includes('automat') || lowerDesc.includes('scale') || lowerDesc.includes('efficien') || lowerDesc.includes('process') || lowerDesc.includes('template')) {
    pillars.push('Enable Scale and Velocity');
  }
  if (lowerDesc.includes('change') || lowerDesc.includes('transform') || lowerDesc.includes('adopt') || lowerDesc.includes('transition')) {
    pillars.push('Lead Change');
  }
  if (lowerDesc.includes('technical') || lowerDesc.includes('architect') || lowerDesc.includes('system') || lowerDesc.includes('infrastructure')) {
    pillars.push('Technical Domain Expertise');
  }

  // Default pillar if none detected
  if (pillars.length === 0) {
    pillars.push('Execute with Rigor');
  }

  // Detect category
  if (lowerDesc.includes('risk') || lowerDesc.includes('prevent') || lowerDesc.includes('avoid')) {
    category = 'Risk Prevented';
  } else if (lowerDesc.includes('decision') || lowerDesc.includes('accelerat') || lowerDesc.includes('unblock')) {
    category = 'Decision Accelerated';
  } else if (lowerDesc.includes('launch') || lowerDesc.includes('ship') || lowerDesc.includes('release')) {
    category = 'Launch Unblocked';
  } else if (lowerDesc.includes('save') || lowerDesc.includes('hour') || lowerDesc.includes('time') || lowerDesc.includes('day')) {
    category = 'Time Saved';
  } else if (lowerDesc.includes('change') || lowerDesc.includes('transform')) {
    category = 'Change Delivered';
  } else if (lowerDesc.includes('technical') || lowerDesc.includes('lead')) {
    category = 'Technical Leadership';
  }

  // Suggest metrics
  const suggestedMetrics: string[] = [];
  if (lowerDesc.includes('hour') || lowerDesc.includes('time')) suggestedMetrics.push('hours');
  if (lowerDesc.includes('day')) suggestedMetrics.push('days');
  if (lowerDesc.includes('team')) suggestedMetrics.push('teams');
  if (lowerDesc.includes('meeting')) suggestedMetrics.push('meetings');

  return {
    category: category as any,
    pillars: pillars as any,
    suggestedMetrics,
    confidence: 0.7
  };
}

// Summary
export async function getSummary(startDate: string, endDate: string): Promise<SummaryResponse> {
  const impacts = await getImpacts({ startDate, endDate });

  const byPillar: Record<string, { title: string; quantifiedValue: number | null; quantifiedUnit: string | null }[]> = {};

  impacts.forEach((impact: Impact) => {
    impact.pillars.forEach(pillar => {
      if (!byPillar[pillar]) {
        byPillar[pillar] = [];
      }
      byPillar[pillar].push({
        title: impact.title,
        quantifiedValue: impact.quantifiedValue,
        quantifiedUnit: impact.quantifiedUnit
      });
    });
  });

  const quantifiedTotals: Record<string, number> = {};
  impacts.forEach((impact: Impact) => {
    if (impact.quantifiedValue && impact.quantifiedUnit) {
      quantifiedTotals[impact.quantifiedUnit] =
        (quantifiedTotals[impact.quantifiedUnit] || 0) + impact.quantifiedValue;
    }
  });

  return {
    period: { start: startDate, end: endDate },
    totalImpacts: impacts.length,
    byPillar,
    quantifiedTotals
  };
}
