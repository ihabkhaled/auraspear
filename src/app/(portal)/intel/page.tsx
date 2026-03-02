'use client'

import { Globe, Link2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PageHeader, Pagination, LoadingSpinner, EmptyState } from '@/components/common'
import {
  IntelStatsGrid,
  IOCSearchBar,
  MISPEventFeed,
  WazuhCorrelationPanel,
} from '@/components/intel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useIntelPage } from '@/hooks/useIntelPage'

export default function IntelPage() {
  const t = useTranslations('intel')

  const {
    mispData,
    mispLoading,
    iocLoading,
    correlationsData,
    correlationsLoading,
    pagination,
    stats,
    handleIOCSearch,
  } = useIntelPage()

  function renderMISPEvents() {
    if (mispLoading) return <LoadingSpinner />
    if ((mispData?.data?.length ?? 0) === 0) {
      return (
        <EmptyState
          icon={<Globe className="h-6 w-6" />}
          title={t('noEvents')}
          description={t('noEventsDescription')}
        />
      )
    }
    return <MISPEventFeed events={mispData?.data ?? []} loading={mispLoading} />
  }

  function renderCorrelations() {
    if (correlationsLoading) return <LoadingSpinner />
    if ((correlationsData?.data?.length ?? 0) === 0) {
      return (
        <EmptyState
          icon={<Link2 className="h-6 w-6" />}
          title={t('noCorrelations')}
          description={t('noCorrelationsDescription')}
        />
      )
    }
    return <WazuhCorrelationPanel correlations={correlationsData?.data ?? []} />
  }

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
          {renderMISPEvents()}
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
        <CardContent>{renderCorrelations()}</CardContent>
      </Card>
    </div>
  )
}
