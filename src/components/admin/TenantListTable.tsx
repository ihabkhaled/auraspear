'use client'

import { useTranslations } from 'next-intl'
import { Building2 } from 'lucide-react'
import { DataTable } from '@/components/common/DataTable'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Tenant, Column } from '@/types'

interface TenantListTableProps {
  tenants: Tenant[]
  loading: boolean
  onTenantClick: ((tenant: Tenant) => void) | undefined
}

function getStatusClass(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-status-success text-status-success border-status-success'
    case 'trial':
      return 'bg-status-warning text-status-warning border-status-warning'
    case 'inactive':
      return 'bg-status-neutral text-status-neutral border-status-neutral'
    default:
      return ''
  }
}

function getEnvironmentClass(env: string): string {
  switch (env) {
    case 'production':
      return 'bg-primary/10 text-primary border-primary/20'
    case 'staging':
      return 'bg-status-warning text-status-warning border-status-warning'
    case 'development':
      return 'bg-status-info text-status-info border-status-info'
    default:
      return ''
  }
}

export function TenantListTable({ tenants, loading, onTenantClick }: TenantListTableProps) {
  const t = useTranslations('admin')

  const columns: Column<Tenant>[] = [
    {
      key: 'name',
      label: t('tenants.name'),
      render: (value) => (
        <span className="font-medium">{String(value ?? '')}</span>
      ),
    },
    {
      key: 'environment',
      label: t('tenants.environment'),
      render: (value) => (
        <Badge variant="outline" className={cn('capitalize', getEnvironmentClass(String(value ?? '')))}>
          {String(value ?? '')}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: t('tenants.status'),
      render: (value) => (
        <Badge variant="outline" className={cn('capitalize', getStatusClass(String(value ?? '')))}>
          {String(value ?? '')}
        </Badge>
      ),
    },
    {
      key: 'userCount',
      label: t('tenants.users'),
      render: (value) => (
        <span className="text-sm text-muted-foreground">{String(value ?? 0)}</span>
      ),
    },
    {
      key: 'alertCount',
      label: t('tenants.alerts'),
      render: (value) => (
        <span className="text-sm text-muted-foreground">{String(value ?? 0)}</span>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={tenants}
      loading={loading}
      onRowClick={onTenantClick}
      emptyMessage={t('tenants.noTenants')}
      emptyIcon={<Building2 className="h-6 w-6" />}
      emptyDescription={t('tenants.noTenantsDescription')}
    />
  )
}
