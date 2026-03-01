'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { IOCType } from '@/enums'

interface IOCSearchBarProps {
  onSearch: (query: string, type: IOCType) => void
  loading?: boolean
}

export function IOCSearchBar({ onSearch, loading = false }: IOCSearchBarProps) {
  const t = useTranslations('intel')
  const [query, setQuery] = useState('')
  const [type, setType] = useState<IOCType>(IOCType.IP)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim().length > 0) {
      onSearch(query.trim(), type)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="text-muted-foreground pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t('search.placeholder')}
          className="ps-9"
        />
      </div>
      <Select value={type} onValueChange={val => setType(val as IOCType)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={IOCType.IP}>{t('search.typeIP')}</SelectItem>
          <SelectItem value={IOCType.HASH}>{t('search.typeHash')}</SelectItem>
          <SelectItem value={IOCType.DOMAIN}>{t('search.typeDomain')}</SelectItem>
          <SelectItem value={IOCType.URL}>{t('search.typeURL')}</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" disabled={loading || query.trim().length === 0}>
        {loading ? t('search.searching') : t('search.lookUp')}
      </Button>
    </form>
  )
}
