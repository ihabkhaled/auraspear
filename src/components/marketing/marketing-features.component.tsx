import type { MarketingFeaturesProps } from '@/types'

export function MarketingFeatures({ t }: MarketingFeaturesProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h2 className="text-foreground mb-8 text-center text-2xl font-bold sm:text-3xl">
        {t('marketing.features.title')}
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-card border-border rounded-lg border p-6">
          <h3 className="text-foreground mb-2 font-semibold">
            {t('marketing.features.detection.title')}
          </h3>
          <p className="text-muted-foreground text-sm">
            {t('marketing.features.detection.description')}
          </p>
        </div>
        <div className="bg-card border-border rounded-lg border p-6">
          <h3 className="text-foreground mb-2 font-semibold">{t('marketing.features.ai.title')}</h3>
          <p className="text-muted-foreground text-sm">{t('marketing.features.ai.description')}</p>
        </div>
        <div className="bg-card border-border rounded-lg border p-6">
          <h3 className="text-foreground mb-2 font-semibold">
            {t('marketing.features.response.title')}
          </h3>
          <p className="text-muted-foreground text-sm">
            {t('marketing.features.response.description')}
          </p>
        </div>
      </div>
    </section>
  )
}
