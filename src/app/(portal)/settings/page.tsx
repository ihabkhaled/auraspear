'use client'

import { Sun, Moon, Monitor } from 'lucide-react'
import { PageHeader } from '@/components/common'
import {
  NotificationPreferencesCard,
  DataRetentionCard,
  ExportImportCard,
} from '@/components/settings'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useSettingsPage } from '@/hooks/useSettingsPage'
import { LOCALES } from '@/lib/constants/locales'

export default function SettingsPage() {
  const {
    t,
    tLang,
    mounted,
    currentLocale,
    currentTheme,
    emailAlerts,
    browserNotifications,
    updatePreferencesPending,
    handleThemeChange,
    handleLanguageChange,
    handleNotificationToggle,
  } = useSettingsPage()

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('description')} />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Theme Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t('appearance')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>{t('theme')}</Label>
              {mounted ? (
                <RadioGroup
                  value={currentTheme}
                  onValueChange={handleThemeChange}
                  className="grid grid-cols-3 gap-3"
                >
                  <label
                    htmlFor="theme-light"
                    className="border-border hover:bg-muted has-[button[data-state=checked]]:border-primary flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-3 transition-colors"
                  >
                    <RadioGroupItem value="light" id="theme-light" />
                    <Sun className="text-muted-foreground h-5 w-5" />
                    <span className="text-sm font-medium">{t('themeLight')}</span>
                  </label>
                  <label
                    htmlFor="theme-dark"
                    className="border-border hover:bg-muted has-[button[data-state=checked]]:border-primary flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-3 transition-colors"
                  >
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Moon className="text-muted-foreground h-5 w-5" />
                    <span className="text-sm font-medium">{t('themeDark')}</span>
                  </label>
                  <label
                    htmlFor="theme-system"
                    className="border-border hover:bg-muted has-[button[data-state=checked]]:border-primary flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-3 transition-colors"
                  >
                    <RadioGroupItem value="system" id="theme-system" />
                    <Monitor className="text-muted-foreground h-5 w-5" />
                    <span className="text-sm font-medium">{t('themeSystem')}</span>
                  </label>
                </RadioGroup>
              ) : (
                <div className="bg-muted h-24 animate-pulse rounded-lg" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Language Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t('language')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language-select">{t('languageDescription')}</Label>
              {mounted ? (
                <Select value={currentLocale} onValueChange={handleLanguageChange}>
                  <SelectTrigger id="language-select" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCALES.map(l => (
                      <SelectItem key={l.code} value={l.code}>
                        {tLang(l.labelKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="bg-muted h-9 animate-pulse rounded-md" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('notifications')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label htmlFor="email-alerts">{t('emailAlerts')}</Label>
                <p className="text-muted-foreground text-sm">{t('emailAlertsDescription')}</p>
              </div>
              <Switch
                id="email-alerts"
                checked={emailAlerts}
                onCheckedChange={(checked: boolean) =>
                  handleNotificationToggle('notificationsEmail', checked)
                }
                disabled={updatePreferencesPending}
              />
            </div>
            <div className="bg-border h-px" />
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label htmlFor="browser-notifications">{t('browserNotifications')}</Label>
                <p className="text-muted-foreground text-sm">
                  {t('browserNotificationsDescription')}
                </p>
              </div>
              <Switch
                id="browser-notifications"
                checked={browserNotifications}
                onCheckedChange={(checked: boolean) =>
                  handleNotificationToggle('notificationsInApp', checked)
                }
                disabled={updatePreferencesPending}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences Card */}
        <NotificationPreferencesCard />

        {/* Data Retention Card */}
        <DataRetentionCard />

        {/* Export/Import Settings Card */}
        <div className="lg:col-span-2">
          <ExportImportCard />
        </div>
      </div>
    </div>
  )
}
