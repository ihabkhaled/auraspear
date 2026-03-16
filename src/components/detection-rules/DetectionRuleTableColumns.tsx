'use client'

import {
  type DetectionRuleSeverity,
  type DetectionRuleStatus,
  type DetectionRuleType,
  SortOrder,
} from '@/enums'
import {
  DETECTION_RULE_SEVERITY_CLASSES,
  DETECTION_RULE_SEVERITY_LABEL_KEYS,
  DETECTION_RULE_STATUS_CLASSES,
  DETECTION_RULE_STATUS_LABEL_KEYS,
  DETECTION_RULE_TYPE_LABEL_KEYS,
} from '@/lib/constants/detection-rules'
import { formatRelativeTime, cn, lookup } from '@/lib/utils'
import type { Column, DetectionRule } from '@/types'

interface DetectionRuleColumnTranslations {
  detectionRules: (key: string) => string
  common: (key: string) => string
}

export function getDetectionRuleColumns(
  t: DetectionRuleColumnTranslations
): Column<DetectionRule>[] {
  return [
    {
      key: 'name',
      label: t.common('name'),
      sortable: true,
      className: 'max-w-xs',
      render: (value: unknown) => (
        <span className="block truncate text-sm font-medium">{String(value)}</span>
      ),
    },
    {
      key: 'ruleType',
      label: t.detectionRules('columnRuleType'),
      sortable: true,
      render: (value: unknown) => {
        const ruleType = value as DetectionRuleType
        const labelKey = lookup(DETECTION_RULE_TYPE_LABEL_KEYS, ruleType)
        return (
          <span className="text-muted-foreground text-xs">
            {labelKey ? t.detectionRules(labelKey) : String(value)}
          </span>
        )
      },
    },
    {
      key: 'severity',
      label: t.common('severity'),
      sortable: true,
      render: (value: unknown) => {
        const sev = value as DetectionRuleSeverity
        const labelKey = lookup(DETECTION_RULE_SEVERITY_LABEL_KEYS, sev)
        return (
          <span
            className={cn(
              'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
              lookup(DETECTION_RULE_SEVERITY_CLASSES, sev)
            )}
          >
            {labelKey ? t.detectionRules(labelKey) : String(value)}
          </span>
        )
      },
    },
    {
      key: 'status',
      label: t.common('status'),
      sortable: true,
      render: (value: unknown) => {
        const status = value as DetectionRuleStatus
        const labelKey = lookup(DETECTION_RULE_STATUS_LABEL_KEYS, status)
        return (
          <span
            className={cn(
              'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
              lookup(DETECTION_RULE_STATUS_CLASSES, status)
            )}
          >
            {labelKey ? t.detectionRules(labelKey) : String(value)}
          </span>
        )
      },
    },
    {
      key: 'matchCount',
      label: t.detectionRules('columnMatches'),
      sortable: true,
      render: (value: unknown) => (
        <span className="text-muted-foreground text-xs">{Number(value).toLocaleString()}</span>
      ),
    },
    {
      key: 'mitreTechniques',
      label: t.detectionRules('columnMitre'),
      render: (value: unknown) => {
        const techniques = Array.isArray(value) ? (value as string[]) : []
        const first = techniques.at(0)
        if (!first) {
          return <span className="text-muted-foreground text-xs">-</span>
        }
        return (
          <div className="flex items-center gap-1">
            <span className="border-border rounded border px-1.5 py-0.5 font-mono text-xs">
              {first}
            </span>
            {techniques.length > 1 && (
              <span className="text-muted-foreground text-xs">+{techniques.length - 1}</span>
            )}
          </div>
        )
      },
    },
    {
      key: 'createdAt',
      label: t.common('createdAt'),
      sortable: true,
      defaultSortOrder: SortOrder.DESC,
      render: (value: unknown) => (
        <span className="text-muted-foreground text-xs whitespace-nowrap">
          {formatRelativeTime(String(value))}
        </span>
      ),
    },
  ]
}
