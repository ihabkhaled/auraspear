import { getTranslations } from 'next-intl/server'
import { ContactFormContainer } from '@/components/marketing/contact-form.container'
import { MarketingFooter } from '@/components/marketing/marketing-footer.component'
import { MarketingNav } from '@/components/marketing/marketing-nav.component'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  return {
    title: t('marketing.contact.metaTitle'),
    description: t('marketing.contact.metaDescription'),
    openGraph: {
      title: t('marketing.contact.metaTitle'),
      description: t('marketing.contact.metaDescription'),
      url: '/contact',
    },
    alternates: { canonical: '/contact' },
  }
}

export default async function ContactPage() {
  const t = await getTranslations()

  return (
    <>
      <MarketingNav t={t} />
      <main className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <h1 className="text-foreground mb-2 text-3xl font-bold">{t('marketing.contact.title')}</h1>
        <p className="text-muted-foreground mb-8 text-base">{t('marketing.contact.subtitle')}</p>
        <ContactFormContainer />
      </main>
      <MarketingFooter t={t} />
    </>
  )
}
