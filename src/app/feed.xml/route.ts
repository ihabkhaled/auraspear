import { SUPPORTED_LOCALES } from '@/lib/constants/locales'
import { MARKETING_PAGES } from '@/lib/constants/marketing'
import { PUBLIC_SITE_URL } from '@/lib/constants/seo'
import { buildPublicPath, localizeMarketingPage } from '@/lib/marketing.utils'
function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}
export function GET() {
  const items = SUPPORTED_LOCALES.flatMap(locale =>
    MARKETING_PAGES.map(page => {
      const localizedPage = localizeMarketingPage(page, locale)
      const url = `${PUBLIC_SITE_URL}${buildPublicPath(locale, page.path)}`
      return [
        '    <item>',
        `      <title>${escapeXml(localizedPage.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `      <description>${escapeXml(localizedPage.description)}</description>`,
        `      <category>${escapeXml(localizedPage.category)}</category>`,
        `      <dc:language>${locale}</dc:language>`,
        '      <pubDate>Fri, 14 Aug 2026 00:00:00 GMT</pubDate>',
        '    </item>',
      ].join('\n')
    })
  ).join('\n')
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<?xml-stylesheet type="text/xsl" href="/feed.xsl"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    '  <channel>',
    '    <title>AuraSpear SOC</title>',
    `    <link>${PUBLIC_SITE_URL}</link>`,
    `    <atom:link href="${PUBLIC_SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />`,
    '    <description>Security operations platform pages, capabilities, and integrations in every supported language.</description>',
    '    <language>en</language>',
    '    <lastBuildDate>Fri, 14 Aug 2026 00:00:00 GMT</lastBuildDate>',
    '    <managingEditor>ihab.khaled94@gmail.com (Ihab Khaled)</managingEditor>',
    '    <webMaster>ihab.khaled94@gmail.com (Ihab Khaled)</webMaster>',
    '    <generator>AuraSpear SOC</generator>',
    '    <ttl>1440</ttl>',
    items,
    '  </channel>',
    '</rss>',
  ].join('\n')
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
