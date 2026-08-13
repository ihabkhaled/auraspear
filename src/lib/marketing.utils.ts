import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/lib/constants/locales'
import { MARKETING_PAGES } from '@/lib/constants/marketing'
import type { MarketingPage } from '@/types/marketing.types'

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export function isRtlLocale(locale: string): boolean {
  return locale === 'ar' || locale === 'fa'
}

export function buildPublicPath(locale: SupportedLocale, path: string): string {
  const normalized = path === '/' ? '' : `/${path.replaceAll(/^\/+|\/+$/g, '')}`
  return locale === DEFAULT_LOCALE ? normalized || '/' : `/${locale}${normalized}`
}

export function normalizePublicPath(path: string): string {
  const normalized = path.replace(/^\/en(?=\/|$)/, '')
  return normalized || '/'
}

export function buildLanguageAlternates(path: string): Record<string, string> {
  const alternates = Object.fromEntries(
    SUPPORTED_LOCALES.map(locale => [locale, buildPublicPath(locale, path)])
  )
  return { ...alternates, 'x-default': buildPublicPath(DEFAULT_LOCALE, path) }
}

export function toAppPath(path: string): string {
  if (path.startsWith('/app/')) return path
  if (path === '/app') return '/app/dashboard'
  if (path === '/') return '/app/dashboard'
  return `/app/${path.replace(/^\/+/, '')}`
}

export function resolveLocalizedMarketingPage(locale: string, slug?: string[]) {
  const path = slug?.length ? `/${slug.join('/')}` : '/'
  const supportedLocale = SUPPORTED_LOCALES.find(item => item === locale)
  const page = MARKETING_PAGES.find(item => item.path === path)
  return { path, locale: supportedLocale, page }
}

const localizedCopy = {
  es: {
    alert: 'Gestión de alertas',
    prefix: 'Plataforma de operaciones de seguridad',
    description:
      'Unifique señales, investigaciones, automatización y respuesta en un espacio de trabajo seguro y multiinquilino.',
    capabilities: [
      'Flujos de trabajo centralizados',
      'Aislamiento y acceso por roles',
      'Evidencia y automatización conectadas',
      'Integraciones abiertas',
    ],
  },
  it: {
    alert: 'Gestione degli avvisi',
    prefix: 'Piattaforma per le operazioni di sicurezza',
    description:
      'Unifica segnali, indagini, automazione e risposta in un ambiente sicuro e multi-tenant.',
    capabilities: [
      'Flussi di lavoro centralizzati',
      'Isolamento e accesso per ruolo',
      'Evidenze e automazione collegate',
      'Integrazioni aperte',
    ],
  },
  fr: {
    alert: 'Gestion des alertes',
    prefix: 'Plateforme d’opérations de sécurité',
    description:
      'Unifiez les signaux, les investigations, l’automatisation et la réponse dans un espace sécurisé et multi-locataire.',
    capabilities: [
      'Flux de travail centralisés',
      'Isolation et accès par rôle',
      'Preuves et automatisation connectées',
      'Intégrations ouvertes',
    ],
  },
  ar: {
    alert: 'إدارة التنبيهات',
    prefix: 'منصة عمليات الأمن السيبراني',
    description:
      'وحّد الإشارات والتحقيقات والأتمتة والاستجابة في مساحة عمل آمنة ومتعددة المستأجرين.',
    capabilities: [
      'سير عمل مركزي',
      'عزل وصلاحيات حسب الدور',
      'أدلة وأتمتة مترابطة',
      'تكاملات مفتوحة',
    ],
  },
  de: {
    alert: 'Alarmverwaltung',
    prefix: 'Plattform für Sicherheitsabläufe',
    description:
      'Vereinen Sie Signale, Untersuchungen, Automatisierung und Reaktion in einem sicheren mandantenfähigen Arbeitsbereich.',
    capabilities: [
      'Zentrale Arbeitsabläufe',
      'Mandantentrennung und Rollen',
      'Verknüpfte Beweise und Automatisierung',
      'Offene Integrationen',
    ],
  },
  ru: {
    alert: 'Управление оповещениями',
    prefix: 'Платформа операций безопасности',
    description:
      'Объедините сигналы, расследования, автоматизацию и реагирование в защищённой мультитенантной среде.',
    capabilities: [
      'Централизованные процессы',
      'Изоляция и ролевой доступ',
      'Связанные доказательства и автоматизация',
      'Открытые интеграции',
    ],
  },
  zh: {
    alert: '警报管理',
    prefix: '安全运营平台',
    description: '在安全的多租户工作区中统一信号、调查、自动化与响应。',
    capabilities: ['集中式工作流', '租户隔离与角色访问', '关联证据与自动化', '开放集成'],
  },
  ko: {
    alert: '알림 관리',
    prefix: '보안 운영 플랫폼',
    description: '안전한 멀티테넌트 작업 공간에서 신호, 조사, 자동화 및 대응을 통합합니다.',
    capabilities: [
      '중앙 집중식 워크플로',
      '테넌트 격리 및 역할 접근',
      '연결된 증거와 자동화',
      '개방형 통합',
    ],
  },
  th: {
    alert: 'การจัดการการแจ้งเตือน',
    prefix: 'แพลตฟอร์มปฏิบัติการความปลอดภัย',
    description:
      'รวมสัญญาณ การตรวจสอบ ระบบอัตโนมัติ และการตอบสนองไว้ในพื้นที่ทำงานแบบหลายผู้เช่าที่ปลอดภัย',
    capabilities: [
      'เวิร์กโฟลว์แบบรวมศูนย์',
      'การแยกผู้เช่าและสิทธิ์ตามบทบาท',
      'หลักฐานและระบบอัตโนมัติที่เชื่อมโยง',
      'การผสานรวมแบบเปิด',
    ],
  },
  pt: {
    alert: 'Gestão de alertas',
    prefix: 'Plataforma de operações de segurança',
    description:
      'Unifique sinais, investigações, automação e resposta em um espaço seguro e multilocatário.',
    capabilities: [
      'Fluxos centralizados',
      'Isolamento e acesso por função',
      'Evidências e automação conectadas',
      'Integrações abertas',
    ],
  },
  fa: {
    alert: 'مدیریت هشدارها',
    prefix: 'پلتفرم عملیات امنیتی',
    description:
      'سیگنال‌ها، بررسی‌ها، خودکارسازی و پاسخ را در یک فضای کاری امن و چندمستاجری یکپارچه کنید.',
    capabilities: [
      'گردش‌کار متمرکز',
      'جداسازی و دسترسی مبتنی بر نقش',
      'شواهد و خودکارسازی متصل',
      'یکپارچه‌سازی باز',
    ],
  },
  ja: {
    alert: 'アラート管理',
    prefix: 'セキュリティ運用プラットフォーム',
    description: '安全なマルチテナント環境で、シグナル、調査、自動化、対応を統合します。',
    capabilities: [
      '一元化されたワークフロー',
      'テナント分離とロールアクセス',
      '証拠と自動化の連携',
      'オープンな統合',
    ],
  },
} as const

export function localizeMarketingPage(page: MarketingPage, locale: SupportedLocale): MarketingPage {
  if (locale === DEFAULT_LOCALE) return page
  const copy = Reflect.get(
    localizedCopy,
    locale
  ) as (typeof localizedCopy)[keyof typeof localizedCopy]
  const title =
    page.path === '/features/alert-management' ? copy.alert : `${copy.prefix}: ${page.title}`
  return { ...page, title, description: copy.description, capabilities: copy.capabilities }
}
