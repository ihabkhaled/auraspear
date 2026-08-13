import { notFound } from 'next/navigation'
import { PublicPage } from '@/components/marketing/public-page.component'
import { PublicShell } from '@/components/marketing/public-shell.component'
import { MARKETING_PAGES } from '@/lib/constants/marketing'
import { buildLanguageAlternates } from '@/lib/marketing.utils'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return MARKETING_PAGES.filter(page => page.path.startsWith('/features/')).map(page => ({
    slug: page.path.split('/').at(-1),
  }))
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = MARKETING_PAGES.find(item => item.path === `/features/${slug}`)
  if (!page) return {}
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.path, languages: buildLanguageAlternates(page.path) },
  }
}
export default async function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = MARKETING_PAGES.find(item => item.path === `/features/${slug}`)
  if (!page) notFound()
  return (
    <PublicShell locale="en" currentPath={page.path}>
      <PublicPage page={page} locale="en" />
    </PublicShell>
  )
}
