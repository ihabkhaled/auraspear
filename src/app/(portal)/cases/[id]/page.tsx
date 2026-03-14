'use client'

import { use, useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronDown, ChevronUp, FileQuestion, Link } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  CaseDetailHeader,
  CaseTimeline,
  CaseTaskList,
  CaseArtifactPanel,
  EditCaseDialog,
} from '@/components/cases'
import {
  LoadingSpinner,
  EmptyState,
  Toast,
  SweetAlertDialog,
  SweetAlertIcon,
} from '@/components/common'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CaseStatus } from '@/enums'
import { CaseSeverity, CaseTaskStatus, SortOrder } from '@/enums'
import {
  useCase,
  useTenantMembers,
  useUpdateCase,
  useUpdateCaseTask,
  useCreateCaseTask,
  useDeleteCaseTask,
  useCreateCaseArtifact,
  useDeleteCaseArtifact,
} from '@/hooks'
import { useCaseCycles } from '@/hooks/useCaseCycles'
import { getErrorKey } from '@/lib/api-error'
import { cn } from '@/lib/utils'
import type { CaseDetailPageProps, EditCaseFormValues } from '@/types'

export default function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { id } = use(params)
  const t = useTranslations('cases')
  const router = useRouter()

  const { data, isLoading, isError } = useCase(id)
  const updateCase = useUpdateCase()
  const updateTask = useUpdateCaseTask(id)
  const createTask = useCreateCaseTask(id)
  const deleteTask = useDeleteCaseTask(id)
  const createArtifact = useCreateCaseArtifact(id)
  const deleteArtifact = useDeleteCaseArtifact(id)
  const { data: membersData } = useTenantMembers()
  const { data: cyclesData } = useCaseCycles({
    limit: 100,
    sortBy: 'createdAt',
    sortOrder: SortOrder.DESC,
  })
  const caseItem = data?.data
  const members = membersData?.data ?? []
  const cycles = (cyclesData?.data ?? []).map(c => ({ id: c.id, name: c.name, status: c.status }))

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)

  const ownerName = caseItem?.ownerName ?? undefined

  const editInitialValues = useMemo(
    () => ({
      title: caseItem?.title ?? '',
      description: caseItem?.description ?? '',
      severity: caseItem?.severity ?? CaseSeverity.MEDIUM,
    }),
    [caseItem?.title, caseItem?.description, caseItem?.severity]
  )

  const handleStatusChange = useCallback(
    (status: CaseStatus) => {
      updateCase.mutate(
        { id, data: { status } },
        {
          onSuccess: () => {
            Toast.success(t('statusUpdated'))
          },
          onError: (error: unknown) => {
            Toast.error(t(getErrorKey(error)))
          },
        }
      )
    },
    [id, updateCase, t]
  )

  const handleAssigneeChange = useCallback(
    (userId: string | null) => {
      updateCase.mutate(
        { id, data: { ownerUserId: userId } },
        {
          onSuccess: () => {
            Toast.success(t('assigneeUpdated'))
          },
          onError: (error: unknown) => {
            Toast.error(t(getErrorKey(error)))
          },
        }
      )
    },
    [id, updateCase, t]
  )

  const handleCycleChange = useCallback(
    (cycleId: string | null) => {
      updateCase.mutate(
        { id, data: { cycleId } },
        {
          onSuccess: () => {
            Toast.success(t('cycleUpdated'))
          },
          onError: (error: unknown) => {
            Toast.error(t(getErrorKey(error)))
          },
        }
      )
    },
    [id, updateCase, t]
  )

  const handleEditClick = useCallback(() => {
    setEditDialogOpen(true)
  }, [])

  const handleEditSubmit = useCallback(
    (formData: EditCaseFormValues) => {
      updateCase.mutate(
        {
          id,
          data: {
            title: formData.title,
            description: formData.description,
            severity: formData.severity,
          },
        },
        {
          onSuccess: () => {
            setEditDialogOpen(false)
            Toast.success(t('caseUpdated'))
          },
          onError: (error: unknown) => {
            Toast.error(t(getErrorKey(error)))
          },
        }
      )
    },
    [id, updateCase, t]
  )

  const handleToggleTask = useCallback(
    (taskId: string, completed: boolean) => {
      updateTask.mutate(
        {
          taskId,
          data: {
            status: completed ? CaseTaskStatus.COMPLETED : CaseTaskStatus.PENDING,
          },
        },
        {
          onSuccess: () => {
            Toast.success(t('taskUpdated'))
          },
          onError: (error: unknown) => {
            Toast.error(t(getErrorKey(error)))
          },
        }
      )
    },
    [updateTask, t]
  )

  const handleAddTask = useCallback(
    (title: string) => {
      createTask.mutate(
        { title },
        {
          onSuccess: () => {
            Toast.success(t('taskAdded'))
          },
          onError: (error: unknown) => {
            Toast.error(t(getErrorKey(error)))
          },
        }
      )
    },
    [createTask, t]
  )

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      const confirmed = await SweetAlertDialog.show({
        text: t('confirmDeleteTask'),
        icon: SweetAlertIcon.QUESTION,
      })
      if (!confirmed) {
        return
      }
      deleteTask.mutate(taskId, {
        onSuccess: () => {
          Toast.success(t('taskDeleted'))
        },
        onError: (error: unknown) => {
          Toast.error(t(getErrorKey(error)))
        },
      })
    },
    [deleteTask, t]
  )

  const handleAddArtifact = useCallback(
    (artifactData: { type: string; value: string; source?: string }) => {
      createArtifact.mutate(artifactData, {
        onSuccess: () => {
          Toast.success(t('artifactAdded'))
        },
        onError: (error: unknown) => {
          Toast.error(t(getErrorKey(error)))
        },
      })
    },
    [createArtifact, t]
  )

  const handleDeleteArtifact = useCallback(
    async (artifactId: string) => {
      const confirmed = await SweetAlertDialog.show({
        text: t('confirmDeleteArtifact'),
        icon: SweetAlertIcon.QUESTION,
      })
      if (!confirmed) {
        return
      }
      deleteArtifact.mutate(artifactId, {
        onSuccess: () => {
          Toast.success(t('artifactDeleted'))
        },
        onError: (error: unknown) => {
          Toast.error(t(getErrorKey(error)))
        },
      })
    },
    [deleteArtifact, t]
  )

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
        loading={updateCase.isPending}
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
              <Button
                variant="ghost"
                size="sm"
                className="self-center"
                onClick={() => setDescriptionExpanded(prev => !prev)}
              >
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
        {/* Timeline - wider left column */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('timeline')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CaseTimeline entries={caseItem.timeline ?? []} />
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
                addingTask={createTask.isPending}
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
                addingArtifact={createArtifact.isPending}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
