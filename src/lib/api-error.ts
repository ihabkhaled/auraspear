import type { ApiErrorResponse } from '@/types'
import type { AxiosError } from 'axios'

/**
 * Extracts the i18n messageKey from an API error response.
 * Falls back to 'errors.common.unknown' if no key is found.
 */
export function getErrorKey(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorResponse>
  const data = axiosError?.response?.data

  if (data?.messageKey) {
    return data.messageKey
  }

  return 'errors.common.unknown'
}

/**
 * Extracts field-level validation error messageKeys from an API error response.
 * Each entry in the errors array is an i18n key (e.g. 'errors.validation.email.required').
 * Returns an empty array if no field errors are present.
 */
export function getFieldErrors(error: unknown): string[] {
  const axiosError = error as AxiosError<ApiErrorResponse>
  const data = axiosError?.response?.data

  return data?.errors ?? []
}

/**
 * Returns the most specific error messageKey from an API error.
 * Prefers the first field-level error, falls back to the main messageKey.
 */
export function getFirstFieldError(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorResponse>
  const data = axiosError?.response?.data

  const firstError = data?.errors?.[0]
  if (firstError) {
    return firstError
  }

  if (data?.messageKey) {
    return data.messageKey
  }

  return 'errors.common.unknown'
}
