'use client'

import { Plus, Building2, Users, UserPlus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  TenantUserTable,
  TenantListTable,
  CreateTenantDialog,
  AddUserDialog,
  EditTenantDialog,
  EditUserDialog,
} from '@/components/admin'
import { PageHeader, LoadingSpinner, ErrorMessage, EmptyState } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTenantConfigPage } from '@/hooks/useTenantConfigPage'

export default function TenantConfigPage() {
  const t = useTranslations('admin')

  const {
    currentTenantId,
    userRole,
    isGlobalAdmin,
    canManageUsers,
    createDialogOpen,
    setCreateDialogOpen,
    addUserDialogOpen,
    setAddUserDialogOpen,
    editTenantDialogOpen,
    setEditTenantDialogOpen,
    editUserDialogOpen,
    setEditUserDialogOpen,
    editingTenant,
    editingUser,
    tenantsData,
    tenantsLoading,
    tenantsError,
    usersData,
    usersLoading,
    usersError,
    createTenantPending,
    addUserPending,
    updateTenantPending,
    updateUserPending,
    handleCreateTenant,
    handleAddUser,
    handleTenantClick,
    handleEditTenant,
    handleEditTenantSubmit,
    handleDeleteTenant,
    handleEditUser,
    handleEditUserSubmit,
    handleRemoveUser,
    currentUserId,
    handleBlockUser,
    handleUnblockUser,
    handleRestoreUser,
    userSortBy,
    userSortOrder,
    handleUserSort,
  } = useTenantConfigPage()

  function renderTenants() {
    if (tenantsLoading) return <LoadingSpinner />
    if (tenantsError) return <ErrorMessage message={t('tenants.loadError')} />
    if ((tenantsData?.data?.length ?? 0) === 0) {
      return (
        <EmptyState
          icon={<Building2 className="h-6 w-6" />}
          title={t('tenants.noTenants')}
          description={t('tenants.noTenantsDescription')}
        />
      )
    }
    return (
      <TenantListTable
        tenants={tenantsData?.data ?? []}
        loading={tenantsLoading}
        onTenantClick={handleTenantClick}
        onEditTenant={handleEditTenant}
        onDeleteTenant={handleDeleteTenant}
        {...(userRole ? { userRole } : {})}
      />
    )
  }

  function renderUsers() {
    if (usersLoading) return <LoadingSpinner />
    if (usersError) return <ErrorMessage message={t('users.loadError')} />
    if ((usersData?.data?.length ?? 0) === 0) {
      return (
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title={t('users.noUsers')}
          description={t('users.noUsersDescription')}
        />
      )
    }
    return (
      <TenantUserTable
        users={usersData?.data ?? []}
        loading={usersLoading}
        onEditUser={handleEditUser}
        onRemoveUser={handleRemoveUser}
        onBlockUser={handleBlockUser}
        onUnblockUser={handleUnblockUser}
        onRestoreUser={handleRestoreUser}
        showActions={canManageUsers}
        callerRole={userRole}
        currentUserId={currentUserId}
        sortBy={userSortBy}
        sortOrder={userSortOrder}
        onSort={handleUserSort}
      />
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('tenant.title')}
        description={t('tenant.description')}
        {...(isGlobalAdmin
          ? {
              action: {
                label: t('tenants.addTenant'),
                icon: <Plus className="h-4 w-4" />,
                onClick: () => setCreateDialogOpen(true),
              },
            }
          : {})}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('tenants.title')}</CardTitle>
        </CardHeader>
        <CardContent>{renderTenants()}</CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">
            {t('users.title')}
            {tenantsData?.data && (
              <span className="text-muted-foreground ms-2 text-sm font-normal">
                (
                {tenantsData.data.find(tenant => tenant.id === currentTenantId)?.name ??
                  currentTenantId}
                )
              </span>
            )}
          </CardTitle>
          {currentTenantId.length > 0 && canManageUsers && (
            <Button size="sm" onClick={() => setAddUserDialogOpen(true)}>
              <UserPlus className="me-2 h-4 w-4" />
              {t('users.addUser')}
            </Button>
          )}
        </CardHeader>
        <CardContent>{renderUsers()}</CardContent>
      </Card>

      <CreateTenantDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateTenant}
        loading={createTenantPending}
      />

      <AddUserDialog
        open={addUserDialogOpen}
        onOpenChange={setAddUserDialogOpen}
        onSubmit={handleAddUser}
        loading={addUserPending}
        callerRole={userRole}
      />

      <EditTenantDialog
        open={editTenantDialogOpen}
        onOpenChange={setEditTenantDialogOpen}
        tenant={editingTenant}
        onSubmit={handleEditTenantSubmit}
        loading={updateTenantPending}
      />

      <EditUserDialog
        open={editUserDialogOpen}
        onOpenChange={setEditUserDialogOpen}
        user={editingUser}
        onSubmit={handleEditUserSubmit}
        loading={updateUserPending}
        callerRole={userRole}
      />
    </div>
  )
}
