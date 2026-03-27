export interface UserMemory {
  id: string
  tenantId: string
  userId: string
  content: string
  category: string
  sourceType: string
  sourceId: string | null
  sourceLabel: string | null
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface UserMemoryListResponse {
  data: UserMemory[]
  total: number
}

export interface CreateMemoryInput {
  content: string
  category?: string
}

export interface UpdateMemoryInput {
  content: string
  category?: string
}

export interface MemorySettingsCardProps {
  t: (key: string) => string
}
