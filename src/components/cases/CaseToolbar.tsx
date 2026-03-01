'use client'

import { LayoutGrid, List, ArrowUpDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CaseSeverity, CaseSortField, CaseViewMode } from '@/enums'
import { cn } from '@/lib/utils'

interface CaseToolbarProps {
  viewMode: CaseViewMode
  onViewModeChange: (mode: CaseViewMode) => void
  activeSeverityFilter: CaseSeverity | undefined
  onSeverityFilterChange: (severity: CaseSeverity | undefined) => void
  sortField: CaseSortField
  onSortFieldChange: (field: CaseSortField) => void
}

const severityFilters = [
  CaseSeverity.CRITICAL,
  CaseSeverity.HIGH,
  CaseSeverity.MEDIUM,
  CaseSeverity.LOW,
] as const

export function CaseToolbar({
  viewMode,
  onViewModeChange,
  activeSeverityFilter,
  onSeverityFilterChange,
  sortField,
  onSortFieldChange,
}: CaseToolbarProps) {
  const t = useTranslations('cases')

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <div className="border-border flex items-center rounded-lg border">
          <Button
            variant={viewMode === CaseViewMode.BOARD ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange(CaseViewMode.BOARD)}
            className="rounded-e-none"
          >
            <LayoutGrid className="h-4 w-4" />
            {t('viewBoard')}
          </Button>
          <Button
            variant={viewMode === CaseViewMode.LIST ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange(CaseViewMode.LIST)}
            className="rounded-s-none"
          >
            <List className="h-4 w-4" />
            {t('viewList')}
          </Button>
        </div>

        <div className="bg-border mx-2 hidden h-6 w-px sm:block" />

        <div className="flex flex-wrap items-center gap-1.5">
          {severityFilters.map(severity => (
            <button
              key={severity}
              type="button"
              onClick={() =>
                onSeverityFilterChange(activeSeverityFilter === severity ? undefined : severity)
              }
              className={cn(
                'transition-opacity',
                activeSeverityFilter !== undefined &&
                  activeSeverityFilter !== severity &&
                  'opacity-40'
              )}
            >
              <Badge variant="outline" className="cursor-pointer capitalize">
                {severity}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ArrowUpDown className="text-muted-foreground h-4 w-4" />
        <Select value={sortField} onValueChange={v => onSortFieldChange(v as CaseSortField)}>
          <SelectTrigger className="w-[140px]" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={CaseSortField.CREATED}>{t('sortCreated')}</SelectItem>
            <SelectItem value={CaseSortField.UPDATED}>{t('sortUpdated')}</SelectItem>
            <SelectItem value={CaseSortField.SEVERITY}>{t('sortSeverity')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
