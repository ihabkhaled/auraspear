'use client'

import { use } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ArrowLeft, FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner, EmptyState } from '@/components/common'
import {
  CaseDetailHeader,
  CaseTimeline,
  CaseTaskList,
  CaseArtifactPanel,
} from '@/components/cases'
import { useCase } from '@/hooks'

interface CaseDetailPageProps {
  params: Promise<{ id: string }>
}

export default function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { id } = use(params)
  const t = useTranslations('cases')
  const router = useRouter()

  const { data, isLoading, isError } = useCase(id)
  const caseItem = data?.data

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

      <CaseDetailHeader caseItem={caseItem} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Timeline - wider left column */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('timeline')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CaseTimeline entries={caseItem.timeline} />
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
              <CaseTaskList tasks={caseItem.tasks} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('artifacts')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CaseArtifactPanel artifacts={caseItem.artifacts} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
