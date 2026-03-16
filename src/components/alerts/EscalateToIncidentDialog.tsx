'use client'

import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { IncidentCategory, IncidentSeverity } from '@/enums'
import { useEscalateToIncidentDialog } from '@/hooks/useEscalateToIncidentDialog'
import type { EscalateToIncidentDialogProps } from '@/types'

export function EscalateToIncidentDialog({
  alert,
  open,
  onOpenChange,
}: EscalateToIncidentDialogProps) {
  const { t, tCommon, handleSubmit, isPending } = useEscalateToIncidentDialog(alert, onOpenChange)

  if (!alert) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="text-status-warning h-5 w-5" />
            {t('escalateToIncident')}
          </DialogTitle>
          <DialogDescription>{t('escalateDescription')}</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={e => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            handleSubmit({
              title: formData.get('title') as string,
              description: formData.get('description') as string,
              severity: formData.get('severity') as string,
              category: formData.get('category') as string,
            })
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="escalate-title">{tCommon('title')}</Label>
            <Input
              id="escalate-title"
              name="title"
              defaultValue={`[Escalated] ${alert.title}`}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="escalate-description">{tCommon('description')}</Label>
            <Textarea
              id="escalate-description"
              name="description"
              defaultValue={alert.description}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{tCommon('severity')}</Label>
              <Select name="severity" defaultValue={alert.severity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(IncidentSeverity).map(sev => (
                    <SelectItem key={sev} value={sev}>
                      <span className="capitalize">{sev}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('category')}</Label>
              <Select name="category" defaultValue={IncidentCategory.OTHER}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(IncidentCategory).map(cat => (
                    <SelectItem key={cat} value={cat}>
                      <span className="capitalize">{cat.replaceAll('_', ' ')}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {tCommon('cancel')}
            </Button>
            <Button type="submit" disabled={isPending}>
              <AlertTriangle className="h-4 w-4" />
              {t('escalate')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
