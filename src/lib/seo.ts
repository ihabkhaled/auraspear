import { LOCALES } from '@/lib/constants/locales'
import { CORE_SEO_KEYWORDS, PUBLIC_SITE_URL, SITE_NAME } from '@/lib/constants/seo'
import {
  buildLanguageAlternates,
  buildPublicPath,
  type SupportedLocale,
} from '@/lib/marketing.utils'
import type { MarketingPage } from '@/types/marketing.types'
import type { Metadata } from 'next'

export function buildPublicMetadata(page: MarketingPage, locale: SupportedLocale): Metadata {
  const path = buildPublicPath(locale, page.path)
  const keywords = [
    page.title,
    page.category,
    `${page.title} software`,
    `${page.title} platform`,
    ...page.capabilities,
    ...CORE_SEO_KEYWORDS,
  ]

  return {
    title: page.title,
    description: page.description,
    keywords,
    category: 'Cybersecurity',
    classification: 'Security Operations Software',
    alternates: {
      canonical: path,
      languages: buildLanguageAlternates(page.path),
      types: { 'application/rss+xml': '/feed.xml' },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: path,
      siteName: SITE_NAME,
      locale,
      alternateLocale: LOCALES.filter(item => item.code !== locale).map(item => item.code),
      type: 'website',
      images: [{ url: '/icons/icon-512.png', width: 512, height: 512, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: ['/icons/icon-512.png'],
    },
    other: {
      'content-language': locale,
      'application-name': SITE_NAME,
      'article:section': page.category,
    },
  }
}

export function serializeJsonLd(value: object): string {
  return JSON.stringify(value).replaceAll('<', '\\u003c')
}

export function publicPageJsonLd(page: MarketingPage, locale: SupportedLocale): object[] {
  const path = buildPublicPath(locale, page.path)
  const url = `${PUBLIC_SITE_URL}${path}`
  const segments = page.path.split('/').filter(Boolean)
  const breadcrumbs = [
    { '@type': 'ListItem', position: 1, name: SITE_NAME, item: PUBLIC_SITE_URL },
    ...segments.map((segment, index) => ({
      '@type': 'ListItem',
      position: index + 2,
      name: index === segments.length - 1 ? page.title : segment.replaceAll('-', ' '),
      item: `${PUBLIC_SITE_URL}${buildPublicPath(locale, `/${segments.slice(0, index + 1).join('/')}`)}`,
    })),
  ]

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: page.title,
      description: page.description,
      inLanguage: locale,
      isPartOf: { '@id': `${PUBLIC_SITE_URL}/#website` },
      about: { '@id': `${PUBLIC_SITE_URL}/#software` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs,
    },
  ]
}
