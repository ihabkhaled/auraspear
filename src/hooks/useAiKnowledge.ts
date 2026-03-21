import { useMutation } from '@tanstack/react-query'
import { knowledgeService } from '@/services/knowledge.service'

export function useAiGenerateRunbook() {
  return useMutation({
    mutationFn: (description: string) => knowledgeService.aiGenerate(description),
  })
}

export function useAiSearchKnowledge() {
  return useMutation({
    mutationFn: (query: string) => knowledgeService.aiSearch(query),
  })
}
