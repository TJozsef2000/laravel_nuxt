import type { Ref } from 'vue'
import { reactive, ref, computed, watch } from 'vue'

/**
 * Form error handling for Laravel backend validation
 * Maintains compatibility while reducing complexity
 */
export function useFormErrors<T extends Record<string, unknown>>(formData: Ref<T>) {
  const fieldErrors = reactive<Record<string, string>>({})
  const generalError = ref<string>('')

  /**
   * Extract and handle validation errors from Laravel backend
   */
  const handleValidationErrors = (error: unknown) => {
    clearAllErrors()

    if (!error || typeof error !== 'object') {
      generalError.value = 'An unexpected error occurred'
      return
    }

    const errorObj = error as {
      data?: { errors?: Record<string, string[]>; message?: string }
      response?: { data?: { errors?: Record<string, string[]>; message?: string } }
      errors?: Record<string, string[]>
      message?: string
    }

    // Extract validation errors from common response structures
    const validationErrors =
      errorObj.data?.errors ??
      errorObj.response?.data?.errors ??
      errorObj.errors ??
      null

    if (validationErrors) {
      // Set field-specific errors
      Object.entries(validationErrors).forEach(([field, messages]) => {
        if (
          Array.isArray(messages) &&
          messages.length > 0 &&
          field in formData.value
        ) {
          fieldErrors[field] = messages[0]
        }
      })
    }

    // Set general error if no field errors were found
    if (Object.keys(fieldErrors).length === 0) {
      generalError.value =
        errorObj.data?.message ??
        errorObj.response?.data?.message ??
        errorObj.message ??
        'An unexpected error occurred'
    }
  }

  /**
   * Clear all errors
   */
  const clearAllErrors = () => {
    Object.keys(fieldErrors).forEach((key) => {
      Reflect.deleteProperty(fieldErrors, key)
    })
    generalError.value = ''
  }

  /**
   * Clear specific field error
   */
  const clearFieldError = (field: string) => {
    Reflect.deleteProperty(fieldErrors, field)
  }

  /**
   * Get error for specific field
   */
  const getFieldError = (field: string): string | undefined => {
    return fieldErrors[field]
  }

  /**
   * Check if field has error
   */
  const hasFieldError = (field: string): boolean => {
    return !!fieldErrors[field]
  }

  /**
   * Check if form has any errors
   */
  const hasErrors = computed(() => {
    return Object.keys(fieldErrors).length > 0 || !!generalError.value
  })

  /**
   * Setup watchers to clear field errors when user types
   */
  const setupFieldWatchers = () => {
    Object.keys(formData.value).forEach((field) => {
      watch(
        () => formData.value[field],
        () => {
          if (fieldErrors[field]) {
            clearFieldError(field)
          }
          // Clear general error when user starts typing
          if (generalError.value) {
            generalError.value = ''
          }
        }
      )
    })
  }

  return {
    // State
    fieldErrors,
    generalError,
    hasErrors,

    // Methods
    handleValidationErrors,
    clearAllErrors,
    clearFieldError,
    getFieldError,
    hasFieldError,
    setupFieldWatchers,
  }
}
