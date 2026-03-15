import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import type { UebaFiltersProps } from '@/types'

export function useUebaFilters({
  onSearchChange,
  onEntityTypeChange,
  onRiskLevelChange,
}: Pick<UebaFiltersProps, 'onSearchChange' | 'onEntityTypeChange' | 'onRiskLevelChange'>) {
  const t = useTranslations('ueba')
  const tCommon = useTranslations('common')

  const handleSearchInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearchChange(e.target.value)
    },
    [onSearchChange]
  )

  return {
    t,
    tCommon,
    handleSearchInput,
    handleEntityTypeChange: onEntityTypeChange,
    handleRiskLevelChange: onRiskLevelChange,
  }
}
