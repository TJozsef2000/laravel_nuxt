// Authentication API types
export interface User {
  id: number
  name: string
  email: string
  email_verified_at?: string
  created_at: string
  updated_at: string
  permissions?: string[]
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
  [key: string]: unknown
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  terms: boolean
  [key: string]: unknown
}

export interface ForgotPasswordData {
  email: string
  [key: string]: unknown
}

export interface ResetPasswordData {
  email: string
  password: string
  password_confirmation: string
  token: string
  [key: string]: unknown
}

export interface UpdateProfileData {
  name?: string
  email?: string
  password?: string
  password_confirmation?: string
  [key: string]: unknown
}

// Auth API Response Types
export interface AuthSuccessResponse<T = User> {
  success: true
  message: string
  user: T
}

export interface RegisterResponse {
  success: boolean
  message: string
  data?: {
    user: User
  }
}