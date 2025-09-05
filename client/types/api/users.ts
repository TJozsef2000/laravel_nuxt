// User Management API types
import type { User } from './auth'

export interface CreateUserData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface UpdateUserData {
  name?: string
  email?: string
  password?: string
  password_confirmation?: string
}

export interface UserFilters extends Record<string, unknown> {
  search?: string
  filter_verified?: boolean
  created_from?: string
  created_to?: string
  sort_by?: 'name' | 'email' | 'created_at' | 'updated_at'
  sort_order?: 'asc' | 'desc'
  per_page?: number
  page?: number
}

export interface UserStatistics {
  total_users: number
  verified_users: number
  unverified_users: number
  recent_users: number
}

// User-specific API Response Types
export interface UserListResponse {
  success: boolean
  code: number
  message: string
  data: {
    items: User[]
    pagination?: PaginationData
  }
}

export interface PaginationData {
  current_page: number
  per_page: number
  total: number
  last_page: number
  next_page_url: string | null
  prev_page_url: string | null
}