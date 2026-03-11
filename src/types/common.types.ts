import type { SortOrder } from '@/enums'

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ApiResponse<T> {
  data: T
  pagination?: PaginationMeta
  error?: string
}

export interface Column<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  /** Default sort direction when this column is first clicked. Defaults to ASC. */
  defaultSortOrder?: SortOrder
  className?: string
  render?: (value: unknown, row: T) => React.ReactNode
}

export interface SelectOption {
  label: string
  value: string
}

export interface UsePaginationOptions {
  initialPage?: number
  initialLimit?: number
}

export interface UsePaginationReturn {
  page: number
  setPage: (page: number) => void
  limit: number
  setLimit: (limit: number) => void
  total: number
  setTotal: (total: number) => void
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ApiErrorResponse {
  messageKey?: string
  message?: string
  errors?: string[]
}
