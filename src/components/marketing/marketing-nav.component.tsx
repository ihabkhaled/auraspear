import Link from 'next/link'
import { Button } from '@/components/ui'
import type { MarketingNavProps } from '@/types'

export function MarketingNav({ t }: MarketingNavProps) {
  return (
    <header className="border-border/60 border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-foreground text-lg font-bold tracking-tight">
          AuraSpear SOC
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link href="/about" className="text-muted-foreground hover:text-foreground text-sm">
            {t('marketing.nav.about')}
          </Link>
          <Link href="/contact" className="text-muted-foreground hover:text-foreground text-sm">
            {t('marketing.nav.contact')}
          </Link>
          <Button asChild size="sm">
            <Link href="/login">{t('marketing.nav.signIn')}</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
