import { RotateCcw, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RoleSettingsToolbarProps {
  isDirty: boolean
  isSaving: boolean
  isResetting: boolean
  onSave: () => void
  onReset: () => void
  t: (key: string) => string
}

export function RoleSettingsToolbar({
  isDirty,
  isSaving,
  isResetting,
  onSave,
  onReset,
  t,
}: RoleSettingsToolbarProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        disabled={isResetting || isSaving}
        className="gap-1.5"
      >
        <RotateCcw className="h-4 w-4" />
        {isResetting ? t('roleSettings.resetting') : t('roleSettings.reset')}
      </Button>
      <Button
        size="sm"
        onClick={onSave}
        disabled={!isDirty || isSaving || isResetting}
        className="gap-1.5"
      >
        <Save className="h-4 w-4" />
        {isSaving ? t('roleSettings.saving') : t('roleSettings.save')}
      </Button>
    </div>
  )
}
