import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { SweetAlertDialog, SweetAlertIcon } from '@/components/common'
import type { SoarRunDialogProps } from '@/types'

export function useSoarRunDialog({ playbookId, playbookName, onConfirm }: SoarRunDialogProps) {
  const t = useTranslations('soar')

  const handleRun = useCallback(async () => {
    if (!playbookId) {
      return
    }

    const confirmed = await SweetAlertDialog.show({
      title: t('runTitle'),
      text: t('runWarning', { name: playbookName }),
      icon: SweetAlertIcon.QUESTION,
      confirmButtonText: t('runConfirm'),
      cancelButtonText: t('cancelButton'),
    })

    if (confirmed) {
      onConfirm(playbookId)
    }
  }, [playbookId, playbookName, onConfirm, t])

  return { handleRun }
}
