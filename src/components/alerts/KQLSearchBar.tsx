'use client'

import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface KQLSearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onSavedSearches?: () => void
}

export function KQLSearchBar({ value, onChange, onSubmit, onSavedSearches }: KQLSearchBarProps) {
  const t = useTranslations('alerts')

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit()
    }
  }

  return (
    <Card className="p-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('searchPlaceholder')}
            className="ps-9 font-mono text-sm"
          />
        </div>
        {onSavedSearches && (
          <Button variant="ghost" size="sm" onClick={onSavedSearches}>
            {t('savedSearches')}
          </Button>
        )}
        <Button onClick={onSubmit} size="sm" className="shrink-0">
          <Search className="h-4 w-4 sm:hidden" />
          <span className="hidden sm:inline">{t('submit')}</span>
        </Button>
      </div>
    </Card>
  )
}
