'use client'

import { Plus, Building2, Users, UserPlus, UserCheck, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  TenantUserTable,
  TenantListTable,
  CreateTenantDialog,
  AddUserDialog,
  AssignUserDialog,
  EditTenantDialog,
  EditUserDialog,
} from '@/components/admin'
import {
  PageHeader,
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
  Pagination,
} from '@/components/common'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
    assignUserDialogOpen,
    setAssignUserDialogOpen,
    editTenantDialogOpen,
    setEditTenantDialogOpen,
    editUserDialogOpen,
    setEditUserDialogOpen,
    editingTenant,
    editingUser,
    tenantsData,
    tenantsLoading,
    tenantsFetching,
    tenantsError,
    usersData,
    usersLoading,
    usersFetching,
    usersError,
    createTenantPending,
    addUserPending,
    assignUserPending,
    updateTenantPending,
    updateUserPending,
    handleCreateTenant,
    handleAddUser,
    handleAssignUser,
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
    handleImpersonateUser,
    userSortBy,
    userSortOrder,
    handleUserSort,
    userSearch,
    setUserSearch,
    userPagination,
    tenantSortBy,
    tenantSortOrder,
    handleTenantSort,
    tenantSearch,
    setTenantSearch,
    tenantPagination,
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
      <>
        <TenantListTable
          tenants={tenantsData?.data ?? []}
          loading={tenantsFetching}
          onTenantClick={handleTenantClick}
          onEditTenant={handleEditTenant}
          onDeleteTenant={handleDeleteTenant}
          {...(userRole ? { userRole } : {})}
          sortBy={tenantSortBy}
          sortOrder={tenantSortOrder}
          onSort={handleTenantSort}
        />
        {tenantPagination.totalPages > 1 && (
          <div className="pt-4">
            <Pagination
              page={tenantPagination.page}
              totalPages={tenantPagination.totalPages}
              onPageChange={tenantPagination.setPage}
              total={tenantPagination.total}
            />
          </div>
        )}
      </>
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
      <>
        <TenantUserTable
          users={usersData?.data ?? []}
          loading={usersFetching}
          onEditUser={handleEditUser}
          onRemoveUser={handleRemoveUser}
          onBlockUser={handleBlockUser}
          onUnblockUser={handleUnblockUser}
          onRestoreUser={handleRestoreUser}
          onImpersonateUser={handleImpersonateUser}
          showActions={canManageUsers}
          callerRole={userRole}
          currentUserId={currentUserId}
          sortBy={userSortBy}
          sortOrder={userSortOrder}
          onSort={handleUserSort}
        />
        {userPagination.totalPages > 1 && (
          <div className="pt-4">
            <Pagination
              page={userPagination.page}
              totalPages={userPagination.totalPages}
              onPageChange={userPagination.setPage}
              total={userPagination.total}
            />
          </div>
        )}
      </>
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
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">{t('tenants.title')}</CardTitle>
          {isGlobalAdmin && (
            <div className="relative w-full sm:w-64">
              <Search className="text-muted-foreground absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                value={tenantSearch}
                onChange={e => setTenantSearch(e.target.value)}
                placeholder={t('tenants.searchPlaceholder')}
                className="ps-9"
              />
            </div>
          )}
        </CardHeader>
        <CardContent>{renderTenants()}</CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setAssignUserDialogOpen(true)}>
                  <UserCheck className="me-2 h-4 w-4" />
                  {t('users.assignUser')}
                </Button>
                <Button size="sm" onClick={() => setAddUserDialogOpen(true)}>
                  <UserPlus className="me-2 h-4 w-4" />
                  {t('users.addUser')}
                </Button>
              </div>
            )}
          </div>
          {currentTenantId.length > 0 && (
            <div className="relative w-full sm:w-64">
              <Search className="text-muted-foreground absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                placeholder={t('users.searchPlaceholder')}
                className="ps-9"
              />
            </div>
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

      <AssignUserDialog
        open={assignUserDialogOpen}
        onOpenChange={setAssignUserDialogOpen}
        onSubmit={handleAssignUser}
        loading={assignUserPending}
        tenantId={currentTenantId}
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
