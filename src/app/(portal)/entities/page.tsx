'use client'

import { PageHeader, DataTable, Pagination, LoadingSpinner } from '@/components/common'
import { EntityFilters, RiskScoreBadge } from '@/components/entities'
import { Badge } from '@/components/ui/badge'
import { useEntitiesPage } from '@/hooks/useEntitiesPage'
import { formatTimestamp } from '@/lib/utils'
import type { Column, EntityRecord } from '@/types'

export default function EntitiesPage() {
  const {
    t,
    searchQuery,
    typeFilter,
    sortBy,
    sortOrder,
    pagination,
    data,
    isFetching,
    handleSearchChange,
    handleTypeChange,
    handleSort,
  } = useEntitiesPage()

  const entities: EntityRecord[] = data?.data ?? []

  const columns: Column<EntityRecord>[] = [
    {
      key: 'type',
      label: t('colType'),
      sortable: true,
      render: (value) => (
        <Badge variant="outline" className="text-xs uppercase">
          {value as string}
        </Badge>
      ),
    },
    {
      key: 'value',
      label: t('colValue'),
      sortable: true,
    },
    {
      key: 'riskScore',
      label: t('colRiskScore'),
      sortable: true,
      render: (value) => <RiskScoreBadge score={value as number} />,
    },
    {
      key: 'firstSeen',
      label: t('colFirstSeen'),
      sortable: true,
      render: (value) => formatTimestamp(value as string),
    },
    {
      key: 'lastSeen',
      label: t('colLastSeen'),
      sortable: true,
      render: (value) => formatTimestamp(value as string),
    },
  ]

  return (
    <div className="space-y-4">
      <PageHeader title={t('title')} description={t('description')} />

      <EntityFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        typeFilter={typeFilter}
        onTypeChange={handleTypeChange}
        t={t}
      />

      {isFetching && entities.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={entities}
            emptyMessage={t('noEntities')}
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
    </div>
  )
}
