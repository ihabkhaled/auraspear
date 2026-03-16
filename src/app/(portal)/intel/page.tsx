'use client'

import { Globe } from 'lucide-react'
import { PageHeader, Pagination, LoadingSpinner, EmptyState } from '@/components/common'
import {
  IntelStatsGrid,
  IocSearchBar,
  MispEventFeed,
  WazuhCorrelationPanel,
} from '@/components/intel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useIntelPage } from '@/hooks/useIntelPage'

export default function IntelPage() {
  const {
    t,
    mispData,
    mispLoading,
    mispPagination,
    mispSortBy,
    mispSortOrder,
    handleMispSort,
    iocData,
    iocLoading,
    iocPagination,
    iocSortBy,
    iocSortOrder,
    handleIocSort,
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
    return (
      <MispEventFeed
        events={mispData?.data ?? []}
        loading={mispLoading}
        sortBy={mispSortBy}
        sortOrder={mispSortOrder}
        onSort={handleMispSort}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('description')} />

      <IntelStatsGrid stats={stats} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('search.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <IocSearchBar onSearch={handleIOCSearch} loading={iocLoading} />
          <WazuhCorrelationPanel
            correlations={iocData?.data ?? []}
            loading={iocLoading}
            sortBy={iocSortBy}
            sortOrder={iocSortOrder}
            onSort={handleIocSort}
          />
          {(iocData?.pagination?.totalPages ?? 0) > 1 && (
            <Pagination
              page={iocPagination.page}
              totalPages={iocData?.pagination?.totalPages ?? 1}
              onPageChange={iocPagination.setPage}
              total={iocData?.pagination?.total ?? 0}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('misp.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderMISPEvents()}
          <Pagination
            page={mispPagination.page}
            totalPages={mispPagination.totalPages}
            onPageChange={mispPagination.setPage}
            total={mispPagination.total}
          />
        </CardContent>
      </Card>
    </div>
  )
}
