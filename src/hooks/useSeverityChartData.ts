import { useMemo } from 'react'
import { getSeverityColor } from '@/lib/severity-utils'
import type { SeverityDataPoint } from '@/types'

interface ColoredDataPoint extends SeverityDataPoint {
  fill: string
}

export function useSeverityChartData(data: SeverityDataPoint[]): ColoredDataPoint[] {
  return useMemo(
    () => data.map(entry => ({ ...entry, fill: getSeverityColor(entry.severity) })),
    [data]
  )
}
