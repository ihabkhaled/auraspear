'use client'

import { Layers, Plus } from 'lucide-react'
import { DataTable, PageHeader, Pagination } from '@/components/common'
import { NormalizationCreateDialog } from '@/components/normalization/NormalizationCreateDialog'
import { NormalizationDetailPanel } from '@/components/normalization/NormalizationDetailPanel'
import { NormalizationEditDialog } from '@/components/normalization/NormalizationEditDialog'
import { NormalizationFilters } from '@/components/normalization/NormalizationFilters'
import { NormalizationKpiCards } from '@/components/normalization/NormalizationKpiCards'
import { NormalizationSourceType } from '@/enums'
import { useNormalizationPage } from '@/hooks/useNormalizationPage'

export default function NormalizationPage() {
  const {
    t,
    data,
    stats,
    statsLoading,
    columns,
    isFetching,
    pagination,
    searchQuery,
    sourceTypeFilter,
    statusFilter,
    sortBy,
    sortOrder,
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    detailOpen,
    setDetailOpen,
    selectedPipeline,
    createLoading,
    editLoading,
    handleSearchChange,
    handleSourceTypeChange,
    handleStatusChange,
    handleSort,
    handleCreate,
    handleEdit,
  } = useNormalizationPage()

  const editInitialValues = selectedPipeline
    ? {
        name: selectedPipeline.name,
        sourceType: selectedPipeline.sourceType,
        parserConfig: '{}',
        fieldMappings: '{}',
      }
    : {
        name: '',
        sourceType: NormalizationSourceType.SYSLOG,
        parserConfig: '{}',
        fieldMappings: '{}',
      }

  return (
    <div className="space-y-4">
      <PageHeader
        title={t('title')}
        description={t('description')}
        action={{
          label: t('createPipeline'),
          icon: <Plus className="h-4 w-4" />,
          onClick: () => setCreateOpen(true),
        }}
      />

      <NormalizationKpiCards stats={stats} isLoading={statsLoading} />

      <NormalizationFilters
        searchQuery={searchQuery}
        sourceTypeFilter={sourceTypeFilter}
        statusFilter={statusFilter}
        onSearchChange={handleSearchChange}
        onSourceTypeChange={handleSourceTypeChange}
        onStatusChange={handleStatusChange}
      />

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        loading={isFetching}
        emptyMessage={t('noPipelines')}
        emptyIcon={<Layers className="h-6 w-6" />}
        emptyDescription={t('emptyDescription')}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={pagination.setPage}
        total={pagination.total}
      />

      <NormalizationCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        loading={createLoading}
      />

      <NormalizationEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleEdit}
        initialValues={editInitialValues}
        loading={editLoading}
      />

      <NormalizationDetailPanel
        pipeline={selectedPipeline}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}
