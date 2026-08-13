import { notFound } from 'next/navigation'
import { PublicPage } from '@/components/marketing/public-page.component'
import { PublicShell } from '@/components/marketing/public-shell.component'
import { MARKETING_PAGES } from '@/lib/constants/marketing'
import { buildPublicMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
export function generateStaticParams() {
  return MARKETING_PAGES.filter(page => page.path.startsWith('/platform/')).map(page => ({
    slug: page.path.split('/').at(-1),
  }))
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = MARKETING_PAGES.find(item => item.path === `/platform/${slug}`)
  return page ? buildPublicMetadata(page, 'en') : {}
}
export default async function PlatformPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = MARKETING_PAGES.find(item => item.path === `/platform/${slug}`)
  if (!page) notFound()
  return (
    <PublicShell locale="en" currentPath={page.path}>
      <PublicPage page={page} locale="en" />
    </PublicShell>
  )
}
