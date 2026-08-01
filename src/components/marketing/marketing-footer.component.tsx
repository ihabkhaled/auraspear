import { dayjs } from '@/lib/dayjs'
import type { MarketingFooterProps } from '@/types'

export function MarketingFooter({ t }: MarketingFooterProps) {
  return (
    <footer className="border-border/60 border-t">
      <div className="text-muted-foreground mx-auto max-w-6xl px-4 py-6 text-sm sm:px-6">
        AuraSpear SOC © {dayjs().year()} — {t('marketing.footer.rights')}
      </div>
    </footer>
  )
}
