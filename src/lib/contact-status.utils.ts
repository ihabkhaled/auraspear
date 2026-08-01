import { ContactStatus } from '@/enums'
import type { ContactStatusDisplay, TranslationFn } from '@/types'

export function resolveContactStatusDisplay(
  status: ContactStatus,
  t: TranslationFn
): ContactStatusDisplay {
  const isSending = status === ContactStatus.SENDING
  const submitLabel = isSending ? t('contact.form.sending') : t('contact.form.submit')

  if (status === ContactStatus.SENT) {
    return { isSending, submitLabel, statusLabel: t('contact.form.success') }
  }
  if (status === ContactStatus.ERROR) {
    return { isSending, submitLabel, statusLabel: t('contact.form.error') }
  }
  return { isSending, submitLabel, statusLabel: '' }
}
