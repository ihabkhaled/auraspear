import { useState, useCallback, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import type {
  CreateTenantFormValues,
  AddUserFormValues,
  EditTenantFormValues,
} from '@/components/admin'
import { Toast, SweetAlertDialog, SweetAlertIcon } from '@/components/common'
import { UserRole } from '@/enums'
import { getErrorKey } from '@/lib/api-error'
import { useAuthStore, useTenantStore } from '@/stores'
import type { Tenant, TenantUser } from '@/types'
import {
  useTenants,
  useCurrentTenant,
  useCreateTenant,
  useTenantUsers,
  useAddUser,
  useUpdateTenant,
  useDeleteTenant,
  useUpdateUser,
  useRemoveUser,
  useBlockUser,
  useUnblockUser,
  useRestoreUser,
} from './useAdmin'

export function useTenantConfigPage() {
  const t = useTranslations('admin')
  const tErrors = useTranslations()
  const { user } = useAuthStore()
  const { currentTenantId, setCurrentTenant, setTenants } = useTenantStore()

  const userRole = user?.role as UserRole | undefined
  const isGlobalAdmin = userRole === UserRole.GLOBAL_ADMIN
  const isTenantAdmin = userRole === UserRole.TENANT_ADMIN
  const canManageUsers = isGlobalAdmin || isTenantAdmin

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false)
  const [editTenantDialogOpen, setEditTenantDialogOpen] = useState(false)
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false)
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null)
  const [editingUser, setEditingUser] = useState<TenantUser | null>(null)

  // Only Global Admin fetches all tenants
  const {
    data: allTenantsData,
    isLoading: allTenantsLoading,
    isError: allTenantsError,
  } = useTenants(isGlobalAdmin)

  // Tenant Admin fetches only their own tenant
  const { data: currentTenantData, isLoading: currentTenantLoading } =
    useCurrentTenant(isTenantAdmin)

  // Merge into unified tenants data
  const tenantsData = useMemo(() => {
    if (isGlobalAdmin) {
      return allTenantsData
    }
    if (currentTenantData?.data) {
      return { data: [currentTenantData.data] }
    }
    return
  }, [isGlobalAdmin, allTenantsData, currentTenantData])

  const tenantsLoading = isGlobalAdmin ? allTenantsLoading : currentTenantLoading
  const tenantsError = isGlobalAdmin ? allTenantsError : false

  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
  } = useTenantUsers(currentTenantId)

  const createTenant = useCreateTenant()
  const addUser = useAddUser()
  const updateTenant = useUpdateTenant()
  const deleteTenant = useDeleteTenant()
  const updateUser = useUpdateUser()
  const removeUser = useRemoveUser()
  const blockUser = useBlockUser()
  const unblockUser = useUnblockUser()
  const restoreUser = useRestoreUser()

  useEffect(() => {
    if (tenantsData?.data) {
      setTenants(tenantsData.data)
    }
  }, [tenantsData?.data, setTenants])

  // Auto-select tenant for Tenant Admin
  useEffect(() => {
    if (isTenantAdmin && currentTenantData?.data && currentTenantId.length === 0) {
      setCurrentTenant(currentTenantData.data.id)
    }
  }, [isTenantAdmin, currentTenantData?.data, currentTenantId, setCurrentTenant])

  const handleCreateTenant = useCallback(
    (formData: CreateTenantFormValues) => {
      createTenant.mutate(
        { name: formData.name, slug: formData.slug },
        {
          onSuccess: () => {
            setCreateDialogOpen(false)
            Toast.success(t('tenants.tenantCreated'))
          },
          onError: (error: unknown) => {
            Toast.error(tErrors(getErrorKey(error)))
          },
        }
      )
    },
    [createTenant, t, tErrors]
  )

  const handleAddUser = useCallback(
    (formData: AddUserFormValues) => {
      addUser.mutate(
        {
          tenantId: currentTenantId,
          data: {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
          },
        },
        {
          onSuccess: () => {
            setAddUserDialogOpen(false)
            Toast.success(t('users.userCreated'))
          },
          onError: (error: unknown) => {
            Toast.error(tErrors(getErrorKey(error)))
          },
        }
      )
    },
    [addUser, currentTenantId, t, tErrors]
  )

  const handleTenantClick = useCallback(
    (tenant: Tenant) => {
      setCurrentTenant(tenant.id)
    },
    [setCurrentTenant]
  )

  const handleEditTenant = useCallback((tenant: Tenant) => {
    setEditingTenant(tenant)
    setEditTenantDialogOpen(true)
  }, [])

  const handleEditTenantSubmit = useCallback(
    (formData: EditTenantFormValues) => {
      if (!editingTenant) {
        return
      }
      updateTenant.mutate(
        { tenantId: editingTenant.id, data: { name: formData.name } },
        {
          onSuccess: () => {
            setEditTenantDialogOpen(false)
            setEditingTenant(null)
            Toast.success(t('tenants.tenantUpdated'))
          },
          onError: (error: unknown) => {
            Toast.error(tErrors(getErrorKey(error)))
          },
        }
      )
    },
    [editingTenant, updateTenant, t, tErrors]
  )

  const handleDeleteTenant = useCallback(
    async (tenant: Tenant) => {
      const confirmed = await SweetAlertDialog.show({
        title: t('tenants.deleteTenant'),
        text: t('tenants.confirmDeleteTenant'),
        icon: SweetAlertIcon.WARNING,
      })

      if (!confirmed) {
        return
      }

      deleteTenant.mutate(tenant.id, {
        onSuccess: () => {
          if (currentTenantId === tenant.id) {
            setCurrentTenant('')
          }
          Toast.success(t('tenants.tenantDeleted'))
        },
        onError: (error: unknown) => {
          Toast.error(tErrors(getErrorKey(error)))
        },
      })
    },
    [deleteTenant, currentTenantId, setCurrentTenant, t, tErrors]
  )

  const handleEditUser = useCallback((tenantUser: TenantUser) => {
    setEditingUser(tenantUser)
    setEditUserDialogOpen(true)
  }, [])

  const handleEditUserSubmit = useCallback(
    (data: { name: string; role: string; password?: string }) => {
      if (!editingUser) {
        return
      }
      const payload: { name?: string; role?: string; password?: string } = {
        name: data.name,
        role: data.role,
      }
      if (data.password && data.password.length > 0) {
        payload.password = data.password
      }
      updateUser.mutate(
        { tenantId: currentTenantId, userId: editingUser.id, data: payload },
        {
          onSuccess: () => {
            setEditUserDialogOpen(false)
            setEditingUser(null)
            Toast.success(t('users.userUpdated'))
          },
          onError: (error: unknown) => {
            Toast.error(tErrors(getErrorKey(error)))
          },
        }
      )
    },
    [editingUser, updateUser, currentTenantId, t, tErrors]
  )

  const handleRemoveUser = useCallback(
    async (tenantUser: TenantUser) => {
      const confirmed = await SweetAlertDialog.show({
        title: t('users.removeUser'),
        text: t('users.confirmRemoveUser'),
        icon: SweetAlertIcon.WARNING,
      })

      if (!confirmed) {
        return
      }

      removeUser.mutate(
        { tenantId: currentTenantId, userId: tenantUser.id },
        {
          onSuccess: () => {
            Toast.success(t('users.userRemoved'))
          },
          onError: (error: unknown) => {
            Toast.error(tErrors(getErrorKey(error)))
          },
        }
      )
    },
    [removeUser, currentTenantId, t, tErrors]
  )

  const handleBlockUser = useCallback(
    async (tenantUser: TenantUser) => {
      const confirmed = await SweetAlertDialog.show({
        title: t('users.blockUser'),
        text: t('users.confirmBlockUser'),
        icon: SweetAlertIcon.WARNING,
      })

      if (!confirmed) {
        return
      }

      blockUser.mutate(
        { tenantId: currentTenantId, userId: tenantUser.id },
        {
          onSuccess: () => {
            Toast.success(t('users.userBlocked'))
          },
          onError: (error: unknown) => {
            Toast.error(tErrors(getErrorKey(error)))
          },
        }
      )
    },
    [blockUser, currentTenantId, t, tErrors]
  )

  const handleUnblockUser = useCallback(
    async (tenantUser: TenantUser) => {
      const confirmed = await SweetAlertDialog.show({
        title: t('users.unblockUser'),
        text: t('users.confirmUnblockUser'),
        icon: SweetAlertIcon.QUESTION,
      })

      if (!confirmed) {
        return
      }

      unblockUser.mutate(
        { tenantId: currentTenantId, userId: tenantUser.id },
        {
          onSuccess: () => {
            Toast.success(t('users.userUnblocked'))
          },
          onError: (error: unknown) => {
            Toast.error(tErrors(getErrorKey(error)))
          },
        }
      )
    },
    [unblockUser, currentTenantId, t, tErrors]
  )

  const handleRestoreUser = useCallback(
    async (tenantUser: TenantUser) => {
      const confirmed = await SweetAlertDialog.show({
        title: t('users.restoreUser'),
        text: t('users.confirmRestoreUser'),
        icon: SweetAlertIcon.QUESTION,
      })

      if (!confirmed) {
        return
      }

      restoreUser.mutate(
        { tenantId: currentTenantId, userId: tenantUser.id },
        {
          onSuccess: () => {
            Toast.success(t('users.userRestored'))
          },
          onError: (error: unknown) => {
            Toast.error(tErrors(getErrorKey(error)))
          },
        }
      )
    },
    [restoreUser, currentTenantId, t, tErrors]
  )

  return {
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
    createTenantPending: createTenant.isPending,
    addUserPending: addUser.isPending,
    updateTenantPending: updateTenant.isPending,
    updateUserPending: updateUser.isPending,
    handleCreateTenant,
    handleAddUser,
    handleTenantClick,
    handleEditTenant,
    handleEditTenantSubmit,
    handleDeleteTenant,
    handleEditUser,
    handleEditUserSubmit,
    handleRemoveUser,
    currentUserId: user?.sub ?? '',
    handleBlockUser,
    handleUnblockUser,
    handleRestoreUser,
  }
}
