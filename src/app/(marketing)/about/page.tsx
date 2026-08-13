import { PublicPage } from '@/components/marketing/public-page.component'
import { PublicShell } from '@/components/marketing/public-shell.component'
import { MARKETING_PAGES } from '@/lib/constants/marketing'
import { buildPublicMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
const page = MARKETING_PAGES.find(item => item.path === '/about')
export const metadata: Metadata = page ? buildPublicMetadata(page, 'en') : {}
export default function AboutPage() {
  if (!page) return null
  return (
    <PublicShell locale="en" currentPath={page.path}>
      <PublicPage page={page} locale="en" />
    </PublicShell>
  )
}
