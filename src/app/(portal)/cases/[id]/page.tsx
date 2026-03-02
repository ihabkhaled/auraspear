'use client'

import { use, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, FileQuestion } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CaseDetailHeader, CaseTimeline, CaseTaskList, CaseArtifactPanel } from '@/components/cases'
import { LoadingSpinner, EmptyState, Toast } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CaseStatus } from '@/enums'
import { useCase, useUpdateCase } from '@/hooks'
import { getErrorKey } from '@/lib/api-error'

interface CaseDetailPageProps {
  params: Promise<{ id: string }>
}

export default function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { id } = use(params)
  const t = useTranslations('cases')
  const router = useRouter()

  const { data, isLoading, isError } = useCase(id)
  const updateCase = useUpdateCase()
  const caseItem = data?.data

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

      <CaseDetailHeader caseItem={caseItem} onStatusChange={handleStatusChange} />

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

        {/* Tasks + Artifacts - right column */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('tasks')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CaseTaskList tasks={caseItem.tasks ?? []} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('artifacts')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CaseArtifactPanel artifacts={caseItem.artifacts ?? []} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
