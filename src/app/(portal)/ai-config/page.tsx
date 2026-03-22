'use client'

import { Globe, Plus, Settings2, ShieldCheck } from 'lucide-react'
import {
  AgentConfigCard,
  AgentConfigEditDialog,
  ApprovalCard,
  OsintSourceCard,
  OsintSourceDialog,
} from '@/components/ai-config'
import { LoadingSpinner, PageHeader } from '@/components/common'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ApprovalStatus } from '@/enums'
import { useAiConfigPage } from '@/hooks/useAiConfigPage'

export default function AiConfigPage() {
  const {
    t,
    activeTab,
    setActiveTab,
    canEdit,
    canManageOsint,
    canManageApprovals,
    agentConfigs,
    agentConfigsLoading,
    editDialogOpen,
    setEditDialogOpen,
    selectedConfig,
    handleEditAgent,
    handleUpdateAgent,
    updateConfigLoading,
    handleToggleAgent,
    availableConnectors,
    osintSources,
    osintSourcesLoading,
    osintDialogOpen,
    setOsintDialogOpen,
    selectedOsintSource,
    handleOpenOsintCreate,
    handleEditOsint,
    handleOsintSubmit,
    osintSubmitLoading,
    handleDeleteOsint,
    handleTestOsint,
    testOsintLoading,
    approvals,
    approvalsLoading,
    approvalFilter,
    setApprovalFilter,
    handleResolveApproval,
    resolveApprovalLoading,
  } = useAiConfigPage()

  return (
    <div className="space-y-4">
      <PageHeader title={t('title')} description={t('description')} />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="agents">
            <Settings2 className="mr-1.5 h-3.5 w-3.5" />
            {t('tabAgents')}
          </TabsTrigger>
          <TabsTrigger value="osint">
            <Globe className="mr-1.5 h-3.5 w-3.5" />
            {t('tabOsint')}
          </TabsTrigger>
          <TabsTrigger value="approvals">
            <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
            {t('tabApprovals')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="mt-4">
          {agentConfigsLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {agentConfigs.map(config => (
                <AgentConfigCard
                  key={config.agentId}
                  config={config}
                  onEdit={canEdit ? handleEditAgent : () => {}}
                  onToggle={canEdit ? handleToggleAgent : () => {}}
                  availableConnectors={availableConnectors}
                  t={t}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="osint" className="mt-4">
          {canManageOsint && (
            <div className="mb-4 flex justify-end">
              <Button onClick={handleOpenOsintCreate}>
                <Plus className="mr-1.5 h-4 w-4" />
                {t('addSource')}
              </Button>
            </div>
          )}

          {osintSourcesLoading ? (
            <LoadingSpinner />
          ) : osintSources.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Globe className="text-muted-foreground mb-4 h-12 w-12" />
              <p className="text-muted-foreground text-sm font-medium">{t('noSources')}</p>
              <p className="text-muted-foreground mt-1 text-xs">{t('noSourcesDesc')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {osintSources.map(source => (
                <OsintSourceCard
                  key={source.id}
                  source={source}
                  onEdit={canManageOsint ? handleEditOsint : () => {}}
                  onDelete={canManageOsint ? s => void handleDeleteOsint(s) : () => {}}
                  onTest={handleTestOsint}
                  testLoading={testOsintLoading}
                  t={t}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approvals" className="mt-4">
          <div className="mb-4 flex justify-end">
            <Select value={approvalFilter} onValueChange={setApprovalFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ApprovalStatus.PENDING}>{t('pendingApprovals')}</SelectItem>
                <SelectItem value="all">{t('allApprovals')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {approvalsLoading ? (
            <LoadingSpinner />
          ) : approvals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <ShieldCheck className="text-muted-foreground mb-4 h-12 w-12" />
              <p className="text-muted-foreground text-sm font-medium">{t('noApprovals')}</p>
              <p className="text-muted-foreground mt-1 text-xs">{t('noApprovalsDesc')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {approvals.map(approval => (
                <ApprovalCard
                  key={approval.id}
                  approval={approval}
                  onResolve={canManageApprovals ? handleResolveApproval : () => {}}
                  resolveLoading={resolveApprovalLoading}
                  t={t}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AgentConfigEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        config={selectedConfig}
        onSubmit={handleUpdateAgent}
        loading={updateConfigLoading}
        availableConnectors={availableConnectors}
        t={t}
      />

      <OsintSourceDialog
        open={osintDialogOpen}
        onOpenChange={setOsintDialogOpen}
        source={selectedOsintSource}
        onSubmit={handleOsintSubmit}
        loading={osintSubmitLoading}
        t={t}
      />
    </div>
  )
}
