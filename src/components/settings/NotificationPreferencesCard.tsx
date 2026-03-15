'use client'

import { Bell } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { NotificationCategory } from '@/enums'
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences'

const CATEGORY_LABEL_KEYS: Record<NotificationCategory, string> = {
  criticalAlerts: 'criticalAlerts',
  highAlerts: 'highAlerts',
  caseAssignments: 'caseAssignments',
  incidentUpdates: 'incidentUpdates',
  complianceAlerts: 'complianceAlerts',
}

const CATEGORY_DESCRIPTION_KEYS: Record<NotificationCategory, string> = {
  criticalAlerts: 'criticalAlertsDescription',
  highAlerts: 'highAlertsDescription',
  caseAssignments: 'caseAssignmentsDescription',
  incidentUpdates: 'incidentUpdatesDescription',
  complianceAlerts: 'complianceAlertsDescription',
}

export default function NotificationPreferencesCard() {
  const { t, categoryStates, isPending, handleToggle } = useNotificationPreferences()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          {t('notificationPreferences')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categoryStates.map(({ category, enabled }, index) => (
          <div key={category}>
            {index > 0 && <div className="bg-border mb-4 h-px" />}
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label htmlFor={`notification-${category}`}>
                  {t(CATEGORY_LABEL_KEYS[category])}
                </Label>
                <p className="text-muted-foreground text-sm">
                  {t(CATEGORY_DESCRIPTION_KEYS[category])}
                </p>
              </div>
              <Switch
                id={`notification-${category}`}
                checked={enabled}
                onCheckedChange={(checked: boolean) => handleToggle(category, checked)}
                disabled={isPending}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
