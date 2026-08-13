import ar from '@/i18n/marketing/ar.json'
import de from '@/i18n/marketing/de.json'
import en from '@/i18n/marketing/en.json'
import es from '@/i18n/marketing/es.json'
import fa from '@/i18n/marketing/fa.json'
import fr from '@/i18n/marketing/fr.json'
import hi from '@/i18n/marketing/hi.json'
import it from '@/i18n/marketing/it.json'
import ja from '@/i18n/marketing/ja.json'
import ko from '@/i18n/marketing/ko.json'
import pt from '@/i18n/marketing/pt.json'
import ru from '@/i18n/marketing/ru.json'
import th from '@/i18n/marketing/th.json'
import zh from '@/i18n/marketing/zh.json'
import type { SupportedLocale } from '@/lib/marketing.utils'
import type { MarketingPage } from '@/types/marketing.types'

export interface MarketingContent {
  shared: { [Key in keyof typeof en.shared]: string }
  pages: Record<string, MarketingPage>
}

const content = { en, es, it, fr, ar, de, ru, zh, ko, th, pt, fa, ja, hi } as unknown as Record<
  SupportedLocale,
  MarketingContent
>

export function getMarketingContent(locale: SupportedLocale): MarketingContent {
  return (Reflect.get(content, locale) as MarketingContent | undefined) ?? content.en
}
