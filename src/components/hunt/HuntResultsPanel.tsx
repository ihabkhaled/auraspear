'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { HuntStatus } from '@/enums'
import type { HuntEvent } from '@/types'
import { HuntStatusBar } from './HuntStatusBar'
import { HuntStatsGrid } from './HuntStatsGrid'
import { HuntEventTable } from './HuntEventTable'

interface HuntResultsPanelProps {
  sessionId: string
  status: HuntStatus
  eventsFound: number
  uniqueIps: number
  threatScore: number
  events: HuntEvent[]
  loading?: boolean
}

export function HuntResultsPanel({
  sessionId,
  status,
  eventsFound,
  uniqueIps,
  threatScore,
  events,
  loading = false,
}: HuntResultsPanelProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <HuntStatusBar sessionId={sessionId} status={status} />
      <ScrollArea className="flex-1 min-h-0">
        <div className="space-y-4 p-4">
          <HuntStatsGrid
            eventsFound={eventsFound}
            uniqueIps={uniqueIps}
            threatScore={threatScore}
          />
          <HuntEventTable events={events} loading={loading} />
        </div>
      </ScrollArea>
    </div>
  )
}
