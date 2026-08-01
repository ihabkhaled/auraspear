import Link from 'next/link'
import { Button } from '@/components/ui'
import type { MarketingHeroProps } from '@/types'

export function MarketingHero({ t }: MarketingHeroProps) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24">
      <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-5xl">
        {t('marketing.hero.title')}
      </h1>
      <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-base sm:text-lg">
        {t('marketing.hero.subtitle')}
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/login">{t('marketing.hero.cta')}</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/contact">{t('marketing.hero.ctaSecondary')}</Link>
        </Button>
      </div>
    </section>
  )
}
