import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { IOCSearchBarProps } from '@/types'

type UseIOCSearchBarParams = Pick<IOCSearchBarProps, 'onSearch'>

export function useIOCSearchBar({ onSearch }: UseIOCSearchBarParams) {
  const t = useTranslations('intel')
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const [source, setSource] = useState('all')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query.trim(), type === 'all' ? '' : type, source === 'all' ? '' : source)
  }

  return { t, query, setQuery, type, setType, source, setSource, handleSubmit }
}
