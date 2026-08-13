import { ContactPublicPage } from '@/components/marketing/contact-public-page.component'
import { PublicShell } from '@/components/marketing/public-shell.component'
import { MARKETING_PAGES } from '@/lib/constants/marketing'
import { buildPublicMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

const page = MARKETING_PAGES.find(item => item.path === '/contact')
export const metadata: Metadata = page ? buildPublicMetadata(page, 'en') : {}

export default function ContactPage() {
  return (
    <PublicShell locale="en" currentPath="/contact">
      <ContactPublicPage locale="en" />
    </PublicShell>
  )
}
