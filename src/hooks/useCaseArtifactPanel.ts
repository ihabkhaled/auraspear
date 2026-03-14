import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { CaseArtifactType } from '@/enums'
import type { CaseArtifact } from '@/types'

interface UseCaseArtifactPanelProps {
  artifacts: CaseArtifact[]
  onAddArtifact?: ((data: { type: string; value: string; source?: string }) => void) | undefined
}

export function useCaseArtifactPanel({ artifacts, onAddArtifact }: UseCaseArtifactPanelProps) {
  const t = useTranslations('cases')
  const [artifactType, setArtifactType] = useState<CaseArtifactType>(CaseArtifactType.IP)
  const [artifactValue, setArtifactValue] = useState('')
  const [artifactSource, setArtifactSource] = useState('')

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

  const handleAddArtifact = () => {
    const trimmedValue = artifactValue.trim()
    if (trimmedValue && onAddArtifact) {
      const trimmedSource = artifactSource.trim()
      onAddArtifact({
        type: artifactType,
        value: trimmedValue,
        source: trimmedSource || 'manual',
      })
      setArtifactValue('')
      setArtifactSource('')
    }
  }

  return {
    t,
    artifactType,
    setArtifactType,
    artifactValue,
    setArtifactValue,
    artifactSource,
    setArtifactSource,
    groupedArtifacts,
    handleAddArtifact,
  }
}
