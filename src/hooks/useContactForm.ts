import { useCallback, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ContactStatus } from '@/enums'
import { resolveContactStatusDisplay } from '@/lib/contact-status.utils'
import { ContactRequestSchema } from '@/lib/validation/contact.schema'
import { contactService } from '@/services'

export function useContactForm() {
  const t = useTranslations()
  const [status, setStatus] = useState<ContactStatus>(ContactStatus.IDLE)

  const onSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const target = event.currentTarget
    const formData = new FormData(target)
    const parsed = ContactRequestSchema.safeParse({
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    })

    if (!parsed.success) {
      setStatus(ContactStatus.ERROR)
      return
    }

    setStatus(ContactStatus.SENDING)
    contactService
      .send(parsed.data)
      .then(() => {
        setStatus(ContactStatus.SENT)
        target.reset()
      })
      .catch(() => {
        setStatus(ContactStatus.ERROR)
      })
  }, [])

  const display = resolveContactStatusDisplay(status, t)

  return {
    status,
    onSubmit,
    ...display,
  }
}
