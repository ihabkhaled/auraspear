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
import { Textarea } from '@/components/ui/textarea'
import { NormalizationSourceType } from '@/enums'
import { useNormalizationEditDialog } from '@/hooks/useNormalizationEditDialog'
import { NORMALIZATION_SOURCE_TYPE_LABEL_KEYS } from '@/lib/constants/normalization'
import type { NormalizationEditDialogProps } from '@/types'

export function NormalizationEditDialog({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
  loading = false,
}: NormalizationEditDialogProps) {
  const { t, register, handleSubmit, control, errors, handleFormSubmit, handleOpenChange } =
    useNormalizationEditDialog({ open, onOpenChange, onSubmit, initialValues })

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t('editPipeline')}</DialogTitle>
          <DialogDescription>{t('editPipelineDescription')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-pipeline-name">{t('fieldPipelineName')}</Label>
            <Input
              id="edit-pipeline-name"
              {...register('name')}
              placeholder={t('fieldPipelineNamePlaceholder')}
              aria-invalid={errors.name ? true : undefined}
            />
            {errors.name && <p className="text-destructive text-xs">{t('validationName')}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t('fieldSourceType')}</Label>
            <Controller
              name="sourceType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('fieldSourceTypePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(NormalizationSourceType).map(src => (
                      <SelectItem key={src} value={src}>
                        {t(NORMALIZATION_SOURCE_TYPE_LABEL_KEYS[src])}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-parser-config">{t('fieldParserConfig')}</Label>
            <Textarea
              id="edit-parser-config"
              {...register('parserConfig')}
              placeholder={t('fieldParserConfigPlaceholder')}
              aria-invalid={errors.parserConfig ? true : undefined}
              className="resize-none font-mono text-sm"
              rows={4}
            />
            {errors.parserConfig && (
              <p className="text-destructive text-xs">{t('validationParserConfig')}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-field-mappings">{t('fieldFieldMappings')}</Label>
            <Textarea
              id="edit-field-mappings"
              {...register('fieldMappings')}
              placeholder={t('fieldFieldMappingsPlaceholder')}
              aria-invalid={errors.fieldMappings ? true : undefined}
              className="resize-none font-mono text-sm"
              rows={4}
            />
            {errors.fieldMappings && (
              <p className="text-destructive text-xs">{t('validationFieldMappings')}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t('saving') : t('save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
