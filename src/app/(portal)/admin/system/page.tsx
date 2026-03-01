'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Server, ScrollText } from 'lucide-react'
import { PageHeader, Pagination, LoadingSpinner, ErrorMessage, EmptyState } from '@/components/common'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ServiceHealthGrid, AuditLogTable } from '@/components/admin'
import { useServiceHealth, useAuditLogs, usePagination } from '@/hooks'

export default function SystemAdminPage() {
  const t = useTranslations('admin')

  const { data: healthData, isLoading: healthLoading, isError: healthError } = useServiceHealth()
  const pagination = usePagination({ initialPage: 1, initialLimit: 10 })

  const { data: auditData, isLoading: auditLoading } = useAuditLogs({
    page: pagination.page,
    limit: pagination.limit,
  })

  useEffect(() => {
    if (auditData?.pagination) {
      pagination.setTotal(auditData.pagination.total)
    }
  }, [auditData?.pagination, pagination])

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('system.title')}
        description={t('system.description')}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('services.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {healthLoading ? (
            <LoadingSpinner />
          ) : healthError ? (
            <ErrorMessage message={t('services.loadError')} />
          ) : (healthData?.data?.length ?? 0) === 0 ? (
            <EmptyState
              icon={<Server className="h-6 w-6" />}
              title={t('services.noServices')}
              description={t('services.noServicesDescription')}
            />
          ) : (
            <ServiceHealthGrid services={healthData?.data ?? []} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('audit.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {auditLoading ? (
            <LoadingSpinner />
          ) : (auditData?.data?.length ?? 0) === 0 ? (
            <EmptyState
              icon={<ScrollText className="h-6 w-6" />}
              title={t('audit.noLogs')}
              description={t('audit.noLogsDescription')}
            />
          ) : (
            <AuditLogTable logs={auditData?.data ?? []} loading={auditLoading} />
          )}
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={pagination.setPage}
            total={pagination.total}
          />
        </CardContent>
      </Card>
    </div>
  )
}
