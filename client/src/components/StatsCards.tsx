import { Target, TrendingUp, CheckCircle, Layers } from 'lucide-react';
import type { Stats } from '@/types';

interface StatsCardsProps {
  stats: Stats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const topCategory = Object.entries(stats.byCategory)
    .sort((a, b) => b[1] - a[1])[0];

  const topPillar = Object.entries(stats.byPillar)
    .sort((a, b) => b[1] - a[1])[0];

  const cards = [
    {
      label: 'Total Impacts',
      value: stats.totalImpacts,
      icon: Target,
      color: 'text-primary-500',
      bgColor: 'bg-primary-50'
    },
    {
      label: 'Categories Covered',
      value: Object.values(stats.byCategory).filter(v => v > 0).length,
      subtext: topCategory ? `Top: ${topCategory[0]}` : undefined,
      icon: Layers,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Pillars Covered',
      value: Object.values(stats.byPillar).filter(v => v > 0).length,
      subtext: topPillar ? `Top: ${topPillar[0].split(' ').slice(0, 2).join(' ')}` : undefined,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Quantified Metrics',
      value: Object.keys(stats.quantifiedTotals).length,
      subtext: Object.entries(stats.quantifiedTotals)[0]
        ? `${Object.entries(stats.quantifiedTotals)[0][1]} ${Object.entries(stats.quantifiedTotals)[0][0]}`
        : undefined,
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, subtext, icon: Icon, color, bgColor }) => (
        <div key={label} className="card p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
              {subtext && (
                <p className="text-xs text-gray-400 mt-1 truncate">{subtext}</p>
              )}
            </div>
            <div className={`p-2 rounded-lg ${bgColor}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
