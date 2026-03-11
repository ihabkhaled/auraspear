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
import { Progress } from '@/components/ui/progress'
import { ServiceStatus } from '@/enums'
import { useSystemAdminPage } from '@/hooks/useSystemAdminPage'
import { computeHealthPercent, getHealthStatusClass, getHealthBgClass } from '@/lib/health-utils'
import { cn } from '@/lib/utils'
import type { ServiceHealth } from '@/types'

function HealthSummary({
  services,
  t,
}: {
  services: ServiceHealth[]
  t: ReturnType<typeof useTranslations<'admin'>>
}) {
  const percent = computeHealthPercent(services)
  const online = services.filter(s => s.status === ServiceStatus.HEALTHY).length

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className={cn('h-2 w-2 rounded-full', getHealthBgClass(percent))} />
        <span className="text-muted-foreground text-xs">
          {t('services.online')}: {online}/{services.length}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Progress value={percent} className="h-1.5 w-24" />
        <span className={cn('text-xs font-bold', getHealthStatusClass(percent))}>{percent}%</span>
      </div>
    </div>
  )
}

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
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{t('services.title')}</CardTitle>
            {!healthLoading && (healthData?.data?.length ?? 0) > 0 && (
              <HealthSummary services={healthData?.data ?? []} t={t} />
            )}
          </div>
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
