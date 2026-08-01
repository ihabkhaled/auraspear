import { getTranslations } from 'next-intl/server'
import { MarketingFeatures } from '@/components/marketing/marketing-features.component'
import { MarketingFooter } from '@/components/marketing/marketing-footer.component'
import { MarketingHero } from '@/components/marketing/marketing-hero.component'
import { MarketingNav } from '@/components/marketing/marketing-nav.component'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  return {
    title: 'AuraSpear SOC — AI-Powered Security Operations',
    description: t('marketing.hero.subtitle'),
    openGraph: {
      title: 'AuraSpear SOC — AI-Powered Security Operations',
      description: t('marketing.hero.subtitle'),
      url: '/',
    },
    alternates: { canonical: '/' },
  }
}

export default async function LandingPage() {
  const t = await getTranslations()

  return (
    <>
      <MarketingNav t={t} />
      <main>
        <MarketingHero t={t} />
        <MarketingFeatures t={t} />
      </main>
      <MarketingFooter t={t} />
    </>
  )
}
