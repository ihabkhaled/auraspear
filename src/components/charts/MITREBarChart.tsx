'use client'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts'
import { useMITREBarChart } from '@/hooks/useMITREBarChart'
import type { MITRETechnique } from '@/types'

interface MITREBarChartProps {
  data: MITRETechnique[]
}

export function MITREBarChart({ data }: MITREBarChartProps) {
  const { isNarrow, handleResize, yAxisWidth, leftMargin } = useMITREBarChart()

  return (
    <ResponsiveContainer width="100%" height={300} onResize={handleResize}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 10, left: leftMargin, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
        <XAxis
          type="number"
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          stroke="var(--muted-foreground)"
          fontSize={isNarrow ? 9 : 11}
          tickLine={false}
          axisLine={false}
          width={yAxisWidth}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--foreground)',
            fontSize: '12px',
          }}
          formatter={(value: number | undefined) => [value ?? 0, 'Count']}
          labelFormatter={label => label}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={24}>
          {data.map(entry => (
            <Cell key={entry.id} fill="var(--primary)" fillOpacity={0.8} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
