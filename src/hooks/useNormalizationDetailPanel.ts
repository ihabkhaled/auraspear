import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import type { UseNormalizationDetailPanelParams } from '@/types'

export function useNormalizationDetailPanel({
  pipeline,
  onEdit,
  onDelete,
}: UseNormalizationDetailPanelParams) {
  const t = useTranslations('normalization')
  const tCommon = useTranslations('common')

  const hasData = pipeline !== null

  const handleEdit = useCallback(() => {
    if (pipeline && onEdit) {
      onEdit(pipeline)
    }
  }, [pipeline, onEdit])

  const handleDelete = useCallback(() => {
    if (pipeline && onDelete) {
      onDelete(pipeline)
    }
  }, [pipeline, onDelete])

  return {
    t,
    tCommon,
    hasData,
    handleEdit,
    handleDelete,
    hasEditAction: Boolean(onEdit),
    hasDeleteAction: Boolean(onDelete),
  }
}
