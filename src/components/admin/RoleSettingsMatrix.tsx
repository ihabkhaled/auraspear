import { ChevronDown } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import type { RoleSettingsMatrixProps } from '@/types'

export function RoleSettingsMatrix({
  permissionGroups,
  configurableRoles,
  isChecked,
  onToggle,
  disabled,
  permissionLabelMap,
  t,
}: RoleSettingsMatrixProps) {
  return (
    <div className="space-y-4">
      {/* Header row with role names */}
      <div className="bg-card border-border sticky top-0 z-10 hidden rounded-lg border p-3 lg:grid lg:grid-cols-6 lg:items-center lg:gap-4">
        <div className="text-muted-foreground text-sm font-semibold">
          {t('roleSettings.permission')}
        </div>
        {configurableRoles.map(role => (
          <div key={role} className="text-center text-xs font-semibold">
            {t(`roleSettings.roles.${role}`)}
          </div>
        ))}
      </div>

      {/* Permission groups */}
      {permissionGroups.map(group => (
        <Collapsible key={group.key} defaultOpen>
          <div className="border-border rounded-lg border">
            <CollapsibleTrigger className="hover:bg-muted/50 flex w-full cursor-pointer items-center justify-between rounded-t-lg p-3 transition-colors">
              <span className="text-sm font-semibold">{t(group.labelKey)}</span>
              <ChevronDown className="text-muted-foreground h-4 w-4 transition-transform [[data-state=open]>&]:rotate-180" />
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="divide-border divide-y">
                {group.permissions.map(permission => (
                  <div
                    key={permission}
                    className={cn(
                      'grid grid-cols-1 items-center gap-2 p-3 lg:grid-cols-6 lg:gap-4',
                      'hover:bg-muted/30 transition-colors'
                    )}
                  >
                    <div className="text-muted-foreground text-sm">
                      {t(String(Reflect.get(permissionLabelMap, permission) ?? permission))}
                    </div>
                    {configurableRoles.map(role => (
                      <div key={role} className="flex items-center gap-2 lg:justify-center">
                        <span className="text-muted-foreground text-xs lg:hidden">
                          {t(`roleSettings.roles.${role}`)}:
                        </span>
                        <Checkbox
                          className="cursor-pointer"
                          checked={isChecked(role, permission)}
                          onCheckedChange={checked => onToggle(role, permission, Boolean(checked))}
                          disabled={disabled}
                          aria-label={`${t(String(Reflect.get(permissionLabelMap, permission) ?? permission))} - ${t(`roleSettings.roles.${role}`)}`}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      ))}
    </div>
  )
}
