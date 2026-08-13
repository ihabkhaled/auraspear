import { PublicPage } from '@/components/marketing/public-page.component'
import { PublicShell } from '@/components/marketing/public-shell.component'
import { MARKETING_PAGES } from '@/lib/constants/marketing'
import { buildLanguageAlternates } from '@/lib/marketing.utils'
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'AuraSpear SOC — Unified AI-Powered Security Operations',
  description: MARKETING_PAGES[0]?.description,
  alternates: { canonical: '/', languages: buildLanguageAlternates('/') },
}
export default function LandingPage() {
  const page = MARKETING_PAGES[0]
  if (!page) return null
  return (
    <PublicShell locale="en">
      <PublicPage page={page} locale="en" />
    </PublicShell>
  )
}
