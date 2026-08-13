import Link from 'next/link'
import { AppWindow, Github, Mail } from 'lucide-react'
import { ThemeSwitcher } from '@/components/layout'
import { LOCALES } from '@/lib/constants/locales'
import { MARKETING_GROUPS, MARKETING_PAGES } from '@/lib/constants/marketing'
import { getMarketingContent } from '@/lib/marketing-content'
import { buildPublicPath, localizeMarketingPage, type SupportedLocale } from '@/lib/marketing.utils'

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
  return (
    <div className="bg-background text-foreground min-h-screen">
      <header className="bg-background/90 sticky top-0 z-50 border-b backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link
            href={buildPublicPath(locale, '/')}
            className="mr-auto text-lg font-extrabold tracking-tight"
          >
            AuraSpear<span className="text-primary"> / SOC</span>
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
              aria-label={copy.languageMenu}
              className="cursor-pointer rounded-md border px-3 py-2 text-sm font-bold"
            >
              {LOCALES.find(item => item.code === locale)?.label}
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
      <footer className="bg-card border-t">
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
              </div>
            </div>
            {MARKETING_GROUPS.map(group => (
              <div key={group}>
                <h2 className="text-primary font-mono text-xs font-bold tracking-widest uppercase">
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
