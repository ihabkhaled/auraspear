import type { ContactStatus } from '@/enums'
import type { TranslationFn } from './common.types'

export interface ContactFormValues {
  email: string
  subject: string
  message: string
}

export interface ContactResponse {
  sent: true
}

export interface ContactStatusDisplay {
  isSending: boolean
  submitLabel: string
  statusLabel: string
}

export interface ContactFormProps {
  status: ContactStatus
  submitLabel: string
  statusLabel: string
  emailPlaceholder?: string | undefined
  subjectPlaceholder?: string | undefined
  messagePlaceholder?: string | undefined
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export interface ContactFormPlaceholders {
  emailPlaceholder?: string | undefined
  subjectPlaceholder?: string | undefined
  messagePlaceholder?: string | undefined
}

export interface MarketingNavProps {
  t: TranslationFn
}

export interface MarketingFooterProps {
  t: TranslationFn
}

export interface MarketingHeroProps {
  t: TranslationFn
}

export interface MarketingFeaturesProps {
  t: TranslationFn
}
