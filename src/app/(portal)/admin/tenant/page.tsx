'use client'

import { useState, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Plus, Building2, Users } from 'lucide-react'
import { PageHeader, LoadingSpinner, ErrorMessage, Toast, EmptyState } from '@/components/common'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  TenantUserTable,
  TenantListTable,
  CreateTenantDialog,
} from '@/components/admin'
import type { CreateTenantFormValues } from '@/components/admin'
import { useTenants, useCreateTenant, useTenantUsers } from '@/hooks'
import { useTenantStore } from '@/stores'
import type { Tenant } from '@/types'

export default function TenantConfigPage() {
  const t = useTranslations('admin')
  const { currentTenantId, setCurrentTenant, setTenants } = useTenantStore()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const {
    data: tenantsData,
    isLoading: tenantsLoading,
    isError: tenantsError,
  } = useTenants()

  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
  } = useTenantUsers(currentTenantId)

  const createTenant = useCreateTenant()

  useEffect(() => {
    if (tenantsData?.data) {
      setTenants(tenantsData.data)
    }
  }, [tenantsData?.data, setTenants])

  const handleCreateTenant = useCallback(
    (formData: CreateTenantFormValues) => {
      createTenant.mutate(
        { name: formData.name, environment: formData.environment },
        {
          onSuccess: () => {
            setCreateDialogOpen(false)
            Toast.success(t('tenants.tenantCreated'))
          },
          onError: () => {
            Toast.error(t('tenants.tenantCreateError'))
          },
        }
      )
    },
    [createTenant, t]
  )

  const handleTenantClick = useCallback(
    (tenant: Tenant) => {
      setCurrentTenant(tenant.id)
    },
    [setCurrentTenant]
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('tenant.title')}
        description={t('tenant.description')}
        action={{
          label: t('tenants.addTenant'),
          icon: <Plus className="h-4 w-4" />,
          onClick: () => setCreateDialogOpen(true),
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('tenants.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {tenantsLoading ? (
            <LoadingSpinner />
          ) : tenantsError ? (
            <ErrorMessage message={t('tenants.loadError')} />
          ) : (tenantsData?.data?.length ?? 0) === 0 ? (
            <EmptyState
              icon={<Building2 className="h-6 w-6" />}
              title={t('tenants.noTenants')}
              description={t('tenants.noTenantsDescription')}
            />
          ) : (
            <TenantListTable
              tenants={tenantsData?.data ?? []}
              loading={tenantsLoading}
              onTenantClick={handleTenantClick}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t('users.title')}
            {tenantsData?.data && (
              <span className="ms-2 text-sm font-normal text-muted-foreground">
                ({tenantsData.data.find(tenant => tenant.id === currentTenantId)?.name ?? currentTenantId})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <LoadingSpinner />
          ) : usersError ? (
            <ErrorMessage message={t('users.loadError')} />
          ) : (usersData?.data?.length ?? 0) === 0 ? (
            <EmptyState
              icon={<Users className="h-6 w-6" />}
              title={t('users.noUsers')}
              description={t('users.noUsersDescription')}
            />
          ) : (
            <TenantUserTable
              users={usersData?.data ?? []}
              loading={usersLoading}
            />
          )}
        </CardContent>
      </Card>

      <CreateTenantDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateTenant}
        loading={createTenant.isPending}
      />
    </div>
  )
}
