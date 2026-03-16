import { useCallback, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Toast } from '@/components/common'
import { getErrorKey } from '@/lib/api-error'
import type { ExportedSettings } from '@/types'
import { usePreferences, useUpdatePreferences } from './useSettings'

export function useExportImportSettings() {
  const t = useTranslations('settings')
  const tErrors = useTranslations()
  const { data: preferences } = usePreferences()
  const updatePreferences = useUpdatePreferences()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = useCallback(() => {
    if (!preferences) {
      return
    }

    const exportData: ExportedSettings = {
      notificationPreferences: {
        criticalAlerts: Boolean(preferences['notification_criticalAlerts'] ?? true),
        highAlerts: Boolean(preferences['notification_highAlerts'] ?? true),
        caseAssignments: Boolean(preferences['notification_caseAssignments'] ?? true),
        incidentUpdates: Boolean(preferences['notification_incidentUpdates'] ?? true),
        complianceAlerts: Boolean(preferences['notification_complianceAlerts'] ?? true),
      },
      dataRetention: {
        alertRetention: (preferences['retention_alerts'] as string) ?? '90',
        logRetention: (preferences['retention_logs'] as string) ?? '90',
        incidentRetention: (preferences['retention_incidents'] as string) ?? '365',
        auditLogRetention: (preferences['retention_auditLogs'] as string) ?? '365',
      },
      theme: (preferences['theme'] as string) ?? 'system',
      language: (preferences['language'] as string) ?? 'en',
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `auraspear-settings-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    Toast.success(t('exportSuccess'))
  }, [preferences, t])

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) {
        return
      }

      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const content = e.target?.result
          if (typeof content !== 'string') {
            Toast.error(t('importError'))
            return
          }

          const importedData = JSON.parse(content) as Partial<ExportedSettings>

          if (!importedData.exportedAt) {
            Toast.warning(t('importWarning'))
            return
          }

          const flatPreferences: Record<string, unknown> = {}

          if (importedData.notificationPreferences) {
            for (const [key, value] of Object.entries(importedData.notificationPreferences)) {
              flatPreferences[`notification_${key}`] = value
            }
          }

          if (importedData.dataRetention) {
            const retentionMap: Record<string, string> = {
              alertRetention: 'retention_alerts',
              logRetention: 'retention_logs',
              incidentRetention: 'retention_incidents',
              auditLogRetention: 'retention_auditLogs',
            }
            for (const [key, value] of Object.entries(importedData.dataRetention)) {
              const mappedKey = Reflect.get(retentionMap, key) as string | undefined
              if (mappedKey) {
                Reflect.set(flatPreferences, mappedKey, value)
              }
            }
          }

          if (importedData.theme) {
            flatPreferences['theme'] = importedData.theme
          }

          if (importedData.language) {
            flatPreferences['language'] = importedData.language
          }

          updatePreferences.mutate(flatPreferences, {
            onSuccess: () => {
              Toast.success(t('importSuccess'))
            },
            onError: (error: unknown) => {
              Toast.error(tErrors(getErrorKey(error)))
            },
          })
        } catch {
          Toast.error(t('importError'))
        }
      }
      reader.readAsText(file)

      if (event.target) {
        event.target.value = ''
      }
    },
    [updatePreferences, t, tErrors]
  )

  return {
    t,
    fileInputRef,
    isPending: updatePreferences.isPending,
    handleExport,
    handleImportClick,
    handleFileChange,
  }
}
