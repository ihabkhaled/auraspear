'use client'

import { useContactForm } from '@/hooks'
import { ContactForm } from './contact-form.component'

export function ContactFormContainer() {
  const props = useContactForm()
  return <ContactForm {...props} />
}
