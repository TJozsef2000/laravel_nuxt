export interface User {
  id: number
  name: string
  email: string
  email_verified_at?: string
  created_at: string
  updated_at: string
  permissions?: string[]
  // Add any additional user fields your Laravel API returns
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
  token: string
  email: string
  password: string
  password_confirmation: string
  [key: string]: unknown
}

export interface EmailVerificationData {
  id: number
  hash: string
  expires: string
  signature: string
  [key: string]: unknown
}

export interface UpdateProfileData {
  name: string
  email: string
  [key: string]: unknown
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface ValidationError {
  message: string
  errors: Record<string, string[]>
}
