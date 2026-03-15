'use client'

import { Plus, Workflow } from 'lucide-react'
import { DataTable, PageHeader, Pagination } from '@/components/common'
import {
  SoarKpiCards,
  SoarFilters,
  SoarCreateDialog,
  SoarEditDialog,
  SoarDeleteDialog,
  SoarRunDialog,
  SoarDetailPanel,
} from '@/components/soar'
import { useSoarPage } from '@/hooks/useSoarPage'

export default function SoarPage() {
  const {
    t,
    data,
    stats,
    columns,
    isFetching,
    pagination,
    searchQuery,
    statusFilter,
    triggerFilter,
    sortBy,
    sortOrder,
    handleSearchChange,
    handleStatusChange,
    handleTriggerChange,
    handleSort,
    handleRowClick,
    createOpen,
    setCreateOpen,
    editOpen,
    setEditOpen,
    detailOpen,
    setDetailOpen,
    selectedPlaybook,
    deletePlaybookId,
    deletePlaybookName,
    runPlaybookId,
    runPlaybookName,
    editInitialValues,
    handleCreate,
    handleEdit,
    handleDelete,
    handleExecute,
    createLoading,
    editLoading,
  } = useSoarPage()

  return (
    <div className="space-y-4">
      <PageHeader
        title={t('title')}
        description={t('description')}
        action={{
          label: t('createPlaybook'),
          icon: <Plus className="h-4 w-4" />,
          onClick: () => setCreateOpen(true),
        }}
      />

      <SoarKpiCards stats={stats} />

      <SoarFilters
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        triggerFilter={triggerFilter}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onTriggerChange={handleTriggerChange}
      />

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        loading={isFetching}
        onRowClick={handleRowClick}
        emptyMessage={t('noPlaybooks')}
        emptyIcon={<Workflow className="h-6 w-6" />}
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

      <SoarCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        loading={createLoading}
      />

      <SoarEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleEdit}
        initialValues={editInitialValues}
        loading={editLoading}
      />

      <SoarDeleteDialog
        playbookId={deletePlaybookId}
        playbookName={deletePlaybookName}
        onConfirm={handleDelete}
      />

      <SoarRunDialog
        playbookId={runPlaybookId}
        playbookName={runPlaybookName}
        onConfirm={handleExecute}
      />

      <SoarDetailPanel playbook={selectedPlaybook} open={detailOpen} onOpenChange={setDetailOpen} />
    </div>
  )
}
