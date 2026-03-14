export interface NotificationItem {
  id: string
  type: string
  actorName: string
  actorEmail: string
  title: string
  message: string
  entityType: string
  entityId: string
  caseId: string | null
  caseCommentId: string | null
  isRead: boolean
  createdAt: string
}

export interface NotificationSearchParams {
  page?: number
  limit?: number
}

export interface UnreadCountResponse {
  count: number
}
