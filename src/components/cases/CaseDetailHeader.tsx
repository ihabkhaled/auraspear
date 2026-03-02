'use client'

import { Calendar, User, Edit, Trash2, ExternalLink } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { SeverityBadge } from '@/components/common/SeverityBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CaseStatus } from '@/enums'
import { getAvailableTransitions, STATUS_VARIANT_MAP } from '@/lib/case.utils'
import { CASE_STATUS_LABEL_KEYS } from '@/lib/constants/cases'
import { formatDate } from '@/lib/utils'
import type { CaseDetailHeaderProps } from '@/types'

export function CaseDetailHeader({
  caseItem,
  ownerName,
  onEdit,
  onDelete,
  onEscalate,
  onStatusChange,
}: CaseDetailHeaderProps) {
  const t = useTranslations('cases')

  const availableTransitions = getAvailableTransitions(caseItem.status)

  return (
    <div className="border-border flex flex-col gap-4 border-b pb-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground font-mono text-sm">{caseItem.caseNumber}</span>
            <Badge variant={STATUS_VARIANT_MAP[caseItem.status]} className="capitalize">
              {t(CASE_STATUS_LABEL_KEYS[caseItem.status])}
            </Badge>
            <SeverityBadge severity={caseItem.severity} />
          </div>
          <h1 className="text-xl font-bold">{caseItem.title}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onStatusChange && availableTransitions.length > 0 && (
            <Select onValueChange={value => onStatusChange(value as CaseStatus)}>
              <SelectTrigger size="sm" className="w-auto">
                <SelectValue placeholder={t('changeStatus')} />
              </SelectTrigger>
              <SelectContent>
                {availableTransitions.map(status => (
                  <SelectItem key={status} value={status}>
                    {t(CASE_STATUS_LABEL_KEYS[status])}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {onEscalate && caseItem.status !== CaseStatus.CLOSED && (
            <Button variant="outline" size="sm" onClick={onEscalate}>
              <ExternalLink className="h-4 w-4" />
              {t('escalate')}
            </Button>
          )}
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
              {t('edit')}
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
              {t('delete')}
            </Button>
          )}
        </div>
      </div>

      <div className="text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <span className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" />
          {ownerName ?? caseItem.createdBy ?? t('unassigned')}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {t('created')}: {formatDate(caseItem.createdAt)}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {t('updated')}: {formatDate(caseItem.updatedAt)}
        </span>
        {caseItem.closedAt && (
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {t('closed')}: {formatDate(caseItem.closedAt)}
          </span>
        )}
      </div>
    </div>
  )
}
