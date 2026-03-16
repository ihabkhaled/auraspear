import { NotificationType } from '@/enums'
import type { TranslatableMessage } from '@/types'

/**
 * Resolves a notification message that may be either a plain-text string (legacy)
 * or a JSON-encoded translatable message with `key` + `params`.
 *
 * If the message is valid JSON with `key` and `params`, returns `t(key, params)`.
 * Otherwise returns the raw message string for backward compatibility.
 */
export function resolveNotificationMessage(
  message: string,
  t: (key: string, params?: Record<string, string>) => string
): string {
  try {
    const parsed: unknown = JSON.parse(message)
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'key' in parsed &&
      typeof (parsed as TranslatableMessage).key === 'string'
    ) {
      const { key, params } = parsed as TranslatableMessage
      return t(key, params)
    }
    return message
  } catch {
    return message
  }
}

/**
 * Maps notification types to their i18n label keys under the `notifications` namespace.
 * Used across the notification bell, notifications page table, and dashboard activity feed.
 */
export const NOTIFICATION_TYPE_LABEL_MAP: Record<string, string> = {
  [NotificationType.MENTION]: 'mention',
  [NotificationType.CASE_ASSIGNED]: 'caseAssigned',
  [NotificationType.CASE_UNASSIGNED]: 'caseUnassigned',
  [NotificationType.CASE_COMMENT_ADDED]: 'caseCommentAdded',
  [NotificationType.CASE_TASK_ADDED]: 'caseTaskAdded',
  [NotificationType.CASE_ARTIFACT_ADDED]: 'caseArtifactAdded',
  [NotificationType.CASE_STATUS_CHANGED]: 'caseStatusChanged',
  [NotificationType.CASE_UPDATED]: 'caseUpdated',
  [NotificationType.TENANT_ASSIGNED]: 'tenantAssigned',
  [NotificationType.ROLE_CHANGED]: 'roleChanged',
  [NotificationType.USER_BLOCKED]: 'userBlocked',
  [NotificationType.USER_UNBLOCKED]: 'userUnblocked',
  [NotificationType.USER_REMOVED]: 'userRemoved',
  [NotificationType.USER_RESTORED]: 'userRestored',
}
