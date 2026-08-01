import { MarketingFooter } from '@/components/marketing/marketing-footer.component'
import { MarketingNav } from '@/components/marketing/marketing-nav.component'
import { getServerTranslator } from '@/lib/server-translations'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getServerTranslator()
  return {
    title: t('marketing.about.metaTitle'),
    description: t('marketing.about.metaDescription'),
    openGraph: {
      title: t('marketing.about.metaTitle'),
      description: t('marketing.about.metaDescription'),
      url: '/about',
    },
    alternates: { canonical: '/about' },
  }
}

export default async function AboutPage() {
  const t = await getServerTranslator()

  return (
    <>
      <MarketingNav t={t} />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-foreground mb-6 text-3xl font-bold">{t('marketing.about.title')}</h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          {t('marketing.about.body')}
        </p>
      </main>
      <MarketingFooter t={t} />
    </>
  )
}
