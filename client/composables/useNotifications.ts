import type { ToastOptions, ToastColor } from '~/types/errors'

export const useNotifications = () => {
  const addToast = (message: string, type: ToastColor = 'info', options?: ToastOptions) => {
    if (import.meta.client) {
      const { $toastContainer } = useNuxtApp()
      if ($toastContainer) {
        return $toastContainer.addToast({
          message,
          type,
          icon: options?.icon,
          timeout: options?.timeout,
          actions: options?.actions,
          showProgressBar: true,
        })
      }
    }
    return null
  }

  const showSuccess = (message: string, options?: ToastOptions) => {
    return addToast(message, 'success', options)
  }

  const showError = (message: string, options?: ToastOptions) => {
    return addToast(message, 'error', options)
  }

  const showWarning = (message: string, options?: ToastOptions) => {
    return addToast(message, 'warning', options)
  }

  const showInfo = (message: string, options?: ToastOptions) => {
    return addToast(message, 'info', options)
  }

  const showPrimary = (message: string, options?: ToastOptions) => {
    return addToast(message, 'primary', options)
  }

  const clearToasts = () => {
    if (import.meta.client) {
      const { $toastContainer } = useNuxtApp()
      if ($toastContainer) {
        $toastContainer.clearToasts()
      }
    }
  }

  const removeToast = (id: string) => {
    if (import.meta.client) {
      const { $toastContainer } = useNuxtApp()
      if ($toastContainer) {
        $toastContainer.removeToast(id)
      }
    }
  }

  // Legacy method for backwards compatibility
  const addNotification = (
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    options?: ToastOptions
  ) => {
    return addToast(message, type, options)
  }

  return {
    // Primary methods
    addToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showPrimary,
    clearToasts,
    removeToast,
    // Legacy compatibility
    addNotification,
  }
}
