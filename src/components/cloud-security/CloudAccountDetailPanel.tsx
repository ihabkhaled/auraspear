'use client'

import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { useCloudAccountDetailPanel } from '@/hooks/useCloudAccountDetailPanel'
import {
  CLOUD_ACCOUNT_STATUS_CLASSES,
  CLOUD_ACCOUNT_STATUS_LABEL_KEYS,
  CLOUD_FINDING_SEVERITY_CLASSES,
  CLOUD_FINDING_SEVERITY_LABEL_KEYS,
  CLOUD_FINDING_STATUS_CLASSES,
  CLOUD_FINDING_STATUS_LABEL_KEYS,
  CLOUD_PROVIDER_LABEL_KEYS,
} from '@/lib/constants/cloud-security'
import { cn, formatTimestamp, lookup } from '@/lib/utils'
import type { CloudAccountDetailPanelProps } from '@/types'

export function CloudAccountDetailPanel({
  account,
  findings,
  open,
  onOpenChange,
}: CloudAccountDetailPanelProps) {
  const { t, tCommon, hasData } = useCloudAccountDetailPanel({ account })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{t('accountDetailTitle')}</SheetTitle>
          <SheetDescription>{t('accountDetailDescription')}</SheetDescription>
        </SheetHeader>

        {hasData && account && (
          <div className="mt-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">{t('fieldAlias')}</span>
                <span className="text-foreground text-sm font-medium">{account.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">{t('fieldProvider')}</span>
                <Badge variant="secondary">
                  {t(lookup(CLOUD_PROVIDER_LABEL_KEYS, account.provider))}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">{t('fieldAccountId')}</span>
                <span className="text-foreground font-mono text-sm">{account.accountId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">{tCommon('status')}</span>
                <span
                  className={cn(
                    'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                    lookup(CLOUD_ACCOUNT_STATUS_CLASSES, account.status)
                  )}
                >
                  {t(lookup(CLOUD_ACCOUNT_STATUS_LABEL_KEYS, account.status))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">{t('columnFindings')}</span>
                <span className="text-foreground text-sm font-medium">{account.totalFindings}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">{t('columnCritical')}</span>
                <span className="text-severity-critical text-sm font-medium">
                  {account.criticalFindings}
                </span>
              </div>
              {account.regionsMonitored.length > 0 && (
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm">{t('regions')}</span>
                  <div className="flex flex-wrap gap-1">
                    {account.regionsMonitored.map(region => (
                      <Badge key={region} variant="outline">
                        {region}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {account.lastScanAt && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">{t('columnLastScan')}</span>
                  <span className="text-foreground text-sm">
                    {formatTimestamp(account.lastScanAt)}
                  </span>
                </div>
              )}
            </div>

            {findings.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-foreground text-sm font-semibold">{t('findingsTitle')}</h3>
                <div className="space-y-2">
                  {findings.map(finding => (
                    <div key={finding.id} className="bg-muted space-y-2 rounded-md p-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-foreground text-sm font-medium">{finding.title}</span>
                        <span
                          className={cn(
                            'inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
                            lookup(CLOUD_FINDING_SEVERITY_CLASSES, finding.severity)
                          )}
                        >
                          {t(lookup(CLOUD_FINDING_SEVERITY_LABEL_KEYS, finding.severity))}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-xs">{finding.resource}</span>
                        <span
                          className={cn(
                            'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                            lookup(CLOUD_FINDING_STATUS_CLASSES, finding.status)
                          )}
                        >
                          {t(lookup(CLOUD_FINDING_STATUS_LABEL_KEYS, finding.status))}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
