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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useAiAgentToolDialog } from '@/hooks/useAiAgentToolDialog'
import type { AiAgentToolDialogProps } from '@/types'

export function AiAgentToolDialog({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
  loading = false,
}: AiAgentToolDialogProps) {
  const {
    t,
    register,
    handleSubmit,
    control,
    errors,
    isEditing,
    handleFormSubmit,
    handleOpenChange,
  } = useAiAgentToolDialog({ open, onOpenChange, onSubmit, initialValues })

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? t('editTool') : t('addTool')}</DialogTitle>
          <DialogDescription>{t('toolDialogDescription')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="tool-name">{t('toolName')}</Label>
            <Input
              id="tool-name"
              {...register('name')}
              placeholder={t('toolNamePlaceholder')}
              aria-invalid={errors.name ? true : undefined}
            />
            {errors.name && (
              <p className="text-destructive text-xs">{t('validationToolNameMin')}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="tool-description">{t('toolDescription')}</Label>
            <Textarea
              id="tool-description"
              {...register('description')}
              placeholder={t('toolDescriptionPlaceholder')}
              aria-invalid={errors.description ? true : undefined}
              className="resize-none"
            />
            {errors.description && (
              <p className="text-destructive text-xs">{t('validationToolDescriptionMin')}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="tool-schema">{t('toolSchema')}</Label>
            <Textarea
              id="tool-schema"
              {...register('schema')}
              placeholder={t('toolSchemaPlaceholder')}
              aria-invalid={errors.schema ? true : undefined}
              className="h-40 resize-none font-mono text-sm"
            />
            {errors.schema && (
              <p className="text-destructive text-xs">{t('validationToolSchemaMin')}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Label htmlFor="tool-enabled">{t('toolEnabled')}</Label>
            <Controller
              name="enabled"
              control={control}
              render={({ field }) => (
                <Switch id="tool-enabled" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
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
              {loading && t('saving')}
              {!loading && isEditing && t('save')}
              {!loading && !isEditing && t('submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
