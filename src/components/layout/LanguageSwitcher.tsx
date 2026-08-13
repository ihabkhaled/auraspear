'use client'

import { Languages } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import { useLanguageSwitcher } from '@/hooks'
import { LOCALES } from '@/lib/constants/locales'

export function LanguageSwitcher() {
  const { current, handleChange } = useLanguageSwitcher()

  return (
    <Select value={current} onValueChange={handleChange}>
      <SelectTrigger size="sm" className="w-[130px] gap-1">
        <Languages className="text-muted-foreground h-3.5 w-3.5" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LOCALES.map(l => (
          <SelectItem key={l.code} value={l.code}>
            {l.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
