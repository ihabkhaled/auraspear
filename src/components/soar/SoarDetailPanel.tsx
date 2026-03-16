'use client'

import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { useSoarDetailPanel } from '@/hooks/useSoarDetailPanel'
import {
  SOAR_PLAYBOOK_STATUS_LABEL_KEYS,
  SOAR_PLAYBOOK_STATUS_CLASSES,
  SOAR_TRIGGER_TYPE_LABEL_KEYS,
  SOAR_TRIGGER_TYPE_CLASSES,
} from '@/lib/constants/soar'
import { formatRelativeTime, cn, lookup } from '@/lib/utils'
import type { SoarDetailPanelProps } from '@/types'
import { SoarExecutionHistory } from './SoarExecutionHistory'

export function SoarDetailPanel({ playbook, open, onOpenChange }: SoarDetailPanelProps) {
  const { t, avgDurationDisplay } = useSoarDetailPanel({ playbook })

  if (!playbook) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{playbook.name}</SheetTitle>
          <SheetDescription>{playbook.description ?? t('noDescription')}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">{t('detailStatus')}:</span>
            <span
              className={cn(
                'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                lookup(SOAR_PLAYBOOK_STATUS_CLASSES, playbook.status)
              )}
            >
              {t(lookup(SOAR_PLAYBOOK_STATUS_LABEL_KEYS, playbook.status))}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">{t('detailTrigger')}:</span>
            <span
              className={cn(
                'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                lookup(SOAR_TRIGGER_TYPE_CLASSES, playbook.triggerType)
              )}
            >
              {t(lookup(SOAR_TRIGGER_TYPE_LABEL_KEYS, playbook.triggerType))}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-xs">{t('detailSteps')}</p>
              <p className="text-foreground text-lg font-semibold">{playbook.stepsCount}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-xs">{t('detailExecutions')}</p>
              <p className="text-foreground text-lg font-semibold">{playbook.executionCount}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-xs">{t('detailAvgDuration')}</p>
              <p className="text-foreground text-lg font-semibold">{avgDurationDisplay}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-xs">{t('detailCreatedBy')}</p>
              <p className="text-foreground text-sm font-medium">{playbook.createdByName ?? '-'}</p>
            </div>
          </div>

          {playbook.lastExecutedAt && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">{t('detailLastExecuted')}:</span>
              <Badge variant="outline">{formatRelativeTime(playbook.lastExecutedAt)}</Badge>
            </div>
          )}

          <div className="border-border border-t pt-4">
            <h4 className="text-foreground mb-3 text-sm font-semibold">{t('executionHistory')}</h4>
            <SoarExecutionHistory playbookId={playbook.id} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
