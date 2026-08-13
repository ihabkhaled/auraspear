import Link from 'next/link'
import { AppWindow, Github, Mail } from 'lucide-react'
import { ThemeSwitcher } from '@/components/layout'
import { SUPPORTED_LOCALES } from '@/lib/constants/locales'
import { MARKETING_PAGES } from '@/lib/constants/marketing'
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
  const groups = ['Platform', 'Features', 'Integrations', 'Company']
  return (
    <div className="bg-background text-foreground min-h-screen">
      <header className="bg-background/90 sticky top-0 z-50 border-b backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link
            href={buildPublicPath(locale, '/')}
            className="mr-auto text-lg font-extrabold tracking-tight"
          >
            AuraSpear<span className="text-primary">／SOC</span>
          </Link>
          <nav className="hidden gap-5 text-sm font-semibold lg:flex">
            <Link href={buildPublicPath(locale, '/platform/overview')}>Platform</Link>
            <Link href={buildPublicPath(locale, '/features/alert-management')}>Features</Link>
            <Link href={buildPublicPath(locale, '/integrations/overview')}>Integrations</Link>
            <Link href={buildPublicPath(locale, '/about')}>About</Link>
          </nav>
          <details className="relative">
            <summary className="cursor-pointer rounded-md border px-3 py-2 text-sm font-bold uppercase">
              {locale}
            </summary>
            <div className="bg-popover absolute end-0 mt-2 grid max-h-80 min-w-32 gap-1 overflow-auto rounded-lg border p-2 shadow-xl">
              {SUPPORTED_LOCALES.map(item => (
                <Link
                  key={item}
                  href={buildPublicPath(item, currentPath)}
                  className="hover:bg-accent rounded px-3 py-2 text-sm uppercase"
                >
                  {item}
                </Link>
              ))}
            </div>
          </details>
          <ThemeSwitcher />
          <Link
            href={buildPublicPath(locale, '/contact')}
            className="hidden rounded-md border px-3 py-2 text-sm font-bold sm:block"
          >
            Request demo
          </Link>
          <Link
            href="/app/login"
            aria-label="Go to AuraSpear app"
            className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold"
          >
            <AppWindow className="size-4" />
            <span className="hidden sm:inline">Go to app</span>
          </Link>
        </div>
      </header>
      {children}
      <footer className="bg-card border-t">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <p className="text-xl font-extrabold">AuraSpear／SOC</p>
              <p className="text-muted-foreground mt-4 text-sm leading-6">
                Unified, multi-tenant security operations with connected evidence and governed AI.
              </p>
              <div className="mt-5 flex gap-3">
                <a href="mailto:ihab.khaled94@gmail.com" aria-label="Email">
                  <Mail className="size-5" />
                </a>
                <a href="https://github.com/ihabkhaled/auraspear" aria-label="GitHub">
                  <Github className="size-5" />
                </a>
              </div>
            </div>
            {groups.map(group => (
              <div key={group}>
                <h2 className="text-primary font-mono text-xs font-bold tracking-widest uppercase">
                  {group}
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
            <p>© 2026 AuraSpear SOC. Security operations, connected.</p>
            <p>+20 100 156 8256 · ihab.khaled94@gmail.com</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
