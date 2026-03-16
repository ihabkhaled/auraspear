'use client'

import { Plus, Search } from 'lucide-react'
import { DataTable, PageHeader, Pagination } from '@/components/common'
import { SystemHealthCreateDialog } from '@/components/system-health/SystemHealthCreateDialog'
import { SystemHealthDetailPanel } from '@/components/system-health/SystemHealthDetailPanel'
import { SystemHealthEditDialog } from '@/components/system-health/SystemHealthEditDialog'
import { SystemHealthFilters } from '@/components/system-health/SystemHealthFilters'
import { SystemHealthKpiCards } from '@/components/system-health/SystemHealthKpiCards'
import { ServiceType } from '@/enums'
import { useSystemHealthPage } from '@/hooks/useSystemHealthPage'
import {
  HEALTH_CHECK_STATUS_CLASSES,
  HEALTH_CHECK_STATUS_LABEL_KEYS,
  SERVICE_TYPE_LABEL_KEYS,
} from '@/lib/constants/system-health'
import { cn, lookup } from '@/lib/utils'

export default function SystemHealthPage() {
  const {
    t,
    data,
    stats,
    statsLoading,
    latestChecks,
    columns,
    isFetching,
    pagination,
    serviceTypeFilter,
    statusFilter,
    sortBy,
    sortOrder,
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    detailOpen,
    setDetailOpen,
    selectedCheck,
    detailMetrics,
    createLoading,
    editLoading,
    handleServiceTypeChange,
    handleStatusChange,
    handleSort,
    handleCreate,
    handleEdit,
  } = useSystemHealthPage()

  const editInitialValues = selectedCheck
    ? {
        serviceName: lookup(SERVICE_TYPE_LABEL_KEYS, selectedCheck.serviceType)
          ? t(lookup(SERVICE_TYPE_LABEL_KEYS, selectedCheck.serviceType))
          : selectedCheck.serviceType,
        serviceType: selectedCheck.serviceType,
        config: '{}',
      }
    : { serviceName: '', serviceType: ServiceType.CONNECTOR, config: '{}' }

  return (
    <div className="space-y-4">
      <PageHeader
        title={t('title')}
        description={t('description')}
        action={{
          label: t('createService'),
          icon: <Plus className="h-4 w-4" />,
          onClick: () => setCreateOpen(true),
        }}
      />

      <SystemHealthKpiCards stats={stats} isLoading={statsLoading} />

      {latestChecks.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {latestChecks.map(check => {
            const statusLabelKey = lookup(HEALTH_CHECK_STATUS_LABEL_KEYS, check.status)
            const serviceLabelKey = lookup(SERVICE_TYPE_LABEL_KEYS, check.serviceType)
            return (
              <div
                key={check.id}
                className="bg-card border-border flex items-center gap-2 rounded-lg border p-3"
              >
                <span
                  className={cn(
                    'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                    lookup(HEALTH_CHECK_STATUS_CLASSES, check.status)
                  )}
                >
                  {statusLabelKey ? t(statusLabelKey) : check.status}
                </span>
                <span className="text-foreground text-sm font-medium">
                  {serviceLabelKey ? t(serviceLabelKey) : check.serviceType}
                </span>
              </div>
            )
          })}
        </div>
      )}

      <SystemHealthFilters
        serviceTypeFilter={serviceTypeFilter}
        statusFilter={statusFilter}
        onServiceTypeChange={handleServiceTypeChange}
        onStatusChange={handleStatusChange}
      />

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        loading={isFetching}
        emptyMessage={t('noChecks')}
        emptyIcon={<Search className="h-6 w-6" />}
        emptyDescription={t('emptyDescription')}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={pagination.setPage}
        total={pagination.total}
      />

      <SystemHealthCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        loading={createLoading}
      />

      <SystemHealthEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleEdit}
        initialValues={editInitialValues}
        loading={editLoading}
      />

      <SystemHealthDetailPanel
        healthCheck={selectedCheck}
        metrics={detailMetrics}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}
