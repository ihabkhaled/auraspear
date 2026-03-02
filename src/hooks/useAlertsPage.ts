import { useState, useCallback, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { getAlertColumns } from '@/components/alerts'
import { Toast } from '@/components/common'
import { SEVERITY_ORDER } from '@/lib/alert.utils'
import { useFilterStore } from '@/stores'
import type { Alert, AIInvestigation, AlertSearchParams } from '@/types'
import { useAlerts, useInvestigateAlert } from './useAlerts'
import { useDebounce } from './useDebounce'
import { usePagination } from './usePagination'

export function useAlertsPage() {
  const t = useTranslations('alerts')
  const tCommon = useTranslations('common')

  const {
    severity: selectedSeverities,
    setSeverity,
    timeRange,
    setTimeRange,
    kqlQuery,
    setKqlQuery,
  } = useFilterStore()

  const [agentFilter, setAgentFilter] = useState('')
  const [ruleGroup, setRuleGroup] = useState('')
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [investigation, setInvestigation] = useState<AIInvestigation | null>(null)
  const [investigationOpen, setInvestigationOpen] = useState(false)

  const pagination = usePagination({ initialPage: 1, initialLimit: 10 })
  const debouncedQuery = useDebounce(kqlQuery, 400)

  const searchParams: AlertSearchParams = {
    page: pagination.page,
    limit: pagination.limit,
    timeRange,
  }
  if (selectedSeverities.length > 0) {
    searchParams.severity = selectedSeverities
  }
  if (debouncedQuery.length > 0) {
    searchParams.query = debouncedQuery
  }

  const { data, isLoading } = useAlerts(searchParams)

  const investigateMutation = useInvestigateAlert()

  useEffect(() => {
    if (data?.pagination) {
      pagination.setTotal(data.pagination.total)
    }
  }, [data?.pagination, pagination])

  const severityCounts = useMemo(() => {
    return SEVERITY_ORDER.map(sev => ({
      severity: sev,
      count: data?.data?.filter(a => a.severity === sev).length ?? 0,
    }))
  }, [data?.data])

  const handleRowClick = useCallback((alert: Alert) => {
    setSelectedAlert(alert)
    setDrawerOpen(true)
  }, [])

  const handleInvestigate = useCallback(
    (alert: Alert) => {
      investigateMutation.mutate(alert.id, {
        onSuccess: result => {
          setInvestigation(result.data)
          setInvestigationOpen(true)
          setDrawerOpen(false)
        },
        onError: () => {
          Toast.error(t('investigateError'))
        },
      })
    },
    [investigateMutation, t]
  )

  const handleCopyId = useCallback(
    (id: string) => {
      void navigator.clipboard.writeText(id)
      Toast.success(tCommon('copied'))
    },
    [tCommon]
  )

  const handleSearchSubmit = useCallback(() => {
    pagination.setPage(1)
  }, [pagination])

  const columns = useMemo(() => {
    return getAlertColumns(
      { alerts: t, common: tCommon },
      {
        onView: handleRowClick,
        onInvestigate: handleInvestigate,
        onCopyId: handleCopyId,
      }
    )
  }, [t, tCommon, handleRowClick, handleInvestigate, handleCopyId])

  return {
    selectedSeverities,
    setSeverity,
    timeRange,
    setTimeRange,
    kqlQuery,
    setKqlQuery,
    agentFilter,
    setAgentFilter,
    ruleGroup,
    setRuleGroup,
    selectedAlert,
    drawerOpen,
    setDrawerOpen,
    investigation,
    investigationOpen,
    setInvestigationOpen,
    isLoading,
    data,
    pagination,
    severityCounts,
    columns,
    handleRowClick,
    handleInvestigate,
    handleSearchSubmit,
  }
}
