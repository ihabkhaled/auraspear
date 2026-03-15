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
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ComplianceControlStatus } from '@/enums'
import { useComplianceControlEdit } from '@/hooks/useComplianceControlEdit'
import { COMPLIANCE_CONTROL_STATUS_LABEL_KEYS } from '@/lib/constants/compliance'
import type { ComplianceControlEditDialogProps } from '@/types'

export function ComplianceControlEditDialog({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
  controlTitle,
  loading = false,
}: ComplianceControlEditDialogProps) {
  const { t, register, control, errors, onFormSubmit, handleOpenChange } = useComplianceControlEdit(
    { open, onOpenChange, onSubmit, initialValues }
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('controlEditTitle')}</DialogTitle>
          <DialogDescription>{controlTitle}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onFormSubmit} className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>{t('controlStatus')}</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('controlStatusPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ComplianceControlStatus).map(status => (
                      <SelectItem key={status} value={status}>
                        {t(COMPLIANCE_CONTROL_STATUS_LABEL_KEYS[status])}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && <p className="text-destructive text-xs">{t('validationStatus')}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="control-evidence">{t('controlEvidence')}</Label>
            <Textarea
              id="control-evidence"
              {...register('evidence')}
              placeholder={t('controlEvidencePlaceholder')}
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="control-notes">{t('controlNotes')}</Label>
            <Textarea
              id="control-notes"
              {...register('notes')}
              placeholder={t('controlNotesPlaceholder')}
              className="resize-none"
              rows={3}
            />
          </div>

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
