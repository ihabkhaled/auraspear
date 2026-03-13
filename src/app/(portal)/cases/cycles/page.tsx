'use client'

import { Plus, History } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CycleHistoryTable, CreateCycleDialog } from '@/components/cases'
import { PageHeader, LoadingSpinner, EmptyState, Pagination } from '@/components/common'
import { useCycleHistoryPage } from '@/hooks/useCycleHistoryPage'

export default function CycleHistoryPage() {
  const t = useTranslations('cases.cycles')

  const {
    isAdmin,
    cycles,
    isLoading,
    isFetching,
    createDialogOpen,
    setCreateDialogOpen,
    createCyclePending,
    sortBy,
    sortOrder,
    handleSort,
    handleCycleClick,
    handleCreateCycle,
    pagination,
  } = useCycleHistoryPage()

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('historyTitle')}
        description={t('historyDescription')}
        {...(isAdmin
          ? {
              action: {
                label: t('createCycle'),
                icon: <Plus className="h-4 w-4" />,
                onClick: () => setCreateDialogOpen(true),
              },
            }
          : {})}
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : cycles.length === 0 ? (
        <EmptyState
          icon={<History className="h-6 w-6" />}
          title={t('noCycles')}
          description={t('noCyclesDescription')}
        />
      ) : (
        <>
          <CycleHistoryTable
            cycles={cycles}
            onCycleClick={handleCycleClick}
            loading={isFetching}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={pagination.setPage}
          />
        </>
      )}

      <CreateCycleDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateCycle}
        loading={createCyclePending}
      />
    </div>
  )
}
