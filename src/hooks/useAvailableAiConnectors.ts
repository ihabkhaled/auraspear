'use client'

import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AI_CONNECTOR_FALLBACK } from '@/lib/constants/ai-agents'
import { llmConnectorService } from '@/services/llm-connector.service'
import { useTenantStore } from '@/stores'

/**
 * Shared hook for AI connector selection across all AI copilot surfaces.
 * Fetches available connectors once (cached by TanStack Query) and manages selection state.
 *
 * Usage:
 *   const { availableConnectors, selectedConnector, setSelectedConnector, connectorValue } = useAvailableAiConnectors()
 *   // Pass connectorValue to AI service calls (undefined = default/auto)
 */
export function useAvailableAiConnectors() {
  const tenantId = useTenantStore(s => s.currentTenantId)
  const [selectedConnector, setSelectedConnector] = useState('default')

  const { data: fetchedConnectors } = useQuery({
    queryKey: ['ai-connectors-available', tenantId],
    queryFn: () => llmConnectorService.getAvailable(),
    staleTime: 60_000,
  })

  // Backend already returns "Default (Auto)" as first entry — no need to prepend
  const availableConnectors = fetchedConnectors ?? AI_CONNECTOR_FALLBACK

  const handleConnectorChange = useCallback((value: string) => {
    setSelectedConnector(value)
  }, [])

  // undefined means "default/auto" — backend tries all connectors in priority order
  const connectorValue = selectedConnector === 'default' ? undefined : selectedConnector

  return {
    availableConnectors,
    selectedConnector,
    setSelectedConnector: handleConnectorChange,
    connectorValue,
  }
}
