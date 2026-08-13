'use client'

import { useContactForm } from '@/hooks'
import type { ContactFormPlaceholders } from '@/types'
import { ContactForm } from './contact-form.component'

export function ContactFormContainer({
  emailPlaceholder,
  subjectPlaceholder,
  messagePlaceholder,
}: ContactFormPlaceholders = {}) {
  const formProps = useContactForm()
  return (
    <ContactForm
      {...formProps}
      emailPlaceholder={emailPlaceholder}
      subjectPlaceholder={subjectPlaceholder}
      messagePlaceholder={messagePlaceholder}
    />
  )
}
