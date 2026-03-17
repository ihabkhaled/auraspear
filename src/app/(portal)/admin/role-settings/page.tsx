'use client'

import { RoleSettingsMatrix, RoleSettingsToolbar } from '@/components/admin'
import { PageHeader, LoadingSpinner } from '@/components/common'
import { Card, CardContent } from '@/components/ui/card'
import { useRoleSettingsPage } from '@/hooks/useRoleSettingsPage'

export default function RoleSettingsPage() {
  const {
    t,
    isLoading,
    isDirty,
    isSaving,
    isResetting,
    permissionGroups,
    permissionLabelMap,
    configurableRoles,
    handleToggle,
    handleSave,
    handleReset,
    isChecked,
    canEditRoles,
  } = useRoleSettingsPage()

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('roleSettings.title')} description={t('roleSettings.description')} />

      <Card>
        <CardContent className="space-y-4 pt-6">
          {canEditRoles && (
            <RoleSettingsToolbar
              isDirty={isDirty}
              isSaving={isSaving}
              isResetting={isResetting}
              onSave={handleSave}
              onReset={handleReset}
              t={t}
            />
          )}

          <RoleSettingsMatrix
            permissionGroups={permissionGroups}
            configurableRoles={configurableRoles}
            isChecked={isChecked}
            onToggle={handleToggle}
            disabled={!canEditRoles || isSaving || isResetting}
            permissionLabelMap={permissionLabelMap}
            t={t}
          />
        </CardContent>
      </Card>
    </div>
  )
}
