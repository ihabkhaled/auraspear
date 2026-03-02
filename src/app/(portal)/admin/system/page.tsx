'use client'

import { Server, ScrollText } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ServiceHealthGrid, AuditLogTable } from '@/components/admin'
import {
  PageHeader,
  Pagination,
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
} from '@/components/common'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSystemAdminPage } from '@/hooks/useSystemAdminPage'

export default function SystemAdminPage() {
  const t = useTranslations('admin')

  const {
    healthData,
    healthLoading,
    healthError,
    auditData,
    auditLoading,
    pagination,
    auditSortBy,
    auditSortOrder,
    handleAuditSort,
  } = useSystemAdminPage()

  function renderServices() {
    if (healthLoading) return <LoadingSpinner />
    if (healthError) return <ErrorMessage message={t('services.loadError')} />
    if ((healthData?.data?.length ?? 0) === 0) {
      return (
        <EmptyState
          icon={<Server className="h-6 w-6" />}
          title={t('services.noServices')}
          description={t('services.noServicesDescription')}
        />
      )
    }
    return <ServiceHealthGrid services={healthData?.data ?? []} />
  }

  function renderAuditLogs() {
    if (auditLoading) return <LoadingSpinner />
    if ((auditData?.data?.length ?? 0) === 0) {
      return (
        <EmptyState
          icon={<ScrollText className="h-6 w-6" />}
          title={t('audit.noLogs')}
          description={t('audit.noLogsDescription')}
        />
      )
    }
    return (
      <AuditLogTable
        logs={auditData?.data ?? []}
        loading={auditLoading}
        sortBy={auditSortBy}
        sortOrder={auditSortOrder}
        onSort={handleAuditSort}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('system.title')} description={t('system.description')} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('services.title')}</CardTitle>
        </CardHeader>
        <CardContent>{renderServices()}</CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('audit.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderAuditLogs()}
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
