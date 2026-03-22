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
import { OsintAuthType, OsintSourceType } from '@/enums'
import { useOsintSourceDialog } from '@/hooks/useOsintSourceDialog'
import type { OsintSourceDialogProps } from '@/types'

export function OsintSourceDialog({
  open,
  onOpenChange,
  source,
  onSubmit,
  loading,
  t,
}: OsintSourceDialogProps) {
  const {
    isEdit,
    isCustom,
    sourceType,
    setSourceType,
    name,
    setName,
    apiKey,
    setApiKey,
    baseUrl,
    setBaseUrl,
    authType,
    setAuthType,
    headerName,
    setHeaderName,
    queryParam,
    setQueryParam,
    responsePath,
    setResponsePath,
    requestMethod,
    setRequestMethod,
    timeout,
    setTimeout: setTimeoutValue,
    handleSubmit,
  } = useOsintSourceDialog(source, open, onSubmit)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? t('editSource') : t('addSource')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!isEdit && (
            <div className="space-y-2">
              <Label>{t('sourceType')}</Label>
              <Select value={sourceType} onValueChange={v => setSourceType(v as OsintSourceType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(OsintSourceType).map(st => (
                    <SelectItem key={st} value={st}>
                      {st}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>{t('sourceName')}</Label>
            <Input value={name} onChange={e => setName(e.currentTarget.value)} />
          </div>

          <div className="space-y-2">
            <Label>{t('apiKey')}</Label>
            <Input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.currentTarget.value)}
              placeholder={isEdit ? '********' : ''}
            />
          </div>

          {(isCustom || isEdit) && (
            <>
              <div className="space-y-2">
                <Label>{t('baseUrl')}</Label>
                <Input value={baseUrl} onChange={e => setBaseUrl(e.currentTarget.value)} />
              </div>

              <div className="space-y-2">
                <Label>{t('authType')}</Label>
                <Select value={authType} onValueChange={v => setAuthType(v as OsintAuthType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(OsintAuthType).map(at => (
                      <SelectItem key={at} value={at}>
                        {at}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t('headerName')}</Label>
                  <Input value={headerName} onChange={e => setHeaderName(e.currentTarget.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t('queryParam')}</Label>
                  <Input value={queryParam} onChange={e => setQueryParam(e.currentTarget.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t('responsePath')}</Label>
                  <Input
                    value={responsePath}
                    onChange={e => setResponsePath(e.currentTarget.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('requestMethod')}</Label>
                  <Select value={requestMethod} onValueChange={setRequestMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('timeout')}</Label>
                <Input
                  type="number"
                  min="1000"
                  value={timeout}
                  onChange={e => setTimeoutValue(e.currentTarget.value)}
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={loading || name.length === 0}>
            {loading ? t('saving') : t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
