'use client'

import { Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ReportFormat, ReportType } from '@/enums'
import { useReportEditDialog } from '@/hooks/useReportEditDialog'
import { REPORT_FORMAT_LABEL_KEYS, REPORT_TYPE_LABEL_KEYS } from '@/lib/constants/reports'
import type { ReportEditDialogProps } from '@/types'

export function ReportEditDialog({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
  loading = false,
}: ReportEditDialogProps) {
  const { t, register, control, errors, isScheduled, onFormSubmit, handleOpenChange } =
    useReportEditDialog({ open, onOpenChange, onSubmit, initialValues })

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t('editTitle')}</DialogTitle>
          <DialogDescription>{t('editDescription')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onFormSubmit} className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="report-edit-name">{t('fieldName')}</Label>
            <Input
              id="report-edit-name"
              {...register('name')}
              placeholder={t('fieldNamePlaceholder')}
              aria-invalid={errors.name ? true : undefined}
            />
            {errors.name && <p className="text-destructive text-xs">{t('validationNameMin')}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="report-edit-description">{t('fieldDescription')}</Label>
            <Textarea
              id="report-edit-description"
              {...register('description')}
              placeholder={t('fieldDescriptionPlaceholder')}
              aria-invalid={errors.description ? true : undefined}
              className="resize-none"
              rows={3}
            />
            {errors.description && (
              <p className="text-destructive text-xs">{t('validationDescriptionMin')}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t('fieldType')}</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('fieldTypePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ReportType).map(reportType => (
                      <SelectItem key={reportType} value={reportType}>
                        {t(REPORT_TYPE_LABEL_KEYS[reportType])}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t('fieldFormat')}</Label>
            <Controller
              name="format"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('fieldFormatPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ReportFormat).map(fmt => (
                      <SelectItem key={fmt} value={fmt}>
                        {t(REPORT_FORMAT_LABEL_KEYS[fmt])}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex items-center gap-3">
            <Controller
              name="scheduled"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                  id="report-edit-scheduled"
                />
              )}
            />
            <Label htmlFor="report-edit-scheduled">{t('fieldScheduled')}</Label>
          </div>

          {isScheduled && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="report-edit-cron">{t('fieldCron')}</Label>
              <Input
                id="report-edit-cron"
                {...register('cronExpression')}
                placeholder={t('fieldCronPlaceholder')}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              {t('cancelButton')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t('saving') : t('saveButton')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
