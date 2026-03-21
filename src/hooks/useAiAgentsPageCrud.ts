'use client'

import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { getErrorKey } from '@/lib/api-error'
import type {
  AiAgentsPageDialogsReturn,
  CreateAiAgentFormValues,
  EditAiAgentFormValues,
} from '@/types'
import { useCreateAiAgent, useUpdateAiAgent, useDeleteAiAgent } from './useAiAgents'

export function useAiAgentsPageCrud(dialogs: AiAgentsPageDialogsReturn) {
  const t = useTranslations('aiAgents')
  const tErrors = useTranslations('errors')

  const createMutation = useCreateAiAgent()
  const updateMutation = useUpdateAiAgent()
  const deleteMutation = useDeleteAiAgent()

  const handleCreateSubmit = useCallback(
    (formData: CreateAiAgentFormValues) => {
      createMutation.mutate(formData as unknown as Record<string, unknown>, {
        onSuccess: () => {
          Toast.success(t('createSuccess'))
          dialogs.setCreateDialogOpen(false)
        },
        onError: (error: unknown) => {
          Toast.error(tErrors(getErrorKey(error)))
        },
      })
    },
    [createMutation, t, tErrors, dialogs]
  )

  const handleEditSubmit = useCallback(
    (formData: EditAiAgentFormValues) => {
      if (!dialogs.editAgent) return
      updateMutation.mutate(
        { id: dialogs.editAgent.id, data: formData as unknown as Record<string, unknown> },
        {
          onSuccess: () => {
            Toast.success(t('updateSuccess'))
            dialogs.setEditDialogOpen(false)
            dialogs.setEditAgent(null)
          },
          onError: (error: unknown) => {
            Toast.error(tErrors(getErrorKey(error)))
          },
        }
      )
    },
    [dialogs, updateMutation, t, tErrors]
  )

  const handleDeleteConfirm = useCallback(
    (agentId: string) => {
      deleteMutation.mutate(agentId, {
        onSuccess: () => {
          Toast.success(t('deleteSuccess'))
          if (dialogs.selectedAgentId === agentId) {
            dialogs.setSelectedAgentId(null)
          }
        },
        onError: (error: unknown) => {
          Toast.error(tErrors(getErrorKey(error)))
        },
      })
    },
    [deleteMutation, dialogs, t, tErrors]
  )

  return {
    handleCreateSubmit,
    handleEditSubmit,
    handleDeleteConfirm,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
