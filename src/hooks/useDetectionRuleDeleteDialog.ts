import { useTranslations } from 'next-intl'
import { SweetAlertDialog, SweetAlertIcon } from '@/components/common'
import type { DetectionRuleDeleteDialogProps } from '@/types'

export function useDetectionRuleDeleteDialog({
  ruleName,
  onConfirm,
}: Pick<DetectionRuleDeleteDialogProps, 'ruleName' | 'onConfirm'>) {
  const t = useTranslations('detectionRules')
  const tCommon = useTranslations('common')

  const handleDelete = async () => {
    const confirmed = await SweetAlertDialog.show({
      text: t('confirmDeleteRule', { name: ruleName }),
      icon: SweetAlertIcon.WARNING,
      confirmButtonText: tCommon('delete'),
      cancelButtonText: tCommon('cancel'),
    })
    if (confirmed) {
      onConfirm()
    }
  }

  return { t, handleDelete }
}
