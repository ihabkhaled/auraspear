import { describe, expect, it } from 'vitest'
import { GET as getFeed } from '@/app/feed.xml/route'
import robots from '@/app/robots'
import sitemap from '@/app/sitemap'

describe('public discovery artifacts', () => {
  it('publishes every localized public page without internal app URLs', () => {
    const entries = sitemap()
    expect(entries.length).toBeGreaterThanOrEqual(325)
    expect(entries.some(entry => entry.url.endsWith('/ja/features/alert-management'))).toBe(true)
    expect(entries.every(entry => !entry.url.includes('/app/'))).toBe(true)
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
    expect(response.headers.get('Content-Type')).toContain('application/rss+xml')
    expect(xml).toContain('/fa/platform/tenant-isolation')
    expect(xml).toContain('/ko/integrations/wazuh')
    expect(xml).not.toContain('/app/dashboard')
  })
})
