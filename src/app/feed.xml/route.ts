import { SUPPORTED_LOCALES } from '@/lib/constants/locales'
import { MARKETING_PAGES } from '@/lib/constants/marketing'
import { buildPublicPath } from '@/lib/marketing.utils'
const SITE_URL = 'https://auraspear-demo.vercel.app'
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
      const url = `${SITE_URL}${buildPublicPath(locale, page.path)}`
      return `<item><title>${escapeXml(page.title)} [${locale}]</title><link>${url}</link><guid isPermaLink="true">${url}</guid><description>${escapeXml(page.description)}</description><pubDate>Thu, 13 Aug 2026 00:00:00 GMT</pubDate></item>`
    })
  ).join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>AuraSpear SOC</title><link>${SITE_URL}</link><description>Security operations platform pages, capabilities, and integrations.</description><language>en</language>${items}</channel></rss>`
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
