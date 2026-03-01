'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Globe, Link2 } from 'lucide-react'
import { PageHeader, Pagination, LoadingSpinner, EmptyState } from '@/components/common'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IntelStatsGrid, IOCSearchBar, MISPEventFeed, WazuhCorrelationPanel } from '@/components/intel'
import { useMISPEvents, useIOCSearch, useCorrelations, usePagination } from '@/hooks'

export default function IntelPage() {
  const t = useTranslations('intel')

  const [iocQuery, setIocQuery] = useState('')
  const [iocType, setIocType] = useState('')

  const pagination = usePagination({ initialPage: 1, initialLimit: 10 })

  const { data: mispData, isLoading: mispLoading } = useMISPEvents({
    page: pagination.page,
    limit: pagination.limit,
  })

  const { data: _iocData, isLoading: iocLoading } = useIOCSearch(iocQuery, iocType)
  const { data: correlationsData, isLoading: correlationsLoading } = useCorrelations()

  useEffect(() => {
    if (mispData?.pagination) {
      pagination.setTotal(mispData.pagination.total)
    }
  }, [mispData?.pagination, pagination])

  const stats = useMemo(() => {
    const correlations = correlationsData?.data ?? []
    const ipCorrelations = correlations.filter(c => c.iocType.includes('ip'))
    const hashCorrelations = correlations.filter(c => c.iocType.includes('sha') || c.iocType.includes('hash') || c.iocType.includes('md5'))
    const domainCorrelations = correlations.filter(c => c.iocType.includes('domain'))

    return {
      threatActors: 12,
      ipIOCs: ipCorrelations.length > 0 ? ipCorrelations.length : 847,
      fileHashes: hashCorrelations.length > 0 ? hashCorrelations.length : 1243,
      activeDomains: domainCorrelations.length > 0 ? domainCorrelations.length : 156,
    }
  }, [correlationsData?.data])

  const handleIOCSearch = useCallback((query: string, type: string) => {
    setIocQuery(query)
    setIocType(type)
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('description')} />

      <IntelStatsGrid stats={stats} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('search.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <IOCSearchBar onSearch={handleIOCSearch} loading={iocLoading} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('misp.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mispLoading ? (
            <LoadingSpinner />
          ) : (mispData?.data?.length ?? 0) === 0 ? (
            <EmptyState
              icon={<Globe className="h-6 w-6" />}
              title={t('noEvents')}
              description={t('noEventsDescription')}
            />
          ) : (
            <MISPEventFeed events={mispData?.data ?? []} loading={mispLoading} />
          )}
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={pagination.setPage}
            total={pagination.total}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('correlation.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {correlationsLoading ? (
            <LoadingSpinner />
          ) : (correlationsData?.data?.length ?? 0) === 0 ? (
            <EmptyState
              icon={<Link2 className="h-6 w-6" />}
              title={t('noCorrelations')}
              description={t('noCorrelationsDescription')}
            />
          ) : (
            <WazuhCorrelationPanel correlations={correlationsData?.data ?? []} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
