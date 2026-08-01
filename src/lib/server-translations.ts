import { cookies } from 'next/headers'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/lib/constants/locales'
import { getNestedValue } from '@/lib/utils'
import type { TranslationFn } from '@/types'

/**
 * Server Components can't call the `useTranslations` client hook, and this
 * project doesn't register the next-intl Next.js plugin (only the client
 * NextIntlClientProvider tree). This mirrors the same cookie + JSON import
 * logic as the root layout to build a plain `t()` function for server pages.
 */
export async function getServerTranslator(): Promise<TranslationFn> {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get('locale')?.value ?? ''
  const locale = (SUPPORTED_LOCALES as readonly string[]).includes(cookieLocale)
    ? cookieLocale
    : DEFAULT_LOCALE
  const messages = (await import(`@/i18n/${locale}.json`)).default as Record<string, unknown>

  return (key: string) => {
    const value = getNestedValue(messages, key)
    return typeof value === 'string' ? value : key
  }
}
