import { describe, expect, it } from 'vitest'
import appAr from '@/i18n/ar.json'
import appDe from '@/i18n/de.json'
import appEn from '@/i18n/en.json'
import appEs from '@/i18n/es.json'
import appFa from '@/i18n/fa.json'
import appFr from '@/i18n/fr.json'
import appHi from '@/i18n/hi.json'
import appIt from '@/i18n/it.json'
import appJa from '@/i18n/ja.json'
import appKo from '@/i18n/ko.json'
import marketingAr from '@/i18n/marketing/ar.json'
import marketingDe from '@/i18n/marketing/de.json'
import marketingEn from '@/i18n/marketing/en.json'
import marketingEs from '@/i18n/marketing/es.json'
import marketingFa from '@/i18n/marketing/fa.json'
import marketingFr from '@/i18n/marketing/fr.json'
import marketingHi from '@/i18n/marketing/hi.json'
import marketingIt from '@/i18n/marketing/it.json'
import marketingJa from '@/i18n/marketing/ja.json'
import marketingKo from '@/i18n/marketing/ko.json'
import marketingPt from '@/i18n/marketing/pt.json'
import marketingRu from '@/i18n/marketing/ru.json'
import marketingTh from '@/i18n/marketing/th.json'
import marketingZh from '@/i18n/marketing/zh.json'
import appPt from '@/i18n/pt.json'
import appRu from '@/i18n/ru.json'
import appTh from '@/i18n/th.json'
import appZh from '@/i18n/zh.json'
import { SUPPORTED_LOCALES } from '@/lib/constants/locales'

function flatten(value: unknown, prefix = ''): [string, unknown][] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return []
  const entries: [string, unknown][] = []
  for (const [key, child] of Object.entries(value)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (child && typeof child === 'object' && !Array.isArray(child)) {
      entries.push(...flatten(child, fullKey))
    } else {
      entries.push([fullKey, child])
    }
  }
  return entries
}

const appCatalogs = new Map<string, unknown>([
  ['en', appEn],
  ['es', appEs],
  ['it', appIt],
  ['fr', appFr],
  ['ar', appAr],
  ['de', appDe],
  ['ru', appRu],
  ['zh', appZh],
  ['ko', appKo],
  ['th', appTh],
  ['pt', appPt],
  ['fa', appFa],
  ['ja', appJa],
  ['hi', appHi],
])
const marketingCatalogs = new Map<string, unknown>([
  ['en', marketingEn],
  ['es', marketingEs],
  ['it', marketingIt],
  ['fr', marketingFr],
  ['ar', marketingAr],
  ['de', marketingDe],
  ['ru', marketingRu],
  ['zh', marketingZh],
  ['ko', marketingKo],
  ['th', marketingTh],
  ['pt', marketingPt],
  ['fa', marketingFa],
  ['ja', marketingJa],
  ['hi', marketingHi],
])

describe('locale completeness', () => {
  const english = new Map(flatten(appEn))
  const englishMarketing = new Map(flatten(marketingEn))

  it('ships a complete message tree for every supported language', () => {
    for (const locale of SUPPORTED_LOCALES) {
      const catalog = appCatalogs.get(locale)
      expect(catalog, `${locale} translation file`).toBeDefined()
      const translated = new Map(flatten(catalog))
      expect([...translated.keys()].sort(), `${locale} key parity`).toEqual(
        [...english.keys()].sort()
      )
    }
  })

  it('ships complete localized marketing and SEO content for every language', () => {
    for (const locale of SUPPORTED_LOCALES) {
      const catalog = marketingCatalogs.get(locale)
      expect(catalog, `${locale} marketing translation file`).toBeDefined()
      const translated = new Map(flatten(catalog))
      expect([...translated.keys()], `${locale} marketing key parity`).toEqual([
        ...englishMarketing.keys(),
      ])
      if (locale !== 'en') {
        const identical = [...englishMarketing.entries()].filter(
          ([key, value]) =>
            typeof value === 'string' &&
            value.length > 12 &&
            !value.startsWith('/') &&
            translated.get(key) === value
        )
        expect(identical.length, `${locale} untranslated marketing strings`).toBeLessThan(8)
      }
    }
  })

  it('does not ship English-copy message catalogs for non-English languages', () => {
    for (const locale of SUPPORTED_LOCALES.filter(item => item !== 'en')) {
      const translated = new Map(flatten(appCatalogs.get(locale)))
      const identical = [...english.entries()].filter(
        ([key, value]) =>
          typeof value === 'string' && value.length > 12 && translated.get(key) === value
      )
      expect(identical.length, `${locale} untranslated long strings`).toBeLessThan(100)
    }
  })

  it('preserves every runtime interpolation placeholder in every locale', () => {
    for (const locale of SUPPORTED_LOCALES) {
      const translated = new Map(flatten(appCatalogs.get(locale)))
      for (const [key, value] of english.entries()) {
        if (typeof value !== 'string') continue
        const sourcePlaceholders = value.match(/\{[A-Za-z0-9_.-]+\}/gu) ?? []
        const localizedValue = translated.get(key)
        const localizedPlaceholders =
          typeof localizedValue === 'string'
            ? (localizedValue.match(/\{[A-Za-z0-9_.-]+\}/gu) ?? [])
            : []
        expect(localizedPlaceholders.sort(), `${locale}:${key} placeholders`).toEqual(
          sourcePlaceholders.sort()
        )
      }
    }
  })
})
