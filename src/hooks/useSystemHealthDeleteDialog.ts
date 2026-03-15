import { useTranslations } from 'next-intl'
import { SweetAlertDialog, SweetAlertIcon } from '@/components/common'
import type { SystemHealthDeleteDialogProps } from '@/types'

export function useSystemHealthDeleteDialog({
  serviceName,
  onConfirm,
}: Pick<SystemHealthDeleteDialogProps, 'serviceName' | 'onConfirm'>) {
  const t = useTranslations('systemHealth')
  const tCommon = useTranslations('common')

  const handleDelete = async () => {
    const confirmed = await SweetAlertDialog.show({
      text: t('confirmDeleteService', { name: serviceName }),
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
