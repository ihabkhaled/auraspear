import { PublicPage } from '@/components/marketing/public-page.component'
import { PublicShell } from '@/components/marketing/public-shell.component'
import { MARKETING_PAGES } from '@/lib/constants/marketing'
import { buildLanguageAlternates } from '@/lib/marketing.utils'
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'About AuraSpear',
  description: 'Meet the mission and engineering principles behind AuraSpear SOC.',
  alternates: { canonical: '/about', languages: buildLanguageAlternates('/about') },
}
export default function AboutPage() {
  const page = MARKETING_PAGES.find(item => item.path === '/about')
  if (!page) return null
  return (
    <PublicShell locale="en" currentPath={page.path}>
      <PublicPage page={page} locale="en" />
    </PublicShell>
  )
}
