'use client'

import { Building2, Pencil, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { DataTable } from '@/components/common/DataTable'
import { Button } from '@/components/ui/button'
import { UserRole } from '@/enums'
import type { Tenant, Column } from '@/types'

interface TenantListTableProps {
  tenants: Tenant[]
  loading: boolean
  onTenantClick: ((tenant: Tenant) => void) | undefined
  onEditTenant?: (tenant: Tenant) => void
  onDeleteTenant?: (tenant: Tenant) => void
  userRole?: UserRole
}

export function TenantListTable({
  tenants,
  loading,
  onTenantClick,
  onEditTenant,
  onDeleteTenant,
  userRole,
}: TenantListTableProps) {
  const t = useTranslations('admin')
  const tCommon = useTranslations('common')

  const isGlobalAdmin = userRole === UserRole.GLOBAL_ADMIN

  const columns: Column<Tenant>[] = [
    {
      key: 'name',
      label: t('tenants.name'),
      render: value => <span className="font-medium">{String(value ?? '')}</span>,
    },
    {
      key: 'slug',
      label: t('tenants.slug'),
      render: value => (
        <span className="text-muted-foreground font-mono text-sm">{String(value ?? '')}</span>
      ),
    },
    {
      key: 'userCount',
      label: t('tenants.users'),
      render: value => <span className="text-muted-foreground text-sm">{String(value ?? 0)}</span>,
    },
    {
      key: 'alertCount',
      label: t('tenants.alerts'),
      render: value => <span className="text-muted-foreground text-sm">{String(value ?? 0)}</span>,
    },
    {
      key: 'caseCount',
      label: t('tenants.cases'),
      render: value => <span className="text-muted-foreground text-sm">{String(value ?? 0)}</span>,
    },
  ]

  if (isGlobalAdmin) {
    columns.push({
      key: 'actions',
      label: tCommon('actions'),
      render: (_value, row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={e => {
              e.stopPropagation()
              onEditTenant?.(row)
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive h-8 w-8 p-0"
            onClick={e => {
              e.stopPropagation()
              onDeleteTenant?.(row)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    })
  }

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
