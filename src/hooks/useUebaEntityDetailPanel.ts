import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { getErrorKey } from '@/lib/api-error'
import type { UebaEntityDetailPanelProps } from '@/types'
import { useUebaEntity, useUebaAnomalies, useResolveAnomaly } from './useUeba'

export function useUebaEntityDetailPanel({ entityId, onClose }: UebaEntityDetailPanelProps) {
  const t = useTranslations('ueba')

  const { data: entityData, isLoading: entityLoading } = useUebaEntity(entityId)
  const { data: anomaliesData, isFetching: anomaliesFetching } = useUebaAnomalies(
    entityId ? { query: entityId } : undefined
  )
  const resolveAnomaly = useResolveAnomaly()

  const entity = entityData?.data ?? null
  const anomalies = anomaliesData?.data ?? []

  const handleResolveAnomaly = useCallback(
    (anomalyId: string) => {
      resolveAnomaly.mutate(anomalyId, {
        onSuccess: () => {
          Toast.success(t('anomalyResolved'))
        },
        onError: (error: unknown) => {
          Toast.error(t(getErrorKey(error)))
        },
      })
    },
    [resolveAnomaly, t]
  )

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  return {
    t,
    entity,
    entityLoading,
    anomalies,
    anomaliesFetching,
    isResolving: resolveAnomaly.isPending,
    handleResolveAnomaly,
    handleClose,
  }
}
