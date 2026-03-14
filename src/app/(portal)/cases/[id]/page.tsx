'use client'

import { use } from 'react'
import { ArrowLeft, ChevronDown, ChevronUp, FileQuestion, Link } from 'lucide-react'
import {
  CaseDetailHeader,
  CaseTimeline,
  CaseTaskList,
  CaseArtifactPanel,
  EditCaseDialog,
  CaseComments,
} from '@/components/cases'
import { LoadingSpinner, EmptyState } from '@/components/common'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CaseStatus } from '@/enums'
import { useCaseDetailPage } from '@/hooks/useCaseDetailPage'
import { cn } from '@/lib/utils'
import type { CaseDetailPageProps } from '@/types'

export default function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { id } = use(params)

  const {
    t,
    router,
    isLoading,
    isError,
    caseItem,
    members,
    cycles,
    currentUserId,
    isAdmin,
    ownerName,
    editDialogOpen,
    setEditDialogOpen,
    descriptionExpanded,
    toggleDescription,
    editInitialValues,
    updateCasePending,
    createTaskPending,
    createArtifactPending,
    handleStatusChange,
    handleAssigneeChange,
    handleCycleChange,
    handleEditClick,
    handleEditSubmit,
    handleToggleTask,
    handleAddTask,
    handleDeleteTask,
    handleAddArtifact,
    handleDeleteArtifact,
  } = useCaseDetailPage(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    )
  }

  if (isError || !caseItem) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/cases')}>
          <ArrowLeft className="h-4 w-4" />
          {t('backToCases')}
        </Button>
        <EmptyState
          icon={<FileQuestion className="h-6 w-6" />}
          title={t('caseNotFoundTitle')}
          description={t('caseNotFoundDescription')}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.push('/cases')}>
        <ArrowLeft className="h-4 w-4" />
        {t('backToCases')}
      </Button>

      <CaseDetailHeader
        caseItem={caseItem}
        ownerName={ownerName}
        members={members}
        cycles={cycles}
        onEdit={handleEditClick}
        onStatusChange={handleStatusChange}
        onAssigneeChange={handleAssigneeChange}
        onCycleChange={handleCycleChange}
      />

      <EditCaseDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleEditSubmit}
        initialValues={editInitialValues}
        loading={updateCasePending}
      />

      {caseItem.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('fieldDescription')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div
              className={cn(
                'overflow-y-auto transition-[max-height] duration-300',
                descriptionExpanded ? 'max-h-[400px]' : 'max-h-[100px]'
              )}
            >
              <p className="text-muted-foreground text-sm break-all whitespace-pre-wrap">
                {caseItem.description}
              </p>
            </div>
            {caseItem.description.length > 200 && (
              <Button variant="ghost" size="sm" className="self-center" onClick={toggleDescription}>
                {descriptionExpanded ? (
                  <>
                    <ChevronUp className="me-1 h-4 w-4" />
                    {t('showLess')}
                  </>
                ) : (
                  <>
                    <ChevronDown className="me-1 h-4 w-4" />
                    {t('showMore')}
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Timeline + Comments - wider left column */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('timeline')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CaseTimeline entries={caseItem.timeline ?? []} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <CaseComments
                caseId={id}
                currentUserId={currentUserId}
                isAdmin={isAdmin}
                isCaseClosed={caseItem.status === CaseStatus.CLOSED}
              />
            </CardContent>
          </Card>
        </div>

        {/* Tasks + Artifacts + Linked Alerts - right column */}
        <div className="flex flex-col gap-6">
          {caseItem.linkedAlerts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Link className="h-4 w-4" />
                  {t('linkedAlerts')}
                  <Badge variant="secondary">{caseItem.linkedAlerts.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {caseItem.linkedAlerts.map(alertId => (
                    <li key={alertId} className="flex items-center gap-2">
                      <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 font-mono text-xs">
                        {alertId}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('tasks')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CaseTaskList
                tasks={caseItem.tasks ?? []}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                addingTask={createTaskPending}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('artifacts')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CaseArtifactPanel
                artifacts={caseItem.artifacts ?? []}
                onAddArtifact={handleAddArtifact}
                onDeleteArtifact={handleDeleteArtifact}
                addingArtifact={createArtifactPending}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
