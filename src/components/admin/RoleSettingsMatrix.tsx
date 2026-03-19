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
      {/* Permission groups */}
      {permissionGroups.map(group => (
        <Collapsible key={group.key} defaultOpen>
          <div className="border-border rounded-lg border">
            <CollapsibleTrigger className="hover:bg-muted/50 flex w-full cursor-pointer items-center justify-between rounded-t-lg p-3 transition-colors">
              <span className="text-sm font-semibold">{t(group.labelKey)}</span>
              <ChevronDown className="text-muted-foreground h-4 w-4 transition-transform [[data-state=open]>&]:rotate-180" />
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="overflow-x-auto">
                <table className="w-full min-w-max border-collapse">
                  <thead>
                    <tr className="border-border border-b">
                      <th className="bg-card text-muted-foreground sticky left-0 z-10 px-3 py-2 text-start text-xs font-semibold">
                        {t('roleSettings.permission')}
                      </th>
                      {configurableRoles.map(role => (
                        <th
                          key={role}
                          className="px-2 py-2 text-center text-xs font-semibold whitespace-nowrap"
                        >
                          {t(`roleSettings.roles.${role}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {group.permissions.map(permission => (
                      <tr
                        key={permission}
                        className={cn(
                          'border-border border-b last:border-b-0',
                          'hover:bg-muted/30 transition-colors'
                        )}
                      >
                        <td className="bg-card text-muted-foreground sticky left-0 z-10 px-3 py-2 text-sm whitespace-nowrap">
                          {t(String(Reflect.get(permissionLabelMap, permission) ?? permission))}
                        </td>
                        {configurableRoles.map(role => (
                          <td key={role} className="px-2 py-2 text-center">
                            <Checkbox
                              className="mx-auto cursor-pointer"
                              checked={isChecked(role, permission)}
                              onCheckedChange={checked =>
                                onToggle(role, permission, Boolean(checked))
                              }
                              disabled={disabled}
                              aria-label={`${t(String(Reflect.get(permissionLabelMap, permission) ?? permission))} - ${t(`roleSettings.roles.${role}`)}`}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      ))}
    </div>
  )
}
