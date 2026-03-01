'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CaseStatus } from '@/enums'
import { cn } from '@/lib/utils'
import type { Case } from '@/types'
import { CaseKanbanCard } from './CaseKanbanCard'

interface CaseKanbanBoardProps {
  cases: Case[]
  onCaseClick?: (caseItem: Case) => void
}

const columnConfig = [
  {
    status: CaseStatus.OPEN,
    labelKey: 'statusOpen',
    dotClass: 'bg-status-info',
    animate: false,
  },
  {
    status: CaseStatus.IN_PROGRESS,
    labelKey: 'statusInProgress',
    dotClass: 'bg-primary',
    animate: true,
  },
  {
    status: CaseStatus.CLOSED,
    labelKey: 'statusClosed',
    dotClass: 'bg-status-success',
    animate: false,
  },
] as const

export function CaseKanbanBoard({ cases, onCaseClick }: CaseKanbanBoardProps) {
  const t = useTranslations('cases')

  const groupedCases = useMemo(() => {
    const groups: Record<CaseStatus, Case[]> = {
      [CaseStatus.OPEN]: [],
      [CaseStatus.IN_PROGRESS]: [],
      [CaseStatus.CLOSED]: [],
    }

    for (const c of cases) {
      const group = groups[c.status]
      if (group) {
        group.push(c)
      }
    }

    return groups
  }, [cases])

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {columnConfig.map(column => {
        const columnCases = groupedCases[column.status] ?? []

        return (
          <div key={column.status} className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <span className="relative flex h-2.5 w-2.5">
                {column.animate && (
                  <span
                    className={cn(
                      'absolute inline-flex h-full w-full animate-pulse rounded-full opacity-75',
                      column.dotClass
                    )}
                  />
                )}
                <span
                  className={cn('relative inline-flex h-2.5 w-2.5 rounded-full', column.dotClass)}
                />
              </span>
              <h3 className="text-sm font-semibold">{t(column.labelKey)}</h3>
              <Badge variant="secondary" className="text-xs">
                {columnCases.length}
              </Badge>
            </div>

            <ScrollArea className="h-[calc(100vh-220px)]">
              <div className="border-border/60 flex flex-col gap-3 rounded-lg border border-dashed p-3">
                {columnCases.length === 0 && (
                  <p className="text-muted-foreground py-8 text-center text-xs">{t('noItems')}</p>
                )}
                {columnCases.map(caseItem => (
                  <CaseKanbanCard key={caseItem.id} caseItem={caseItem} onClick={onCaseClick} />
                ))}
              </div>
            </ScrollArea>
          </div>
        )
      })}
    </div>
  )
}
