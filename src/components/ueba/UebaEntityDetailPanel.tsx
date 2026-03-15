'use client'

import { X } from 'lucide-react'
import { LoadingSpinner } from '@/components/common'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useUebaEntityDetailPanel } from '@/hooks/useUebaEntityDetailPanel'
import {
  UEBA_ENTITY_TYPE_LABEL_KEYS,
  UEBA_ENTITY_TYPE_CLASSES,
  UEBA_RISK_LEVEL_LABEL_KEYS,
  UEBA_RISK_LEVEL_CLASSES,
} from '@/lib/constants/ueba'
import { formatDate } from '@/lib/utils'
import type { UebaEntityDetailPanelProps } from '@/types'
import { UebaAnomalyCard } from './UebaAnomalyCard'

export function UebaEntityDetailPanel({ entityId, onClose }: UebaEntityDetailPanelProps) {
  const {
    t,
    entity,
    entityLoading,
    anomalies,
    anomaliesFetching,
    isResolving,
    handleResolveAnomaly,
    handleClose,
  } = useUebaEntityDetailPanel({ entityId, onClose })

  if (!entityId) {
    return null
  }

  if (entityLoading) {
    return (
      <div className="bg-card border-border rounded-lg border p-6">
        <LoadingSpinner />
      </div>
    )
  }

  if (!entity) {
    return (
      <div className="bg-card border-border rounded-lg border p-6">
        <p className="text-muted-foreground text-sm">{t('entityNotFound')}</p>
      </div>
    )
  }

  return (
    <div className="bg-card border-border flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{entity.entityName}</h3>
        <Button variant="ghost" size="sm" onClick={handleClose} aria-label={t('close')}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${UEBA_ENTITY_TYPE_CLASSES[entity.entityType]}`}
        >
          {t(UEBA_ENTITY_TYPE_LABEL_KEYS[entity.entityType])}
        </span>
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${UEBA_RISK_LEVEL_CLASSES[entity.riskLevel]}`}
        >
          {t(UEBA_RISK_LEVEL_LABEL_KEYS[entity.riskLevel])}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-xs">{t('colRiskScore')}</span>
          <span className="font-mono text-sm font-medium">{entity.riskScore}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-xs">{t('colAnomalyCount')}</span>
          <span className="text-sm font-medium">{entity.anomalyCount}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-xs">{t('colDepartment')}</span>
          <span className="text-sm">{entity.department ?? '-'}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-xs">{t('colLastSeen')}</span>
          <span className="text-sm">{formatDate(entity.lastSeen)}</span>
        </div>
      </div>

      {entity.trend.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs font-medium">{t('riskTrend')}</span>
          <div className="flex items-end gap-0.5">
            {entity.trend.map((value, index) => (
              <div
                key={`trend-${String(index)}`}
                className="bg-primary/60 w-3 rounded-t"
                style={{ height: `${Math.max(value, 4)}px` }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">{t('anomalies')}</h4>
          {anomaliesFetching && <Badge variant="secondary">{t('loading')}</Badge>}
        </div>

        {anomalies.length === 0 ? (
          <p className="text-muted-foreground text-xs">{t('noAnomalies')}</p>
        ) : (
          <div className="flex flex-col gap-2">
            {anomalies.map(anomaly => (
              <UebaAnomalyCard
                key={anomaly.id}
                anomaly={anomaly}
                onResolve={handleResolveAnomaly}
                resolving={isResolving}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
