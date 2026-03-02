'use client'

import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'
import { getSeverityColor } from '@/lib/severity-utils'
import type { SeverityDataPoint } from '@/types'

interface SeverityDistributionChartProps {
  data: SeverityDataPoint[]
}

export function SeverityDistributionChart({ data }: SeverityDistributionChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          strokeWidth={0}
        >
          {data.map(entry => (
            <Cell key={entry.name} fill={getSeverityColor(entry.severity)} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--foreground)',
            fontSize: '12px',
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: '12px' }}
          formatter={(value: string) => <span style={{ color: 'var(--foreground)' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
