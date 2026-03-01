'use client'

import { useRouter } from 'next/navigation'
import { Languages } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const LOCALES = [
  { code: 'en', labelKey: 'en' },
  { code: 'es', labelKey: 'es' },
  { code: 'it', labelKey: 'it' },
  { code: 'fr', labelKey: 'fr' },
  { code: 'ar', labelKey: 'ar' },
  { code: 'de', labelKey: 'de' },
] as const

function getCookie(name: string): string {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1] ?? '') : ''
}

export function LanguageSwitcher() {
  const t = useTranslations('language')
  const router = useRouter()
  const current = getCookie('locale') || 'en'

  function handleChange(locale: string) {
    document.cookie = `locale=${locale};path=/;max-age=31536000;SameSite=Lax`
    router.refresh()
  }

  return (
    <Select value={current} onValueChange={handleChange}>
      <SelectTrigger size="sm" className="w-[130px] gap-1">
        <Languages className="text-muted-foreground h-3.5 w-3.5" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LOCALES.map(l => (
          <SelectItem key={l.code} value={l.code}>
            {t(l.labelKey)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
