import { ContactPublicPage } from '@/components/marketing/contact-public-page.component'
import { PublicShell } from '@/components/marketing/public-shell.component'
import { buildLanguageAlternates } from '@/lib/marketing.utils'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Request an AuraSpear demo',
  description:
    'Contact AuraSpear for a security operations platform demo, integrations discussion, or deployment questions.',
  alternates: { canonical: '/contact', languages: buildLanguageAlternates('/contact') },
}

export default function ContactPage() {
  return (
    <PublicShell locale="en" currentPath="/contact">
      <ContactPublicPage locale="en" />
    </PublicShell>
  )
}
