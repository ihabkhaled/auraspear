import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Toast, SweetAlertDialog, SweetAlertIcon } from '@/components/common'
import { CaseSeverity, type CaseStatus, CaseTaskStatus, SortOrder, UserRole } from '@/enums'
import { getErrorKey } from '@/lib/api-error'
import { hasRole } from '@/lib/roles'
import { useAuthStore } from '@/stores'
import type { EditCaseFormValues } from '@/types'
import { useCreateCaseArtifact, useDeleteCaseArtifact } from './useCaseArtifacts'
import { useCaseCycles } from './useCaseCycles'
import { useCase, useTenantMembers, useUpdateCase } from './useCases'
import { useCreateCaseTask, useUpdateCaseTask, useDeleteCaseTask } from './useCaseTasks'

export function useCaseDetailPage(id: string) {
  const t = useTranslations('cases')
  const router = useRouter()

  const { data, isLoading, isError } = useCase(id)
  const updateCase = useUpdateCase()
  const updateTask = useUpdateCaseTask(id)
  const createTask = useCreateCaseTask(id)
  const deleteTask = useDeleteCaseTask(id)
  const createArtifact = useCreateCaseArtifact(id)
  const deleteArtifact = useDeleteCaseArtifact(id)
  const { data: membersData } = useTenantMembers()
  const { data: cyclesData } = useCaseCycles({
    limit: 100,
    sortBy: 'createdAt',
    sortOrder: SortOrder.DESC,
  })
  const user = useAuthStore(s => s.user)
  const currentUserId = user?.sub ?? ''
  const isAdmin = user?.role ? hasRole(user.role, UserRole.TENANT_ADMIN) : false

  const caseItem = data?.data
  const members = membersData?.data ?? []
  const cycles = (cyclesData?.data ?? []).map(c => ({ id: c.id, name: c.name, status: c.status }))

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)

  const ownerName = caseItem?.ownerName ?? undefined

  const editInitialValues = useMemo(
    () => ({
      title: caseItem?.title ?? '',
      description: caseItem?.description ?? '',
      severity: caseItem?.severity ?? CaseSeverity.MEDIUM,
    }),
    [caseItem?.title, caseItem?.description, caseItem?.severity]
  )

  const handleStatusChange = useCallback(
    (status: CaseStatus) => {
      updateCase.mutate(
        { id, data: { status } },
        {
          onSuccess: () => {
            Toast.success(t('statusUpdated'))
          },
          onError: (error: unknown) => {
            Toast.error(t(getErrorKey(error)))
          },
        }
      )
    },
    [id, updateCase, t]
  )

  const handleAssigneeChange = useCallback(
    (userId: string | null) => {
      updateCase.mutate(
        { id, data: { ownerUserId: userId } },
        {
          onSuccess: () => {
            Toast.success(t('assigneeUpdated'))
          },
          onError: (error: unknown) => {
            Toast.error(t(getErrorKey(error)))
          },
        }
      )
    },
    [id, updateCase, t]
  )

  const handleCycleChange = useCallback(
    (cycleId: string | null) => {
      updateCase.mutate(
        { id, data: { cycleId } },
        {
          onSuccess: () => {
            Toast.success(t('cycleUpdated'))
          },
          onError: (error: unknown) => {
            Toast.error(t(getErrorKey(error)))
          },
        }
      )
    },
    [id, updateCase, t]
  )

  const handleEditClick = useCallback(() => {
    setEditDialogOpen(true)
  }, [])

  const handleEditSubmit = useCallback(
    (formData: EditCaseFormValues) => {
      updateCase.mutate(
        {
          id,
          data: {
            title: formData.title,
            description: formData.description,
            severity: formData.severity,
          },
        },
        {
          onSuccess: () => {
            setEditDialogOpen(false)
            Toast.success(t('caseUpdated'))
          },
          onError: (error: unknown) => {
            Toast.error(t(getErrorKey(error)))
          },
        }
      )
    },
    [id, updateCase, t]
  )

  const handleToggleTask = useCallback(
    (taskId: string, completed: boolean) => {
      updateTask.mutate(
        {
          taskId,
          data: {
            status: completed ? CaseTaskStatus.COMPLETED : CaseTaskStatus.PENDING,
          },
        },
        {
          onSuccess: () => {
            Toast.success(t('taskUpdated'))
          },
          onError: (error: unknown) => {
            Toast.error(t(getErrorKey(error)))
          },
        }
      )
    },
    [updateTask, t]
  )

  const handleAddTask = useCallback(
    (title: string) => {
      createTask.mutate(
        { title },
        {
          onSuccess: () => {
            Toast.success(t('taskAdded'))
          },
          onError: (error: unknown) => {
            Toast.error(t(getErrorKey(error)))
          },
        }
      )
    },
    [createTask, t]
  )

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      const confirmed = await SweetAlertDialog.show({
        text: t('confirmDeleteTask'),
        icon: SweetAlertIcon.QUESTION,
      })
      if (!confirmed) {
        return
      }
      deleteTask.mutate(taskId, {
        onSuccess: () => {
          Toast.success(t('taskDeleted'))
        },
        onError: (error: unknown) => {
          Toast.error(t(getErrorKey(error)))
        },
      })
    },
    [deleteTask, t]
  )

  const handleAddArtifact = useCallback(
    (artifactData: { type: string; value: string; source?: string }) => {
      createArtifact.mutate(artifactData, {
        onSuccess: () => {
          Toast.success(t('artifactAdded'))
        },
        onError: (error: unknown) => {
          Toast.error(t(getErrorKey(error)))
        },
      })
    },
    [createArtifact, t]
  )

  const handleDeleteArtifact = useCallback(
    async (artifactId: string) => {
      const confirmed = await SweetAlertDialog.show({
        text: t('confirmDeleteArtifact'),
        icon: SweetAlertIcon.QUESTION,
      })
      if (!confirmed) {
        return
      }
      deleteArtifact.mutate(artifactId, {
        onSuccess: () => {
          Toast.success(t('artifactDeleted'))
        },
        onError: (error: unknown) => {
          Toast.error(t(getErrorKey(error)))
        },
      })
    },
    [deleteArtifact, t]
  )

  const toggleDescription = useCallback(() => {
    setDescriptionExpanded(prev => !prev)
  }, [])

  return {
    t,
    router,
    isLoading,
    isError,
    caseItem,
    members,
    cycles,
    currentUserId,
    isAdmin,
    ownerName,
    editDialogOpen,
    setEditDialogOpen,
    descriptionExpanded,
    toggleDescription,
    editInitialValues,
    updateCasePending: updateCase.isPending,
    createTaskPending: createTask.isPending,
    createArtifactPending: createArtifact.isPending,
    handleStatusChange,
    handleAssigneeChange,
    handleCycleChange,
    handleEditClick,
    handleEditSubmit,
    handleToggleTask,
    handleAddTask,
    handleDeleteTask,
    handleAddArtifact,
    handleDeleteArtifact,
  }
}
