'use client'

import { Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { useReportDetailPanel } from '@/hooks/useReportDetailPanel'
import {
  REPORT_TYPE_LABEL_KEYS,
  REPORT_TYPE_CLASSES,
  REPORT_FORMAT_LABEL_KEYS,
  REPORT_FORMAT_CLASSES,
  REPORT_STATUS_LABEL_KEYS,
  REPORT_STATUS_CLASSES,
} from '@/lib/constants/reports'
import { formatRelativeTime, cn } from '@/lib/utils'
import type { ReportDetailPanelProps } from '@/types'

export function ReportDetailPanel({ report, open, onOpenChange }: ReportDetailPanelProps) {
  const { t, fileSizeDisplay } = useReportDetailPanel({ report })

  if (!report) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{report.name}</SheetTitle>
          <SheetDescription>{report.description ?? t('noDescription')}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">{t('detailType')}:</span>
            <span
              className={cn(
                'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                REPORT_TYPE_CLASSES[report.type]
              )}
            >
              {t(REPORT_TYPE_LABEL_KEYS[report.type])}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">{t('detailFormat')}:</span>
            <span
              className={cn(
                'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                REPORT_FORMAT_CLASSES[report.format]
              )}
            >
              {t(REPORT_FORMAT_LABEL_KEYS[report.format])}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">{t('detailStatus')}:</span>
            <span
              className={cn(
                'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                REPORT_STATUS_CLASSES[report.status]
              )}
            >
              {t(REPORT_STATUS_LABEL_KEYS[report.status])}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-xs">{t('detailGeneratedBy')}</p>
              <p className="text-foreground text-sm font-medium">{report.generatedByName ?? '-'}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-xs">{t('detailFileSize')}</p>
              <p className="text-foreground text-sm font-medium">{fileSizeDisplay}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">{t('detailCreated')}:</span>
            <Badge variant="outline">{formatRelativeTime(report.createdAt)}</Badge>
          </div>

          {report.completedAt && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">{t('detailCompleted')}:</span>
              <Badge variant="outline">{formatRelativeTime(report.completedAt)}</Badge>
            </div>
          )}

          {report.fileUrl && (
            <div className="border-border border-t pt-4">
              <Button asChild variant="outline" className="w-full">
                <a href={report.fileUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="me-2 h-4 w-4" />
                  {t('downloadButton')}
                </a>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
