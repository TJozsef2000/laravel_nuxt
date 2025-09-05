// Base API types and interfaces
export interface BaseApiResponse {
  success: boolean
  message: string
  data?: unknown
}

export interface ApiSuccessResponse<T = unknown> extends BaseApiResponse {
  success: true
  data: T
}

export interface ApiErrorResponse extends BaseApiResponse {
  success: false
  data: null
  errors?: Record<string, string[]>
  debug?: {
    exception: string
    file: string
    line: number
    trace: string
  }
}

export interface BaseAuthSuccessResponse<T = unknown> extends BaseApiResponse {
  success: true
  user: T
}

export interface ApiResponse<T = unknown> extends BaseApiResponse {
  success: boolean
  data?: T
}

export interface ApiCollectionResponse<T = unknown> extends BaseApiResponse {
  success: true
  data: {
    items: T[]
    pagination?: PaginationMeta
  }
}

// Generic pagination metadata
export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  next_page_url?: string | null
  prev_page_url?: string | null
}

// Generic filter parameters
export interface BaseFilters {
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  per_page?: number
  page?: number
}

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

// Request configuration
export interface ApiRequestConfig {
  method?: HttpMethod
  headers?: Record<string, string>
  params?: Record<string, unknown>
  body?: unknown
}