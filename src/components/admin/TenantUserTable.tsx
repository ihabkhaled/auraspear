'use client'

import { Shield, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { DataTable } from '@/components/common/DataTable'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { UserRole } from '@/enums'
import { getInitials } from '@/lib/case.utils'
import { cn, formatRelativeTime } from '@/lib/utils'
import type { TenantUser, Column } from '@/types'

interface TenantUserTableProps {
  users: TenantUser[]
  loading?: boolean
  onUserClick?: (user: TenantUser) => void
}

function getRoleBadgeClass(role: UserRole): string {
  switch (role) {
    case UserRole.GLOBAL_ADMIN:
      return 'bg-primary/10 text-primary border-primary/20'
    case UserRole.TENANT_ADMIN:
      return 'bg-primary/10 text-primary border-primary/20'
    case UserRole.SOC_ANALYST_L2:
      return 'bg-[var(--chart-1)]/10 text-[var(--chart-1)] border-[var(--chart-1)]/20'
    case UserRole.SOC_ANALYST_L1:
      return 'bg-[var(--chart-1)]/10 text-[var(--chart-1)] border-[var(--chart-1)]/20'
    case UserRole.THREAT_HUNTER:
      return 'bg-[var(--chart-3)]/10 text-[var(--chart-3)] border-[var(--chart-3)]/20'
    case UserRole.EXECUTIVE_READONLY:
      return 'bg-muted text-muted-foreground border-border'
    default:
      return 'bg-muted text-muted-foreground border-border'
  }
}

export function TenantUserTable({ users, loading = false, onUserClick }: TenantUserTableProps) {
  const t = useTranslations('admin')

  const columns: Column<TenantUser>[] = [
    {
      key: 'name',
      label: t('users.name'),
      render: (_value, row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            {row.avatar && <AvatarImage src={row.avatar} alt={row.name} />}
            <AvatarFallback className="text-xs">{getInitials(row.name)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'email',
      label: t('users.email'),
      className: 'text-muted-foreground',
    },
    {
      key: 'role',
      label: t('users.role'),
      render: value => (
        <Badge variant="outline" className={cn('capitalize', getRoleBadgeClass(value as UserRole))}>
          {String(value ?? '')}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: t('users.status'),
      render: value => {
        const status = String(value ?? '')
        const isActive = status === 'active'
        return (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'inline-block h-2 w-2 rounded-full',
                isActive ? 'bg-status-success' : 'bg-status-neutral'
              )}
            />
            <span className="text-sm capitalize">{status}</span>
          </div>
        )
      },
    },
    {
      key: 'lastLogin',
      label: t('users.lastLogin'),
      render: value => (
        <span className="text-muted-foreground text-sm">
          {value ? formatRelativeTime(String(value)) : t('users.never')}
        </span>
      ),
    },
    {
      key: 'mfaEnabled',
      label: t('users.mfa'),
      className: 'text-center',
      render: value =>
        value === true ? (
          <Shield className="text-status-success mx-auto h-4 w-4" />
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={users}
      loading={loading}
      onRowClick={onUserClick}
      emptyMessage={t('users.noUsers')}
      emptyIcon={<Users className="h-6 w-6" />}
      emptyDescription={t('users.noUsersDescription')}
    />
  )
}
