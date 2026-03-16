'use client'

import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { safeJsonParse } from '@/lib/utils'
import type { CreateReportFormValues, EditReportFormValues } from '@/types'
import { useCreateReport, useUpdateReport, useDeleteReport } from './useReports'
import type { ReportsPageDialogsReturn } from './useReportsPageDialogs'

export function useReportsPageCrud(dialogs: ReportsPageDialogsReturn) {
  const t = useTranslations('reports')

  const createMutation = useCreateReport()
  const updateMutation = useUpdateReport()
  const deleteMutation = useDeleteReport()

  const handleCreate = useCallback(
    (formData: CreateReportFormValues) => {
      const payload: Record<string, unknown> = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        format: formData.format,
      }
      if (formData.parameters.trim().length > 0) {
        payload['parameters'] = safeJsonParse<Record<string, unknown>>(formData.parameters, {})
      }
      createMutation.mutate(payload, {
        onSuccess: () => {
          Toast.success(t('createSuccess'))
          dialogs.setCreateOpen(false)
        },
        onError: () => {
          Toast.error(t('createError'))
        },
      })
    },
    [createMutation, t, dialogs]
  )

  const handleEdit = useCallback(
    (formData: EditReportFormValues) => {
      if (!dialogs.selectedReport) {
        return
      }
      const payload: Record<string, unknown> = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        format: formData.format,
      }
      if (formData.parameters.trim().length > 0) {
        payload['parameters'] = safeJsonParse<Record<string, unknown>>(formData.parameters, {})
      }
      updateMutation.mutate(
        { id: dialogs.selectedReport.id, data: payload },
        {
          onSuccess: () => {
            Toast.success(t('updateSuccess'))
            dialogs.setEditOpen(false)
          },
          onError: () => {
            Toast.error(t('updateError'))
          },
        }
      )
    },
    [updateMutation, dialogs, t]
  )

  const handleDelete = useCallback(
    (id: string) => {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          Toast.success(t('deleteSuccess'))
          dialogs.setDeleteReportId(null)
        },
        onError: () => {
          Toast.error(t('deleteError'))
        },
      })
    },
    [deleteMutation, t, dialogs]
  )

  return {
    handleCreate,
    handleEdit,
    handleDelete,
    createLoading: createMutation.isPending,
    editLoading: updateMutation.isPending,
  }
}
