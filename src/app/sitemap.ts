import { SUPPORTED_LOCALES } from '@/lib/constants/locales'
import { MARKETING_PAGES } from '@/lib/constants/marketing'
import { buildLanguageAlternates, buildPublicPath } from '@/lib/marketing.utils'
import type { MetadataRoute } from 'next'
const SITE_URL = 'https://auraspear-demo.vercel.app'
export default function sitemap(): MetadataRoute.Sitemap {
  return SUPPORTED_LOCALES.flatMap(locale =>
    MARKETING_PAGES.map(page => ({
      url: `${SITE_URL}${buildPublicPath(locale, page.path)}`,
      lastModified: new Date('2026-08-13'),
      changeFrequency: page.path === '/' ? ('weekly' as const) : ('monthly' as const),
      priority: page.path === '/' ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          Object.entries(buildLanguageAlternates(page.path)).map(([key, value]) => [
            key,
            `${SITE_URL}${value}`,
          ])
        ),
      },
    }))
  )
}
