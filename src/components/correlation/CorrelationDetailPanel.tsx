'use client'

import { Edit, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { useCorrelationDetailPanel } from '@/hooks/useCorrelationDetailPanel'
import {
  RULE_SOURCE_LABEL_KEYS,
  RULE_SOURCE_CLASSES,
  RULE_SEVERITY_LABEL_KEYS,
  RULE_SEVERITY_CLASSES,
  RULE_STATUS_LABEL_KEYS,
  RULE_STATUS_CLASSES,
} from '@/lib/constants/correlation'
import { lookup } from '@/lib/utils'
import type { CorrelationDetailPanelProps } from '@/types'

export function CorrelationDetailPanel({
  rule,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: CorrelationDetailPanelProps) {
  const {
    t,
    formattedCreatedAt,
    formattedUpdatedAt,
    formattedLastFiredAt,
    handleEdit,
    handleDelete,
  } = useCorrelationDetailPanel({ rule, open, onOpenChange, onEdit, onDelete })

  if (!rule) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{t('detailTitle')}</SheetTitle>
          <SheetDescription>{rule.ruleNumber}</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="me-1 h-3.5 w-3.5" />
              {t('edit')}
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="me-1 h-3.5 w-3.5" />
              {t('delete')}
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <p className="text-muted-foreground text-xs font-medium">{t('fieldTitle')}</p>
              <p className="text-sm font-medium">{rule.title}</p>
            </div>

            <div>
              <p className="text-muted-foreground text-xs font-medium">{t('fieldDescription')}</p>
              <p className="text-sm">{rule.description ?? '-'}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-muted-foreground text-xs font-medium">{t('fieldSource')}</p>
                <span
                  className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${lookup(RULE_SOURCE_CLASSES, rule.source) ?? ''}`}
                >
                  {t(lookup(RULE_SOURCE_LABEL_KEYS, rule.source) as 'sourceSigma')}
                </span>
              </div>

              <div>
                <p className="text-muted-foreground text-xs font-medium">{t('fieldSeverity')}</p>
                <span
                  className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${lookup(RULE_SEVERITY_CLASSES, rule.severity) ?? ''}`}
                >
                  {t(lookup(RULE_SEVERITY_LABEL_KEYS, rule.severity) as 'severityCritical')}
                </span>
              </div>

              <div>
                <p className="text-muted-foreground text-xs font-medium">{t('fieldStatus')}</p>
                <span
                  className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${lookup(RULE_STATUS_CLASSES, rule.status) ?? ''}`}
                >
                  {t(lookup(RULE_STATUS_LABEL_KEYS, rule.status) as 'statusActive')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-xs font-medium">{t('detailHitCount')}</p>
                <p className="text-sm font-medium">{rule.hitCount}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium">
                  {t('detailLinkedIncidents')}
                </p>
                <p className="text-sm font-medium">{rule.linkedIncidents}</p>
              </div>
            </div>

            {rule.mitreTechniques.length > 0 && (
              <div>
                <p className="text-muted-foreground mb-1 text-xs font-medium">
                  {t('fieldMitreTechniques')}
                </p>
                <div className="flex flex-wrap gap-1">
                  {rule.mitreTechniques.map(technique => (
                    <Badge key={technique} variant="outline" className="font-mono text-xs">
                      {technique}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {rule.mitreTactics.length > 0 && (
              <div>
                <p className="text-muted-foreground mb-1 text-xs font-medium">
                  {t('detailMitreTactics')}
                </p>
                <div className="flex flex-wrap gap-1">
                  {rule.mitreTactics.map(tactic => (
                    <Badge key={tactic} variant="secondary" className="text-xs">
                      {tactic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-xs font-medium">{t('detailCreatedBy')}</p>
                <p className="text-sm">{rule.createdByName ?? rule.createdBy}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium">{t('detailTenant')}</p>
                <p className="text-sm">{rule.tenantName}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-muted-foreground text-xs font-medium">{t('detailCreatedAt')}</p>
                <p className="text-sm">{formattedCreatedAt}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium">{t('detailUpdatedAt')}</p>
                <p className="text-sm">{formattedUpdatedAt}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium">{t('detailLastFired')}</p>
                <p className="text-sm">{formattedLastFiredAt}</p>
              </div>
            </div>

            {rule.yamlContent && (
              <div>
                <p className="text-muted-foreground mb-1 text-xs font-medium">
                  {t('fieldYamlContent')}
                </p>
                <pre className="bg-muted overflow-x-auto rounded-lg p-4 font-mono text-xs">
                  <code>{rule.yamlContent}</code>
                </pre>
              </div>
            )}

            {rule.conditions && (
              <div>
                <p className="text-muted-foreground mb-1 text-xs font-medium">
                  {t('detailConditions')}
                </p>
                <pre className="bg-muted overflow-x-auto rounded-lg p-4 font-mono text-xs">
                  <code>{JSON.stringify(rule.conditions, null, 2)}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
