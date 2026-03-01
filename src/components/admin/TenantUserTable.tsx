'use client'

import { useTranslations } from 'next-intl'
import { Shield, Users } from 'lucide-react'
import { DataTable } from '@/components/common/DataTable'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { formatRelativeTime } from '@/lib/utils'
import { UserRole } from '@/enums'
import type { TenantUser, Column } from '@/types'

interface TenantUserTableProps {
  users: TenantUser[]
  loading?: boolean
  onUserClick?: (user: TenantUser) => void
}

function getRoleBadgeClass(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return 'bg-primary/10 text-primary border-primary/20'
    case UserRole.ANALYST:
      return 'bg-[var(--chart-1)]/10 text-[var(--chart-1)] border-[var(--chart-1)]/20'
    case UserRole.MANAGER:
      return 'bg-[var(--chart-3)]/10 text-[var(--chart-3)] border-[var(--chart-3)]/20'
    case UserRole.VIEWER:
      return 'bg-muted text-muted-foreground border-border'
    default:
      return 'bg-muted text-muted-foreground border-border'
  }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()
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
      render: (value) => (
        <Badge
          variant="outline"
          className={cn('capitalize', getRoleBadgeClass(value as UserRole))}
        >
          {String(value ?? '')}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: t('users.status'),
      render: (value) => {
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
      render: (value) => (
        <span className="text-sm text-muted-foreground">
          {value ? formatRelativeTime(String(value)) : t('users.never')}
        </span>
      ),
    },
    {
      key: 'mfaEnabled',
      label: t('users.mfa'),
      className: 'text-center',
      render: (value) => (
        value === true ? (
          <Shield className="mx-auto h-4 w-4 text-status-success" />
        ) : (
          <span className="text-muted-foreground">-</span>
        )
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
