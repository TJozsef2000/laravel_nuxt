import type { Ref } from 'vue'

/**
 * Laravel validation error structure
 */
export interface LaravelValidationResponse {
  message: string
  errors: Record<string, string[]>
}

/**
 * Simple form error handling for Laravel backend validation
 * No client-side validation - purely backend focused
 */
export function useFormErrors<T extends Record<string, any>>(formData: Ref<T>) {
  const fieldErrors = reactive<Record<keyof T, string>>({} as Record<keyof T, string>)
  const generalError = ref<string>('')

  /**
   * Extract field-specific errors from Laravel validation response
   */
  const extractFieldErrors = (error: unknown): Record<string, string> => {
    const extracted: Record<string, string> = {}

    if (error && typeof error === 'object') {
      const errorObj = error as Record<string, any>
      
      // Try different locations for Laravel validation errors
      let validationErrors: Record<string, string[]> | null = null

      if (errorObj.data?.errors) {
        validationErrors = errorObj.data.errors
      } else if (errorObj.response?.data?.errors) {
        validationErrors = errorObj.response.data.errors
      } else if (errorObj.errors) {
        validationErrors = errorObj.errors
      }

      // Convert validation errors (first error per field)
      if (validationErrors) {
        Object.entries(validationErrors).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            extracted[field] = messages[0]
          }
        })
      }
    }

    return extracted
  }

  /**
   * Extract general error message from response
   */
  const extractGeneralError = (error: unknown): string => {
    if (error && typeof error === 'object') {
      const errorObj = error as Record<string, any>
      
      if (errorObj.data?.message) return errorObj.data.message
      if (errorObj.response?.data?.message) return errorObj.response.data.message
      if (errorObj.message && !errorObj.message.includes('[POST]')) return errorObj.message
    }
    
    return 'An unexpected error occurred'
  }

  /**
   * Handle validation errors from Laravel backend
   */
  const handleValidationErrors = (error: unknown) => {
    // Clear previous errors
    clearAllErrors()

    // Extract field errors
    const extracted = extractFieldErrors(error)
    
    // Set field errors
    Object.entries(extracted).forEach(([field, errorMessage]) => {
      if (field in formData.value) {
        fieldErrors[field as keyof T] = errorMessage
      }
    })

    // Set general error if no field-specific errors or if there are additional errors
    const generalErrorMessage = extractGeneralError(error)
    if (Object.keys(extracted).length === 0 || generalErrorMessage !== 'An unexpected error occurred') {
      generalError.value = generalErrorMessage
    }
  }

  /**
   * Clear all errors
   */
  const clearAllErrors = () => {
    Object.keys(fieldErrors).forEach((key) => {
      delete fieldErrors[key as keyof T]
    })
    generalError.value = ''
  }

  /**
   * Clear specific field error
   */
  const clearFieldError = (field: keyof T) => {
    delete fieldErrors[field]
  }

  /**
   * Get error for specific field
   */
  const getFieldError = (field: keyof T): string | undefined => {
    return fieldErrors[field]
  }

  /**
   * Check if field has error
   */
  const hasFieldError = (field: keyof T): boolean => {
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
        () => formData.value[field as keyof T],
        () => {
          if (fieldErrors[field as keyof T]) {
            clearFieldError(field as keyof T)
          }
          // Also clear general error when user starts typing
          if (generalError.value) {
            generalError.value = ''
          }
        }
      )
    })
  }

  return {
    // State (readonly for safety)
    fieldErrors: readonly(fieldErrors) as Readonly<typeof fieldErrors>,
    generalError,
    hasErrors,

    // Methods
    handleValidationErrors,
    clearAllErrors,
    clearFieldError,
    getFieldError,
    hasFieldError,
    setupFieldWatchers,

    // Utilities for manual handling
    extractFieldErrors,
    extractGeneralError,
  }
}