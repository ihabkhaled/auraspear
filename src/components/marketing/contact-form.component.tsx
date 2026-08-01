import { Button, Input, Textarea } from '@/components/ui'
import { ContactStatus } from '@/enums'
import {
  CONTACT_EMAIL_MAX_LENGTH,
  CONTACT_MESSAGE_MAX_LENGTH,
  CONTACT_MESSAGE_MIN_LENGTH,
  CONTACT_SUBJECT_MAX_LENGTH,
  CONTACT_SUBJECT_MIN_LENGTH,
} from '@/lib/constants/contact'
import type { ContactFormProps } from '@/types'

export function ContactForm({ status, submitLabel, statusLabel, onSubmit }: ContactFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input
        type="email"
        name="email"
        placeholder="you@company.com"
        required
        maxLength={CONTACT_EMAIL_MAX_LENGTH}
      />
      <Input
        type="text"
        name="subject"
        placeholder="Subject"
        required
        minLength={CONTACT_SUBJECT_MIN_LENGTH}
        maxLength={CONTACT_SUBJECT_MAX_LENGTH}
      />
      <Textarea
        name="message"
        placeholder="Your message"
        required
        minLength={CONTACT_MESSAGE_MIN_LENGTH}
        maxLength={CONTACT_MESSAGE_MAX_LENGTH}
        rows={6}
      />
      <Button type="submit" disabled={status === ContactStatus.SENDING}>
        {submitLabel}
      </Button>
      {statusLabel ? (
        <p role="status" aria-live="polite" className="text-muted-foreground text-sm">
          {statusLabel}
        </p>
      ) : null}
    </form>
  )
}
