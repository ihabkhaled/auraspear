'use client'

import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { useNormalizationDetailPanel } from '@/hooks/useNormalizationDetailPanel'
import {
  NORMALIZATION_PIPELINE_STATUS_CLASSES,
  NORMALIZATION_PIPELINE_STATUS_LABEL_KEYS,
  NORMALIZATION_SOURCE_TYPE_LABEL_KEYS,
} from '@/lib/constants/normalization'
import { cn, formatTimestamp, lookup } from '@/lib/utils'
import type { NormalizationDetailPanelProps } from '@/types'

export function NormalizationDetailPanel({
  pipeline,
  open,
  onOpenChange,
}: NormalizationDetailPanelProps) {
  const { t, tCommon, hasData } = useNormalizationDetailPanel({ pipeline })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{t('detailTitle')}</SheetTitle>
          <SheetDescription>{t('detailDescription')}</SheetDescription>
        </SheetHeader>

        {hasData && pipeline && (
          <div className="mt-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">{t('fieldPipelineName')}</span>
                <span className="text-foreground text-sm font-medium">{pipeline.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">{t('fieldSourceType')}</span>
                <Badge variant="secondary">
                  {t(lookup(NORMALIZATION_SOURCE_TYPE_LABEL_KEYS, pipeline.sourceType))}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">{tCommon('status')}</span>
                <span
                  className={cn(
                    'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                    lookup(NORMALIZATION_PIPELINE_STATUS_CLASSES, pipeline.status)
                  )}
                >
                  {t(lookup(NORMALIZATION_PIPELINE_STATUS_LABEL_KEYS, pipeline.status))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">{t('columnEventsProcessed')}</span>
                <span className="text-foreground text-sm font-medium">
                  {pipeline.eventsProcessed.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">{t('columnErrorRate')}</span>
                <span className="text-foreground text-sm font-medium">
                  {`${pipeline.errorRate.toFixed(1)}%`}
                </span>
              </div>
              {pipeline.description && (
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm">{tCommon('description')}</span>
                  <p className="bg-muted text-foreground rounded-md p-2 text-sm">
                    {pipeline.description}
                  </p>
                </div>
              )}
              {pipeline.lastRunAt && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">{t('lastRun')}</span>
                  <span className="text-foreground text-sm">
                    {formatTimestamp(pipeline.lastRunAt)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">{t('createdAt')}</span>
                <span className="text-foreground text-sm">
                  {formatTimestamp(pipeline.createdAt)}
                </span>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
