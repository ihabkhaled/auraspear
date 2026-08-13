import { SUPPORTED_LOCALES } from '@/lib/constants/locales'
import { MARKETING_PAGES } from '@/lib/constants/marketing'
import { PUBLIC_SITE_URL } from '@/lib/constants/seo'
import { buildLanguageAlternates, buildPublicPath } from '@/lib/marketing.utils'

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export function GET() {
  const urls = SUPPORTED_LOCALES.flatMap(locale =>
    MARKETING_PAGES.map(page => {
      const url = `${PUBLIC_SITE_URL}${buildPublicPath(locale, page.path)}`
      const alternates = Object.entries(buildLanguageAlternates(page.path))
        .map(
          ([language, path]) =>
            `    <xhtml:link rel="alternate" hreflang="${language}" href="${escapeXml(`${PUBLIC_SITE_URL}${path}`)}" />`
        )
        .join('\n')
      return [
        '  <url>',
        `    <loc>${escapeXml(url)}</loc>`,
        alternates,
        '    <lastmod>2026-08-14</lastmod>',
        `    <changefreq>${page.path === '/' ? 'weekly' : 'monthly'}</changefreq>`,
        `    <priority>${page.path === '/' ? '1.0' : '0.8'}</priority>`,
        '  </url>',
      ].join('\n')
    })
  ).join('\n')

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urls,
    '</urlset>',
  ].join('\n')

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
