import type {
  User,
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  UpdateProfileData,
} from '~/types/api/auth'
import { authService } from '~/services'

const getErrorMessage = (error: unknown, fallback: string): string => {
  // Handle FetchError from ofetch/nuxt (which has a specific structure)
  if (error && typeof error === 'object') {
    const errorObj = error as Record<string, any>
    
    // FetchError has the response data directly in the `data` property
    if (errorObj.data) {
      // Check for Laravel validation response structure
      if (typeof errorObj.data.message === 'string') {
        return errorObj.data.message
      }
      
      // Check for validation errors in data.errors
      if (errorObj.data.errors && typeof errorObj.data.errors === 'object') {
        const errors = errorObj.data.errors as Record<string, string[]>
        const firstErrorKey = Object.keys(errors)[0]
        if (firstErrorKey && errors[firstErrorKey]?.[0]) {
          return errors[firstErrorKey][0]
        }
      }
    }
    
    // Check for response data (alternative structure)
    if (errorObj.response?.data) {
      const responseData = errorObj.response.data
      if (typeof responseData.message === 'string') {
        return responseData.message
      }
      if (responseData.errors && typeof responseData.errors === 'object') {
        const errors = responseData.errors as Record<string, string[]>
        const firstErrorKey = Object.keys(errors)[0]
        if (firstErrorKey && errors[firstErrorKey]?.[0]) {
          return errors[firstErrorKey][0]
        }
      }
    }
    
    // Check for statusMessage (HTTP error) - but avoid the generic message format
    if (typeof errorObj.statusMessage === 'string' && !errorObj.statusMessage.includes('[POST]')) {
      return errorObj.statusMessage
    }
    
    // Only use the generic error message as last resort (not for FetchError)
    if (typeof errorObj.message === 'string' && errorObj.constructor?.name !== 'FetchError') {
      return errorObj.message
    }
  }
  
  // Handle native Error instances
  if (error instanceof Error && error.constructor.name !== 'FetchError') {
    return error.message
  }
  
  return fallback
}

export const useAuth = () => {
  const user = useSanctumUser<User>()
  const { login, logout, refreshIdentity } = useSanctumAuth()

  const isLoggedIn = computed(() => !!user.value)
  const isGuest = computed(() => !user.value)

  const signIn = async (credentials: LoginCredentials) => {
    try {
      await login(credentials)
      return { success: true, error: null }
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, 'Login failed. Please check your credentials.'),
      }
    }
  }

  const signUp = async (data: RegisterData) => {
    try {
      const response = await authService.register(data)

      // After successful registration, the user is automatically logged in on the backend
      // We need to refresh the identity to sync the frontend state
      await refreshIdentity()

      return { success: true, error: null, user: response.data?.user }
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, 'Registration failed. Please try again.'),
      }
    }
  }

  const signOut = async () => {
    try {
      await logout()

      // Force clear authentication cookies (in case of cross-domain issues)
      if (import.meta.client) {
        // Clear Laravel session cookie
        document.cookie = 'laravel_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'

        // Clear XSRF token cookie
        document.cookie = 'XSRF-TOKEN=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'

        // Clear remember token if it exists
        document.cookie = 'remember_web=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
      }

      await navigateTo('/login')
      return { success: true, error: null }
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, 'Logout failed. Please try again.'),
      }
    }
  }

  const refreshUser = async () => {
    try {
      await refreshIdentity()
      return { success: true, error: null }
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, 'Failed to refresh user data.'),
      }
    }
  }

  const forgotPassword = async (data: ForgotPasswordData) => {
    try {
      await authService.forgotPassword(data)
      return { success: true, error: null }
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, 'Failed to send password reset link. Please try again.'),
      }
    }
  }

  const resetPassword = async (data: ResetPasswordData) => {
    try {
      await authService.resetPassword(data)
      return { success: true, error: null }
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, 'Password reset failed. Please try again.'),
      }
    }
  }

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      const response = await authService.updateProfile(data)
      // Refresh the user data to reflect changes
      await refreshIdentity()
      return { success: true, error: null, user: response.user }
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, 'Profile update failed. Please try again.'),
      }
    }
  }

  const resendEmailVerification = async () => {
    try {
      await authService.resendEmailVerification()
      return { success: true, error: null }
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, 'Failed to resend verification email. Please try again.'),
      }
    }
  }

  return {
    user: readonly(user),
    isLoggedIn,
    isGuest,
    signIn,
    signUp,
    signOut,
    refreshUser,
    forgotPassword,
    resetPassword,
    updateProfile,
    resendEmailVerification,
  }
}