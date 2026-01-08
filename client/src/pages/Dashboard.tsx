import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, Target, Calendar, Briefcase } from 'lucide-react';
import { getImpacts, getStats } from '@/lib/api';
import { ImpactCard } from '@/components/ImpactCard';
import { PillarChart } from '@/components/PillarChart';
import { StatsCards } from '@/components/StatsCards';
import { DateFilter } from '@/components/DateFilter';
import { cn, JOB_FAMILY_COLORS } from '@/lib/utils';
import type { Impact, Stats, JobFamily } from '@/types';

type JobFamilyFilter = JobFamily | 'all';

export function Dashboard() {
  const [impacts, setImpacts] = useState<Impact[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});
  const [jobFamilyFilter, setJobFamilyFilter] = useState<JobFamilyFilter>('all');

  useEffect(() => {
    loadData();
  }, [dateRange]);

  async function loadData() {
    setLoading(true);
    try {
      const [impactsData, statsData] = await Promise.all([
        getImpacts({ startDate: dateRange.start, endDate: dateRange.end }),
        getStats({ startDate: dateRange.start, endDate: dateRange.end })
      ]);
      setImpacts(impactsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  // Filter impacts by job family
  const filteredImpacts = useMemo(() => {
    if (jobFamilyFilter === 'all') return impacts;
    return impacts.filter(impact => impact.jobFamily === jobFamilyFilter);
  }, [impacts, jobFamilyFilter]);

  // Recalculate stats for filtered impacts
  const filteredStats = useMemo(() => {
    if (!stats) return null;
    if (jobFamilyFilter === 'all') return stats;

    // Recalculate stats based on filtered impacts
    const byPillar: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    const quantifiedTotals: Record<string, number> = {};

    filteredImpacts.forEach(impact => {
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
    });

    return {
      ...stats,
      totalImpacts: filteredImpacts.length,
      byPillar,
      byCategory,
      quantifiedTotals
    };
  }, [stats, filteredImpacts, jobFamilyFilter]);

  function handleDelete() {
    loadData();
  }

  const jobFamilies: { value: JobFamilyFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'TPM', label: 'TPM' },
    { value: 'PgM', label: 'PgM' },
    { value: 'PjM', label: 'PjM' },
    { value: 'BizOps', label: 'BizOps' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Track and quantify your TPM, PgM, PjM, or BizOps impact</p>
        </div>
        <Link
          to="/new"
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Impact
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <DateFilter onChange={setDateRange} />

        {/* Job Family Filter */}
        <div className="card p-4 sm:w-auto">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Job Family</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {jobFamilies.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setJobFamilyFilter(value)}
                className={cn(
                  'px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1.5',
                  jobFamilyFilter === value
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {value !== 'all' && (
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: jobFamilyFilter === value ? 'white' : JOB_FAMILY_COLORS[value] }}
                  />
                )}
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {filteredStats && <StatsCards stats={filteredStats} />}

      {/* Charts Row */}
      {filteredStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary-500" />
              Intuit Craft Skill Coverage
            </h3>
            <PillarChart data={filteredStats.byPillar} />
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Quantified Impact
            </h3>
            <div className="space-y-3">
              {Object.entries(filteredStats.quantifiedTotals).length > 0 ? (
                Object.entries(filteredStats.quantifiedTotals).map(([unit, total]) => (
                  <div key={unit} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 capitalize">{unit}</span>
                    <span className="text-2xl font-semibold text-gray-900">{total}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No quantified impacts yet. Add metrics to your impacts!
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Impact List */}
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary-500" />
          Recent Impacts
          {jobFamilyFilter !== 'all' && (
            <span className="text-sm font-normal text-gray-500">
              ({filteredImpacts.length} {jobFamilyFilter} impact{filteredImpacts.length !== 1 ? 's' : ''})
            </span>
          )}
        </h3>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : filteredImpacts.length === 0 ? (
          <div className="card p-12 text-center">
            <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {jobFamilyFilter === 'all' ? 'No impacts yet' : `No ${jobFamilyFilter} impacts`}
            </h3>
            <p className="text-gray-500 mb-4">
              {jobFamilyFilter === 'all'
                ? 'Start capturing your contributions'
                : `No impacts found for ${jobFamilyFilter}. Try a different filter or add a new impact.`}
            </p>
            <Link to="/new" className="btn btn-primary inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Impact
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredImpacts.map(impact => (
              <ImpactCard key={impact.id} impact={impact} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
