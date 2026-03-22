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
import { Switch } from '@/components/ui/switch'
import { AiApprovalLevel } from '@/enums'
import { useFeatureEditDialog } from '@/hooks/useFeatureEditDialog'
import type { FeatureEditDialogProps } from '@/types'

export function FeatureEditDialog({
  open,
  onOpenChange,
  feature,
  onSubmit,
  loading,
  t,
}: FeatureEditDialogProps) {
  const {
    enabled,
    setEnabled,
    preferredProvider,
    setPreferredProvider,
    maxTokens,
    setMaxTokens,
    approvalLevel,
    setApprovalLevel,
    monthlyTokenBudget,
    setMonthlyTokenBudget,
    handleSubmit,
  } = useFeatureEditDialog(feature, onSubmit)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t('editFeature')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <Label>{t('featureEnabled')}</Label>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>

          <div className="space-y-2">
            <Label>{t('featureProvider')}</Label>
            <Input
              value={preferredProvider ?? ''}
              onChange={e => setPreferredProvider(e.currentTarget.value || null)}
              placeholder={t('featureProvider')}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('featureMaxTokens')}</Label>
            <Input
              type="number"
              value={maxTokens}
              onChange={e => setMaxTokens(Number(e.currentTarget.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('featureApproval')}</Label>
            <Select value={approvalLevel} onValueChange={setApprovalLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(AiApprovalLevel).map(level => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('featureBudget')}</Label>
            <Input
              type="number"
              value={monthlyTokenBudget ?? ''}
              onChange={e => {
                const val = e.currentTarget.value
                setMonthlyTokenBudget(val ? Number(val) : null)
              }}
              placeholder={t('featureBudget')}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? t('saving') : t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
