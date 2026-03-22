'use client'

import { Loader2, Upload } from 'lucide-react'
import { OsintResultCard } from '@/components/common/OsintResultCard'
import { Button } from '@/components/ui/button'
import { useOsintFileUpload } from '@/hooks'
import type { OsintFileUploadButtonProps } from '@/types'

export function OsintFileUploadButton({ t }: OsintFileUploadButtonProps) {
  const { fileInputRef, handleButtonClick, handleFileChange, isUploading, result, clearResult } =
    useOsintFileUpload()

  return (
    <div className="inline-flex flex-col gap-1">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="*/*"
      />
      <Button
        variant="outline"
        size="sm"
        className="h-6 text-xs"
        onClick={handleButtonClick}
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
        ) : (
          <Upload className="mr-1 h-3 w-3" />
        )}
        {isUploading ? t('uploadingFile') : t('uploadFile')}
      </Button>

      {result && (
        <div className="mt-1 space-y-1">
          <OsintResultCard result={result} t={t} />
          <Button variant="ghost" size="sm" className="h-5 text-[10px]" onClick={clearResult}>
            {t('osintDismiss')}
          </Button>
        </div>
      )}
    </div>
  )
}
