'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { AiFeatureKey } from '@/enums'
import { usePromptDialog } from '@/hooks/usePromptDialog'
import { AI_FEATURE_KEY_LABEL_KEYS } from '@/lib/constants/ai-config'
import { lookup } from '@/lib/utils'
import type { PromptDialogProps } from '@/types'

export function PromptDialog({
  open,
  onOpenChange,
  prompt,
  onSubmit,
  loading,
  t,
}: PromptDialogProps) {
  const {
    isEdit,
    taskType,
    setTaskType,
    name,
    setName,
    content,
    setContent,
    handleSubmit,
    canSubmit,
  } = usePromptDialog(prompt, onSubmit)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? t('editPrompt') : t('createPrompt')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!isEdit && (
            <div className="space-y-2">
              <Label>{t('promptTaskType')}</Label>
              <Select value={taskType} onValueChange={setTaskType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AiFeatureKey).map(key => {
                    const labelKey = lookup(AI_FEATURE_KEY_LABEL_KEYS, key)
                    return (
                      <SelectItem key={key} value={key}>
                        {labelKey ? t(labelKey) : key}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>{t('promptName')}</Label>
            <Input
              value={name}
              onChange={e => setName(e.currentTarget.value)}
              placeholder={t('promptName')}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('promptContent')}</Label>
            <Textarea
              value={content}
              onChange={e => setContent(e.currentTarget.value)}
              placeholder={t('promptContent')}
              rows={8}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !canSubmit}>
            {loading ? t('saving') : t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
