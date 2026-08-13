import { notFound, permanentRedirect } from 'next/navigation'
import { ContactPublicPage } from '@/components/marketing/contact-public-page.component'
import { PublicPage } from '@/components/marketing/public-page.component'
import { PublicShell } from '@/components/marketing/public-shell.component'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/lib/constants/locales'
import { MARKETING_PAGES } from '@/lib/constants/marketing'
import {
  isRtlLocale,
  localizeMarketingPage,
  resolveLocalizedMarketingPage,
  type SupportedLocale,
} from '@/lib/marketing.utils'
import { buildPublicMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return SUPPORTED_LOCALES.filter(locale => locale !== DEFAULT_LOCALE).flatMap(locale =>
    MARKETING_PAGES.map(page => ({
      locale,
      slug: page.path === '/' ? [] : page.path.slice(1).split('/'),
    }))
  )
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>
}): Promise<Metadata> {
  const values = await params
  const resolved = resolveLocalizedMarketingPage(values.locale, values.slug)
  if (!resolved.page || !resolved.locale) return {}
  const localizedPage = localizeMarketingPage(resolved.page, resolved.locale)
  return buildPublicMetadata(localizedPage, resolved.locale)
}
export default async function LocalizedPage({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>
}) {
  const values = await params
  const resolved = resolveLocalizedMarketingPage(values.locale, values.slug)
  if (values.locale === 'en') permanentRedirect(resolved.path)
  if (!resolved.page || !resolved.locale) notFound()
  const locale = resolved.locale as SupportedLocale
  const localizedPage = localizeMarketingPage(resolved.page, locale)
  return (
    <div lang={locale} dir={isRtlLocale(locale) ? 'rtl' : 'ltr'}>
      <PublicShell locale={locale} currentPath={resolved.path}>
        {resolved.path === '/contact' ? (
          <ContactPublicPage locale={locale} />
        ) : (
          <PublicPage page={localizedPage} locale={locale} />
        )}
      </PublicShell>
    </div>
  )
}
