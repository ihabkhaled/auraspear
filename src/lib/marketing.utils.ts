import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/lib/constants/locales'
import { MARKETING_PAGES } from '@/lib/constants/marketing'
import { getMarketingContent } from '@/lib/marketing-content'
import type { MarketingPage } from '@/types/marketing.types'

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export function isRtlLocale(locale: string): boolean {
  return locale === 'ar' || locale === 'fa'
}

export function buildPublicPath(locale: SupportedLocale, path: string): string {
  const normalized = path === '/' ? '' : `/${path.replaceAll(/^\/+|\/+$/g, '')}`
  return locale === DEFAULT_LOCALE ? normalized || '/' : `/${locale}${normalized}`
}

export function normalizePublicPath(path: string): string {
  const normalized = path.replace(/^\/en(?=\/|$)/, '')
  return normalized || '/'
}

export function buildLanguageAlternates(path: string): Record<string, string> {
  const alternates = Object.fromEntries(
    SUPPORTED_LOCALES.map(locale => [locale, buildPublicPath(locale, path)])
  )
  return { ...alternates, 'x-default': buildPublicPath(DEFAULT_LOCALE, path) }
}

export function toAppPath(path: string): string {
  if (path.startsWith('/app/')) return path
  if (path === '/app') return '/app/dashboard'
  if (path === '/') return '/app/dashboard'
  return `/app/${path.replace(/^\/+/, '')}`
}

export function resolveLocalizedMarketingPage(locale: string, slug?: string[]) {
  const path = slug?.length ? `/${slug.join('/')}` : '/'
  const supportedLocale = SUPPORTED_LOCALES.find(item => item === locale)
  const page = MARKETING_PAGES.find(item => item.path === path)
  return { path, locale: supportedLocale, page }
}

export function resolveDocumentLocale(pathname: string, cookieLocale?: string): SupportedLocale {
  if (pathname === '/app' || pathname.startsWith('/app/')) {
    return SUPPORTED_LOCALES.find(locale => locale === cookieLocale) ?? DEFAULT_LOCALE
  }
  const segment = pathname.split('/')[1]
  return (
    SUPPORTED_LOCALES.find(locale => locale !== DEFAULT_LOCALE && locale === segment) ??
    DEFAULT_LOCALE
  )
}

export function localizeMarketingPage(page: MarketingPage, locale: SupportedLocale): MarketingPage {
  return getMarketingContent(locale).pages[page.path] ?? page
}
