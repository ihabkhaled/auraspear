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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { AiOutputFormat, AiTriggerMode } from '@/enums'
import { useAgentConfigEditDialog } from '@/hooks/useAgentConfigEditDialog'
import type { AgentConfigEditDialogProps } from '@/types'

export function AgentConfigEditDialog({
  open,
  onOpenChange,
  config,
  onSubmit,
  loading,
  availableConnectors,
  t,
}: AgentConfigEditDialogProps) {
  const {
    enabled,
    setEnabled,
    providerMode,
    setProviderMode,
    model,
    setModel,
    temperature,
    setTemperature,
    maxTokens,
    setMaxTokens,
    triggerMode,
    setTriggerMode,
    outputFormat,
    setOutputFormat,
    presentationSkills,
    setPresentationSkills,
    systemPrompt,
    setSystemPrompt,
    promptSuffix,
    setPromptSuffix,
    indexPatterns,
    setIndexPatterns,
    tokensPerHourLimit,
    setTokensPerHourLimit,
    tokensPerDayLimit,
    setTokensPerDayLimit,
    tokensPerMonthLimit,
    setTokensPerMonthLimit,
    maxConcurrentRuns,
    setMaxConcurrentRuns,
    handleSubmit,
  } = useAgentConfigEditDialog(config, onSubmit)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{config?.displayName ?? t('configure')}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="general">{t('generalTab')}</TabsTrigger>
            <TabsTrigger value="provider">{t('providerTab')}</TabsTrigger>
            <TabsTrigger value="tokens">{t('tokensTab')}</TabsTrigger>
            <TabsTrigger value="triggers">{t('triggersTab')}</TabsTrigger>
            <TabsTrigger value="advanced">{t('advancedTab')}</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <Label>{t('enabled')}</Label>
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </div>
            <div className="space-y-2">
              <Label>{t('outputFormat')}</Label>
              <Select
                value={outputFormat}
                onValueChange={v => setOutputFormat(v as AiOutputFormat)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={AiOutputFormat.STRUCTURED_JSON}>{t('outputJson')}</SelectItem>
                  <SelectItem value={AiOutputFormat.MARKDOWN}>{t('outputMarkdown')}</SelectItem>
                  <SelectItem value={AiOutputFormat.RICH_CARDS}>{t('outputRichCards')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label>{t('presentationSkills')}</Label>
              <Switch checked={presentationSkills} onCheckedChange={setPresentationSkills} />
            </div>
          </TabsContent>

          <TabsContent value="provider" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>{t('provider')}</Label>
              <Select value={providerMode} onValueChange={v => setProviderMode(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableConnectors.map(connector => (
                    <SelectItem
                      key={connector.key}
                      value={connector.key}
                      disabled={!connector.enabled}
                    >
                      {connector.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('model')}</Label>
              <Input value={model} onChange={e => setModel(e.currentTarget.value)} />
            </div>
            <div className="space-y-2">
              <Label>{t('temperature')}</Label>
              <Input
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={e => setTemperature(e.currentTarget.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('maxTokens')}</Label>
              <Input
                type="number"
                min="1"
                value={maxTokens}
                onChange={e => setMaxTokens(e.currentTarget.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="tokens" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>{t('tokensPerHour')}</Label>
              <Input
                type="number"
                min="0"
                value={tokensPerHourLimit}
                onChange={e => setTokensPerHourLimit(e.currentTarget.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('tokensPerDay')}</Label>
              <Input
                type="number"
                min="0"
                value={tokensPerDayLimit}
                onChange={e => setTokensPerDayLimit(e.currentTarget.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('tokensPerMonth')}</Label>
              <Input
                type="number"
                min="0"
                value={tokensPerMonthLimit}
                onChange={e => setTokensPerMonthLimit(e.currentTarget.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('maxConcurrent')}</Label>
              <Input
                type="number"
                min="1"
                max="20"
                value={maxConcurrentRuns}
                onChange={e => setMaxConcurrentRuns(e.currentTarget.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="triggers" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>{t('triggerMode')}</Label>
              <Select value={triggerMode} onValueChange={v => setTriggerMode(v as AiTriggerMode)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={AiTriggerMode.MANUAL_ONLY}>{t('triggerManual')}</SelectItem>
                  <SelectItem value={AiTriggerMode.AUTO_ON_ALERT}>
                    {t('triggerAutoAlert')}
                  </SelectItem>
                  <SelectItem value={AiTriggerMode.AUTO_BY_AGENT}>
                    {t('triggerAutoAgent')}
                  </SelectItem>
                  <SelectItem value={AiTriggerMode.SCHEDULED}>{t('triggerScheduled')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>{t('systemPrompt')}</Label>
              <Textarea
                value={systemPrompt ?? ''}
                onChange={e => setSystemPrompt(e.currentTarget.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('promptSuffix')}</Label>
              <Textarea
                value={promptSuffix ?? ''}
                onChange={e => setPromptSuffix(e.currentTarget.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('indexPatterns')}</Label>
              <Input
                value={indexPatterns}
                onChange={e => setIndexPatterns(e.currentTarget.value)}
                placeholder="logs-*, alerts-*"
              />
            </div>
          </TabsContent>
        </Tabs>

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
