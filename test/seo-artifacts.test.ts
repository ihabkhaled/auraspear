import { describe, expect, it } from 'vitest'
import { GET as getFeed } from '@/app/feed.xml/route'
import robots from '@/app/robots'
import { GET as getSitemap } from '@/app/sitemap.xml/route'
import { SUPPORTED_LOCALES } from '@/lib/constants/locales'
import { MARKETING_PAGES } from '@/lib/constants/marketing'
import { PUBLIC_SITE_URL } from '@/lib/constants/seo'
import { buildPublicPath } from '@/lib/marketing.utils'

const EXPECTED_PUBLIC_URLS = SUPPORTED_LOCALES.flatMap(locale =>
  MARKETING_PAGES.map(page => `${PUBLIC_SITE_URL}${buildPublicPath(locale, page.path)}`)
)

function countTags(xml: string, tagName: string): { opening: number; closing: number } {
  return {
    opening: xml.split(`<${tagName}>`).length - 1,
    closing: xml.split(`</${tagName}>`).length - 1,
  }
}

describe('public discovery artifacts', () => {
  it('publishes every localized public page without internal app URLs', async () => {
    const response = getSitemap()
    const xml = await response.text()
    expect(response.headers.get('Content-Type')).toContain('application/xml')
    expect(xml).toContain('<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>')
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')
    expect(xml).toContain('</urlset>')

    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/gu)].map(match => match[1])
    const urlTags = countTags(xml, 'url')
    expect(urlTags.opening).toBe(EXPECTED_PUBLIC_URLS.length)
    expect(urlTags.closing).toBe(EXPECTED_PUBLIC_URLS.length)
    expect(urls).toHaveLength(EXPECTED_PUBLIC_URLS.length)
    expect(new Set(urls).size).toBe(EXPECTED_PUBLIC_URLS.length)
    expect(urls).toEqual(EXPECTED_PUBLIC_URLS)

    const expectedAlternateCount = EXPECTED_PUBLIC_URLS.length * (SUPPORTED_LOCALES.length + 1)
    expect(xml.match(/<xhtml:link\s/gu)?.length).toBe(expectedAlternateCount)
    expect(xml).not.toContain('/app/')
  })

  it('allows public crawling while protecting application and API routes', () => {
    const policy = robots()
    expect(policy.sitemap).toBe('https://auraspear-demo.vercel.app/sitemap.xml')
    expect(policy.rules).toEqual(
      expect.objectContaining({ allow: '/', disallow: expect.arrayContaining(['/app/', '/api/']) })
    )
  })

  it('includes localized pages in the RSS feed', async () => {
    const response = getFeed()
    const xml = await response.text()
    expect(response.headers.get('Content-Type')).toContain('application/xml')
    expect(xml).toContain('<?xml-stylesheet type="text/xsl" href="/feed.xsl"?>')
    expect(xml).toContain('<rss version="2.0"')
    expect(xml).toContain('</rss>')

    const items = countTags(xml, 'item')
    const guids = [...xml.matchAll(/<guid isPermaLink="true">([^<]+)<\/guid>/gu)].map(
      match => match[1]
    )
    expect(items.opening).toBe(EXPECTED_PUBLIC_URLS.length)
    expect(items.closing).toBe(EXPECTED_PUBLIC_URLS.length)
    expect(guids).toHaveLength(EXPECTED_PUBLIC_URLS.length)
    expect(new Set(guids).size).toBe(EXPECTED_PUBLIC_URLS.length)
    expect(guids).toEqual(EXPECTED_PUBLIC_URLS)

    for (const locale of SUPPORTED_LOCALES) {
      expect(xml.split(`<dc:language>${locale}</dc:language>`).length - 1).toBe(
        MARKETING_PAGES.length
      )
    }

    expect(xml).not.toContain('/app/')
  })
})
