'use client'

import { useMemo } from 'react'
import { Copy, ExternalLink, Globe, Hash, Link2, Server } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { CaseArtifactType } from '@/enums'
import { copyToClipboard } from '@/lib/utils'
import type { CaseArtifact } from '@/types'

interface CaseArtifactPanelProps {
  artifacts: CaseArtifact[]
  onLookup?: (artifact: CaseArtifact) => void
}

const typeIcons: Record<CaseArtifactType, typeof Globe> = {
  [CaseArtifactType.IP]: Server,
  [CaseArtifactType.HASH]: Hash,
  [CaseArtifactType.DOMAIN]: Globe,
  [CaseArtifactType.URL]: Link2,
}

const typeKeys: Record<CaseArtifactType, string> = {
  [CaseArtifactType.IP]: 'artifactIps',
  [CaseArtifactType.HASH]: 'artifactHashes',
  [CaseArtifactType.DOMAIN]: 'artifactDomains',
  [CaseArtifactType.URL]: 'artifactUrls',
}

export function CaseArtifactPanel({ artifacts, onLookup }: CaseArtifactPanelProps) {
  const t = useTranslations('cases')

  const groupedArtifacts = useMemo(() => {
    const groups: Partial<Record<CaseArtifactType, CaseArtifact[]>> = {}

    for (const artifact of artifacts) {
      const existing = groups[artifact.type]
      if (existing) {
        existing.push(artifact)
      } else {
        groups[artifact.type] = [artifact]
      }
    }

    return groups
  }, [artifacts])

  if (artifacts.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground text-sm">{t('noArtifacts')}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {Object.entries(groupedArtifacts).map(([type, items]) => {
        if (!items) {
          return null
        }
        const artifactType = type as CaseArtifactType
        const Icon = typeIcons[artifactType] ?? Globe
        const label = typeKeys[artifactType] ? t(typeKeys[artifactType]) : type

        return (
          <div key={type} className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Icon className="text-muted-foreground h-4 w-4" />
              <span>{label}</span>
              <span className="text-muted-foreground text-xs">({items.length})</span>
            </div>

            <div className="flex flex-col gap-1.5">
              {items.map(artifact => (
                <div
                  key={artifact.id}
                  className="border-border bg-muted/30 flex items-center justify-between gap-2 rounded-md border px-3 py-2"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-xs">{artifact.value}</span>
                    <span className="text-muted-foreground text-[10px]">
                      {t('source')}: {artifact.source}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => copyToClipboard(artifact.value)}
                      title={t('copy')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    {onLookup && (
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => onLookup(artifact)}
                        title={t('lookup')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
