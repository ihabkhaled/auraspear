'use client'

import { Zap } from 'lucide-react'
import { DataTable, Pagination } from '@/components/common'
import { useAiAgentSessionTable } from '@/hooks/useAiAgentSessionTable'
import type { AiAgentSessionTableProps } from '@/types'

export function AiAgentSessionTable(props: AiAgentSessionTableProps) {
  const { t, data, isFetching, columns, pagination } = useAiAgentSessionTable(props)

  return (
    <div className="flex flex-col gap-3">
      <DataTable
        columns={columns}
        data={data}
        loading={isFetching}
        emptyMessage={t('noSessions')}
        emptyIcon={<Zap className="h-5 w-5" />}
        emptyDescription={t('noSessionsDescription')}
      />
      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={pagination.setPage}
        total={pagination.total}
      />
    </div>
  )
}
