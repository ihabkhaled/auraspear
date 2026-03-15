'use client'

import { Download, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useExportImportSettings } from '@/hooks/useExportImportSettings'

export default function ExportImportCard() {
  const { t, fileInputRef, isPending, handleExport, handleImportClick, handleFileChange } =
    useExportImportSettings()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          {t('exportImportSettings')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm">{t('exportImportDescription')}</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleExport} disabled={isPending}>
            <Download className="me-2 h-4 w-4" />
            {t('exportSettings')}
          </Button>
          <Button variant="outline" onClick={handleImportClick} disabled={isPending}>
            <Upload className="me-2 h-4 w-4" />
            {t('importSettings')}
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
          aria-label={t('importSettings')}
        />
      </CardContent>
    </Card>
  )
}
