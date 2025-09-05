// Global types and interfaces used across the application

// Error handling types
export interface AppError {
  message: string
  code?: string | number
  details?: unknown
}

export interface ValidationErrors {
  [key: string]: string[]
}

// Permission types
export type Permission = 
  | 'users_view' 
  | 'users_create' 
  | 'users_edit' 
  | 'users_delete' 
  | 'users_restore'

// Toast/Notification types
export interface ToastNotification {
  id: string
  title?: string
  description?: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  persistent?: boolean
}

// App state types
export interface AppState {
  theme: 'light' | 'dark' | 'auto'
  locale: string
  sidebar: {
    collapsed: boolean
    mobileOpen: boolean
  }
}

// Utility types
export type Maybe<T> = T | null | undefined
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Common async operation states
export interface AsyncState<T = unknown> {
  data: T | null
  loading: boolean
  error: string | null
}

// Pagination utilities
export interface PaginationState {
  page: number
  perPage: number
  total: number
  from: number
  to: number
  lastPage: number
}

// Filter/Search utilities
export interface FilterState {
  search: string
  filters: Record<string, unknown>
  sort: {
    field: string
    direction: 'asc' | 'desc'
  }
}