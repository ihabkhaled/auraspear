export const DEFAULT_LOCALE = 'en' as const
export const DEFAULT_TIME_ZONE = 'UTC' as const

export const SUPPORTED_LOCALES = [
  'en',
  'es',
  'it',
  'fr',
  'ar',
  'de',
  'ru',
  'zh',
  'ko',
  'th',
  'pt',
  'fa',
  'ja',
  'hi',
] as const

export const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'it', label: 'Italiano' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ru', label: 'Русский' },
  { code: 'zh', label: '简体中文' },
  { code: 'ko', label: '한국어' },
  { code: 'th', label: 'ไทย' },
  { code: 'pt', label: 'Português' },
  { code: 'fa', label: 'فارسی' },
  { code: 'ja', label: '日本語' },
  { code: 'hi', label: 'हिन्दी' },
] as const
