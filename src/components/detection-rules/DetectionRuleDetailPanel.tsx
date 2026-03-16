'use client'

import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { useDetectionRuleDetailPanel } from '@/hooks/useDetectionRuleDetailPanel'
import {
  DETECTION_RULE_SEVERITY_CLASSES,
  DETECTION_RULE_SEVERITY_LABEL_KEYS,
  DETECTION_RULE_STATUS_CLASSES,
  DETECTION_RULE_STATUS_LABEL_KEYS,
  DETECTION_RULE_TYPE_LABEL_KEYS,
} from '@/lib/constants/detection-rules'
import { cn, formatTimestamp, lookup } from '@/lib/utils'
import type { DetectionRuleDetailPanelProps } from '@/types'

export function DetectionRuleDetailPanel({
  rule,
  open,
  onOpenChange,
}: DetectionRuleDetailPanelProps) {
  const { t, tCommon, hasData } = useDetectionRuleDetailPanel({ rule })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{t('detailTitle')}</SheetTitle>
          <SheetDescription>{t('detailDescription')}</SheetDescription>
        </SheetHeader>

        {hasData && rule && (
          <div className="mt-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">{t('fieldRuleName')}</span>
                <span className="text-foreground text-sm font-medium">{rule.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">{t('fieldRuleType')}</span>
                <Badge variant="secondary">
                  {t(lookup(DETECTION_RULE_TYPE_LABEL_KEYS, rule.ruleType))}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">{tCommon('severity')}</span>
                <span
                  className={cn(
                    'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                    lookup(DETECTION_RULE_SEVERITY_CLASSES, rule.severity)
                  )}
                >
                  {t(lookup(DETECTION_RULE_SEVERITY_LABEL_KEYS, rule.severity))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">{tCommon('status')}</span>
                <span
                  className={cn(
                    'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                    lookup(DETECTION_RULE_STATUS_CLASSES, rule.status)
                  )}
                >
                  {t(lookup(DETECTION_RULE_STATUS_LABEL_KEYS, rule.status))}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">{t('columnMatches')}</span>
                <span className="text-foreground text-sm font-medium">
                  {rule.matchCount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">{t('fpRate')}</span>
                <span className="text-foreground text-sm font-medium">
                  {`${rule.falsePositiveRate.toFixed(1)}%`}
                </span>
              </div>
              {rule.description && (
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm">{tCommon('description')}</span>
                  <p className="bg-muted text-foreground rounded-md p-2 text-sm">
                    {rule.description}
                  </p>
                </div>
              )}
              {rule.mitreTactics.length > 0 && (
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm">{t('mitreTactics')}</span>
                  <div className="flex flex-wrap gap-1">
                    {rule.mitreTactics.map(tactic => (
                      <Badge key={tactic} variant="outline">
                        {tactic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {rule.mitreTechniques.length > 0 && (
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm">{t('mitreTechniques')}</span>
                  <div className="flex flex-wrap gap-1">
                    {rule.mitreTechniques.map(technique => (
                      <Badge key={technique} variant="outline">
                        {technique}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {rule.lastTriggeredAt && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">{t('lastTriggered')}</span>
                  <span className="text-foreground text-sm">
                    {formatTimestamp(rule.lastTriggeredAt)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">{t('createdAt')}</span>
                <span className="text-foreground text-sm">{formatTimestamp(rule.createdAt)}</span>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
