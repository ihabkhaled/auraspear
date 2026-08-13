import Link from 'next/link'
import { AppWindow, ChevronRight, Github, Home, Linkedin, Mail } from 'lucide-react'
import { ThemeSwitcher } from '@/components/layout'
import { LOCALES } from '@/lib/constants/locales'
import { MARKETING_GROUPS, MARKETING_PAGES } from '@/lib/constants/marketing'
import { PUBLIC_SITE_URL, SITE_NAME } from '@/lib/constants/seo'
import { getMarketingContent } from '@/lib/marketing-content'
import { buildPublicPath, localizeMarketingPage, type SupportedLocale } from '@/lib/marketing.utils'
import { serializeJsonLd } from '@/lib/seo'

export function PublicShell({
  children,
  locale,
  currentPath = '/',
}: {
  children: React.ReactNode
  locale: SupportedLocale
  currentPath?: string
}) {
  const copy = getMarketingContent(locale).shared
  const groupLabels = new Map([
    ['Platform', copy.navPlatform],
    ['Features', copy.navFeatures],
    ['Integrations', copy.navIntegrations],
    ['Company', copy.navAbout],
  ])
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${PUBLIC_SITE_URL}/#organization`,
    name: SITE_NAME,
    url: PUBLIC_SITE_URL,
    logo: `${PUBLIC_SITE_URL}/icons/icon-512.png`,
    email: 'ihab.khaled94@gmail.com',
    telephone: '+201001568256',
    sameAs: [
      'https://github.com/ihabkhaled/auraspear',
      'https://www.linkedin.com/in/ihabkhaled94/',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales and product demonstrations',
      email: 'ihab.khaled94@gmail.com',
      telephone: '+201001568256',
      availableLanguage: LOCALES.map(item => item.label),
    },
  }
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${PUBLIC_SITE_URL}/#website`,
    name: SITE_NAME,
    url: PUBLIC_SITE_URL,
    publisher: { '@id': `${PUBLIC_SITE_URL}/#organization` },
    inLanguage: LOCALES.map(item => item.code),
  }
  return (
    <div className="bg-background text-foreground min-h-screen px-3 sm:px-0">
      <script type="application/ld+json">{serializeJsonLd(organizationSchema)}</script>
      <script type="application/ld+json">{serializeJsonLd(websiteSchema)}</script>
      <header className="bg-background/90 sticky top-0 z-50 border-x border-b backdrop-blur sm:border-x-0">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-3 sm:gap-4 sm:px-6">
          <Link
            href={buildPublicPath(locale, '/')}
            className="mr-auto min-w-0 text-base leading-tight font-extrabold tracking-tight sm:text-lg"
          >
            AuraSpear<span className="text-blue-400"> / SOC</span>
          </Link>
          <Link
            href={buildPublicPath(locale, '/')}
            aria-label={copy.homeAria}
            className="hover:bg-accent inline-flex size-9 items-center justify-center rounded-md"
          >
            <Home className="size-4" />
          </Link>
          <nav className="hidden gap-5 text-sm font-semibold lg:flex">
            <Link href={buildPublicPath(locale, '/platform/overview')}>{copy.navPlatform}</Link>
            <Link href={buildPublicPath(locale, '/features/alert-management')}>
              {copy.navFeatures}
            </Link>
            <Link href={buildPublicPath(locale, '/integrations/overview')}>
              {copy.navIntegrations}
            </Link>
            <Link href={buildPublicPath(locale, '/about')}>{copy.navAbout}</Link>
          </nav>
          <details className="relative">
            <summary
              title={copy.languageMenu}
              className="inline-flex cursor-pointer list-none items-center gap-1 rounded-md border px-2 py-2 text-sm font-bold whitespace-nowrap marker:content-none sm:px-3 [&::-webkit-details-marker]:hidden"
            >
              <ChevronRight aria-hidden="true" className="size-3.5 shrink-0" />
              <span>{LOCALES.find(item => item.code === locale)?.label}</span>
            </summary>
            <div className="bg-popover absolute end-0 mt-2 grid max-h-80 min-w-40 gap-1 overflow-auto rounded-lg border p-2 shadow-xl">
              {LOCALES.map(item => (
                <Link
                  key={item.code}
                  href={buildPublicPath(item.code, currentPath)}
                  lang={item.code}
                  dir={item.code === 'ar' || item.code === 'fa' ? 'rtl' : 'ltr'}
                  className="hover:bg-accent rounded px-3 py-2 text-sm"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
          <ThemeSwitcher />
          <Link
            href={buildPublicPath(locale, '/contact')}
            className="hidden rounded-md border px-3 py-2 text-sm font-bold sm:block"
          >
            {copy.requestDemo}
          </Link>
          <Link
            href="/app/login"
            aria-label={copy.goToAppAria}
            className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold"
          >
            <AppWindow className="size-4" />
            <span className="hidden sm:inline">{copy.goToApp}</span>
          </Link>
        </div>
      </header>
      {children}
      <footer className="bg-card border-x border-t sm:border-x-0">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <p className="text-xl font-extrabold">AuraSpear / SOC</p>
              <p className="text-muted-foreground mt-4 text-sm leading-6">{copy.footerTagline}</p>
              <div className="mt-5 flex gap-3">
                <a href="mailto:ihab.khaled94@gmail.com" aria-label={copy.emailAria}>
                  <Mail className="size-5" />
                </a>
                <a href="https://github.com/ihabkhaled/auraspear" aria-label={copy.githubAria}>
                  <Github className="size-5" />
                </a>
                <a href="https://www.linkedin.com/in/ihabkhaled94/" aria-label={copy.linkedinLabel}>
                  <Linkedin className="size-5" />
                </a>
              </div>
            </div>
            {MARKETING_GROUPS.map(group => (
              <div key={group}>
                <h2 className="font-mono text-xs font-bold tracking-widest text-blue-400 uppercase">
                  {groupLabels.get(group)}
                </h2>
                <ul className="mt-4 space-y-2">
                  {MARKETING_PAGES.filter(page => page.category === group)
                    .slice(0, 12)
                    .map(page => (
                      <li key={page.path}>
                        <Link
                          className="text-muted-foreground hover:text-foreground text-sm"
                          href={buildPublicPath(locale, page.path)}
                        >
                          {localizeMarketingPage(page, locale).title}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-muted-foreground mt-12 flex flex-col gap-3 border-t pt-6 text-xs sm:flex-row sm:justify-between">
            <p>{copy.footerRights}</p>
            <p>+20 100 156 8256 · ihab.khaled94@gmail.com</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
