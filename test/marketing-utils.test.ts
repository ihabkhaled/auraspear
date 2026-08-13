import { describe, expect, it } from 'vitest'
import { SUPPORTED_LOCALES } from '@/lib/constants/locales'
import { MARKETING_PAGES } from '@/lib/constants/marketing'
import {
  buildLanguageAlternates,
  buildPublicPath,
  isRtlLocale,
  normalizePublicPath,
  toAppPath,
  localizeMarketingPage,
} from '@/lib/marketing.utils'

describe('marketing route model', () => {
  it('publishes a substantial unique catalog in thirteen locales', () => {
    expect(SUPPORTED_LOCALES).toHaveLength(13)
    expect(MARKETING_PAGES.length).toBeGreaterThanOrEqual(25)
    expect(new Set(MARKETING_PAGES.map(page => page.path)).size).toBe(MARKETING_PAGES.length)
  })

  it('keeps English canonical at the root and prefixes other locales', () => {
    expect(buildPublicPath('en', '/features/alert-management')).toBe('/features/alert-management')
    expect(buildPublicPath('fr', '/features/alert-management')).toBe(
      '/fr/features/alert-management'
    )
    expect(normalizePublicPath('/en/features/alert-management')).toBe('/features/alert-management')
  })

  it('marks only Arabic and Persian as right-to-left', () => {
    expect(isRtlLocale('ar')).toBe(true)
    expect(isRtlLocale('fa')).toBe(true)
    expect(isRtlLocale('ja')).toBe(false)
  })

  it('builds complete language alternates without a duplicate English prefix', () => {
    const alternates = buildLanguageAlternates('/about')

    expect(alternates['en']).toBe('/about')
    expect(alternates['fr']).toBe('/fr/about')
    expect(alternates['fa']).toBe('/fa/about')
    expect(alternates['x-default']).toBe('/about')
    expect(Object.keys(alternates)).toHaveLength(14)
  })

  it('maps internal routes to their public application address', () => {
    expect(toAppPath('/dashboard')).toBe('/app/dashboard')
    expect(toAppPath('/login')).toBe('/app/login')
    expect(toAppPath('/app/dashboard')).toBe('/app/dashboard')
    expect(toAppPath('/')).toBe('/app/dashboard')
  })

  it('localizes public content and preserves the page when switching languages', () => {
    const page = MARKETING_PAGES.find(item => item.path === '/features/alert-management')
    expect(page).toBeDefined()
    if (!page) return
    const french = localizeMarketingPage(page, 'fr')
    const japanese = localizeMarketingPage(page, 'ja')
    expect(french.title).toBe('Gestion des alertes')
    expect(japanese.title).toBe('アラート管理')
    expect(buildPublicPath('fr', page.path)).toBe('/fr/features/alert-management')
  })
})
