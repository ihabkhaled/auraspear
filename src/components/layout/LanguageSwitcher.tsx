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
import { useUpdatePreferences } from '@/hooks/useSettings'
import { LOCALES } from '@/lib/constants/locales'
import { getCookie } from '@/lib/cookies'

export function LanguageSwitcher() {
  const t = useTranslations('language')
  const router = useRouter()
  const updatePreferences = useUpdatePreferences()
  const current = getCookie('locale') || 'en'

  function handleChange(locale: string) {
    document.cookie = `locale=${locale};path=/;max-age=31536000;SameSite=Lax`
    updatePreferences.mutate({ language: locale })
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
