export interface MISPTag {
  id: string
  name: string
  color: string
}

export interface MISPEvent {
  id: string
  eventId: string
  organization: string
  threatLevel: string
  info: string
  date: string
  tags: MISPTag[]
  attributeCount: number
  published: boolean
}

export interface IOCCorrelation {
  id: string
  iocValue: string
  iocType: string
  source: string
  hitCount: number
  lastSeen: string
  severity: string
}

export interface IntelStats {
  threatActors: number
  ipIOCs: number
  fileHashes: number
  activeDomains: number
  threatActorsTrend?: number
  ipIOCsTrend?: number
  fileHashesTrend?: number
  activeDomainsTrend?: number
}

export interface MISPSearchParams {
  page?: number
  limit?: number
  query?: string
  threatLevel?: string
}
