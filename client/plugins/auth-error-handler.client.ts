import type { ApiError } from '~/types/errors'

export default defineNuxtPlugin(() => {
  const { showError } = useNotifications()

  // Handle global authentication errors
  const handleAuthError = (error: ApiError) => {
    if (error.status === 401) {
      showError('Session expired. Please sign in again.')
      return navigateTo('/login')
    }

    if (error.status === 403) {
      showError('Access denied. You do not have permission to access this resource.')
      return
    }

    if (error.status === 422) {
      const message = error.data?.message || 'Validation failed'
      showError(message)
      return
    }

    // Handle network errors
    if (!error.status) {
      showError('Network error. Please check your connection and try again.')
      return
    }

    // Generic error fallback
    const message = error.data?.message || error.message || 'An unexpected error occurred'
    showError(message)
  }

  // Add interceptor for sanctum requests
  // const { $sanctum } = useNuxtApp()
  // if ($sanctum) {
  //   $sanctum.create({
  //     onResponseError: ({ response }) => {
  //       handleAuthError(response._data || response)
  //     }
  //   })
  // }
})
