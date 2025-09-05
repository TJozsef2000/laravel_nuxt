// Authentication service
import type { 
  User,
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  UpdateProfileData,
  AuthSuccessResponse,
  RegisterResponse
} from '~/types/api/auth'
import type { BaseApiResponse } from '~/types/api/base'
import { BaseApiService } from './api'

export class AuthService extends BaseApiService {
  /**
   * Login user with credentials
   */
  async login(credentials: LoginCredentials): Promise<AuthSuccessResponse<User>> {
    return this.post<AuthSuccessResponse<User>>('/api/auth/login', credentials)
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<RegisterResponse> {
    return this.post<RegisterResponse>('/api/auth/register', data)
  }

  /**
   * Logout current user
   */
  async logout(): Promise<BaseApiResponse> {
    return this.post<BaseApiResponse>('/api/auth/logout')
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    return this.get<User>('/api/auth/user')
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileData): Promise<AuthSuccessResponse<User>> {
    return this.put<AuthSuccessResponse<User>>('/api/auth/profile', data)
  }

  /**
   * Send forgot password email
   */
  async forgotPassword(data: ForgotPasswordData): Promise<BaseApiResponse> {
    return this.post<BaseApiResponse>('/api/auth/forgot-password', data)
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordData): Promise<BaseApiResponse> {
    return this.post<BaseApiResponse>('/api/auth/reset-password', data)
  }

  /**
   * Resend email verification
   */
  async resendEmailVerification(): Promise<BaseApiResponse> {
    return this.post<BaseApiResponse>('/api/auth/email/verification-notification')
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<BaseApiResponse> {
    return this.post<BaseApiResponse>(`/api/auth/verify-email/${token}`)
  }
}

// Export singleton instance
export const authService = new AuthService()