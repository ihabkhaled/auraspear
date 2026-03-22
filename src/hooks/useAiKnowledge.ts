import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { knowledgeService } from '@/services/knowledge.service'
import { useAvailableAiConnectors } from './useAvailableAiConnectors'

export function useAiKnowledgeConnector() {
  const tCommon = useTranslations('common')
  const { availableConnectors, selectedConnector, setSelectedConnector, connectorValue } =
    useAvailableAiConnectors()

  return {
    tCommon,
    availableConnectors,
    selectedConnector,
    handleConnectorChange: setSelectedConnector,
    connectorValue,
  }
}

export function useAiGenerateRunbook(connector?: string) {
  return useMutation({
    mutationFn: (description: string) => knowledgeService.aiGenerate(description, connector),
  })
}

export function useAiSearchKnowledge(connector?: string) {
  return useMutation({
    mutationFn: (query: string) => knowledgeService.aiSearch(query, connector),
  })
}
