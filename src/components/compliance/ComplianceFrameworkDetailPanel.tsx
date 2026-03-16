'use client'

import { LoadingSpinner } from '@/components/common'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { useComplianceDetailPanel } from '@/hooks/useComplianceDetailPanel'
import {
  COMPLIANCE_STANDARD_LABEL_KEYS,
  COMPLIANCE_STANDARD_CLASSES,
} from '@/lib/constants/compliance'
import { formatRelativeTime, cn, lookup } from '@/lib/utils'
import type { ComplianceDetailPanelProps, ComplianceControl } from '@/types'
import { ComplianceControlCard } from './ComplianceControlCard'

export function ComplianceFrameworkDetailPanel({
  framework,
  open,
  onOpenChange,
}: ComplianceDetailPanelProps) {
  const { t, controls, controlsLoading, scoreDisplay, scorePercent } = useComplianceDetailPanel({
    framework,
  })

  if (!framework) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{framework.name}</SheetTitle>
          <SheetDescription>{framework.description ?? t('noDescription')}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">{t('detailStandard')}:</span>
            <span
              className={cn(
                'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                lookup(COMPLIANCE_STANDARD_CLASSES, framework.standard)
              )}
            >
              {t(lookup(COMPLIANCE_STANDARD_LABEL_KEYS, framework.standard))}
            </span>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-muted-foreground text-sm">{t('detailScore')}</span>
              <span className="text-foreground text-lg font-semibold">{scoreDisplay}</span>
            </div>
            <div className="bg-background h-2 w-full overflow-hidden rounded-full">
              <div
                className="bg-status-success h-full rounded-full transition-all"
                style={{ width: `${scorePercent}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-xs">{t('detailTotal')}</p>
              <p className="text-foreground text-lg font-semibold">{framework.totalControls}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-xs">{t('detailPassed')}</p>
              <p className="text-status-success text-lg font-semibold">
                {framework.passedControls}
              </p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-xs">{t('detailFailed')}</p>
              <p className="text-status-error text-lg font-semibold">{framework.failedControls}</p>
            </div>
          </div>

          {framework.lastAssessedAt && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">{t('detailLastAssessed')}:</span>
              <Badge variant="outline">{formatRelativeTime(framework.lastAssessedAt)}</Badge>
            </div>
          )}

          <div className="border-border border-t pt-4">
            <h4 className="text-foreground mb-3 text-sm font-semibold">{t('controlsTitle')}</h4>
            {controlsLoading && <LoadingSpinner />}
            {!controlsLoading && controls.length === 0 && (
              <p className="text-muted-foreground text-sm">{t('noControls')}</p>
            )}
            {!controlsLoading && controls.length > 0 && (
              <div className="space-y-2">
                {controls.map((control: ComplianceControl) => (
                  <ComplianceControlCard key={control.id} control={control} onAssess={() => {}} />
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
