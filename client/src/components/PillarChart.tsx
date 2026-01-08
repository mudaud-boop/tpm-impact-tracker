import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PILLAR_COLORS } from '@/lib/utils';
import { TPM_PILLARS } from '@/types';

interface PillarChartProps {
  data: Record<string, number>;
}

export function PillarChart({ data }: PillarChartProps) {
  const chartData = TPM_PILLARS.map(pillar => ({
    name: pillar.split(' ').slice(0, 2).join(' '), // Shorten for display
    fullName: pillar,
    value: data[pillar] || 0,
    color: PILLAR_COLORS[pillar]
  }));

  const hasData = chartData.some(d => d.value > 0);

  if (!hasData) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No data yet. Start adding impacts!
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ left: 80, right: 20 }}>
          <XAxis type="number" />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12 }}
            width={80}
          />
          <Tooltip
            formatter={(value: number, _name: string, props: any) => [
              value,
              props.payload.fullName
            ]}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
