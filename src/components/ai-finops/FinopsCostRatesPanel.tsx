'use client'

import { Pencil, Plus, Trash2 } from 'lucide-react'
import { DataTable, LoadingSpinner } from '@/components/common'
import { Button, Input } from '@/components/ui'
import { useAiFinopsCostRates } from '@/hooks'
import type { AiCostRate, Column } from '@/types'

export function FinopsCostRatesPanel() {
  const {
    t,
    canManage,
    rates,
    isLoading,
    isAdding,
    formProvider,
    formModel,
    formInputCost,
    formOutputCost,
    setFormProvider,
    setFormModel,
    setFormInputCost,
    setFormOutputCost,
    isSaving,
    startAdd,
    startEdit,
    resetForm,
    handleSave,
    handleDelete,
  } = useAiFinopsCostRates()

  const columns: Column<AiCostRate>[] = [
    { key: 'provider', label: t('costRates.provider') },
    { key: 'model', label: t('costRates.model') },
    {
      key: 'inputCostPer1k',
      label: t('costRates.inputCostPer1k'),
      render: value => `$${Number(value ?? 0).toFixed(4)}`,
    },
    {
      key: 'outputCostPer1k',
      label: t('costRates.outputCostPer1k'),
      render: value => `$${Number(value ?? 0).toFixed(4)}`,
    },
  ]

  if (canManage) {
    columns.push({
      key: 'id',
      label: '',
      render: (_value, row) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => startEdit(row)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)}>
            <Trash2 className="text-status-error h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    })
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-4">
      {canManage && !isAdding && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={startAdd}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            {t('costRates.add')}
          </Button>
        </div>
      )}

      {isAdding && (
        <div className="bg-muted/50 grid grid-cols-1 gap-3 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-5">
          <Input
            placeholder={t('costRates.provider')}
            value={formProvider}
            onChange={e => setFormProvider(e.currentTarget.value)}
          />
          <Input
            placeholder={t('costRates.model')}
            value={formModel}
            onChange={e => setFormModel(e.currentTarget.value)}
          />
          <Input
            type="number"
            step="0.0001"
            placeholder={t('costRates.inputCostPer1k')}
            value={formInputCost}
            onChange={e => setFormInputCost(e.currentTarget.value)}
          />
          <Input
            type="number"
            step="0.0001"
            placeholder={t('costRates.outputCostPer1k')}
            value={formOutputCost}
            onChange={e => setFormOutputCost(e.currentTarget.value)}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={
                isSaving || formProvider.trim().length === 0 || formModel.trim().length === 0
              }
            >
              {t('costRates.save')}
            </Button>
            <Button variant="outline" size="sm" onClick={resetForm}>
              {t('costRates.cancel')}
            </Button>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={rates}
        emptyMessage={t('costRates.empty')}
        loading={false}
      />
    </div>
  )
}
