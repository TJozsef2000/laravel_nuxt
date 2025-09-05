// Validation utilities
import { VALIDATION } from './constants'

/**
 * Validate email address format
 */
export const isValidEmail = (email: string | null | undefined): boolean => {
  if (!email) return false
  return VALIDATION.EMAIL_REGEX.test(email.trim())
}

/**
 * Validate password strength
 */
export const isValidPassword = (password: string | null | undefined): boolean => {
  if (!password) return false
  return (
    password.length >= VALIDATION.PASSWORD_MIN_LENGTH &&
    VALIDATION.PASSWORD_REGEX.test(password)
  )
}

/**
 * Get password strength score (0-4)
 */
export const getPasswordStrength = (password: string | null | undefined): number => {
  if (!password) return 0
  
  let score = 0
  
  // Length check
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  
  // Character variety checks
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  
  return Math.min(score, 4)
}

/**
 * Get password strength label
 */
export const getPasswordStrengthLabel = (password: string | null | undefined): string => {
  const strength = getPasswordStrength(password)
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  return labels[strength] || 'Very Weak'
}

/**
 * Validate name (minimum length and valid characters)
 */
export const isValidName = (name: string | null | undefined): boolean => {
  if (!name) return false
  const trimmed = name.trim()
  return (
    trimmed.length >= VALIDATION.NAME_MIN_LENGTH &&
    trimmed.length <= VALIDATION.NAME_MAX_LENGTH &&
    /^[a-zA-Z\s'-]+$/.test(trimmed)
  )
}

/**
 * Validate URL format
 */
export const isValidUrl = (url: string | null | undefined): boolean => {
  if (!url) return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate phone number (US format)
 */
export const isValidPhoneNumber = (phone: string | null | undefined): boolean => {
  if (!phone) return false
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length === 10 && /^[2-9]/.test(cleaned)
}

/**
 * Validate that two passwords match
 */
export const passwordsMatch = (
  password: string | null | undefined,
  confirmation: string | null | undefined
): boolean => {
  return password === confirmation && !!password
}

/**
 * Validate file type
 */
export const isValidFileType = (
  file: File,
  allowedTypes: string[]
): boolean => {
  return allowedTypes.includes(file.type)
}

/**
 * Validate file size (in bytes)
 */
export const isValidFileSize = (
  file: File,
  maxSizeBytes: number
): boolean => {
  return file.size <= maxSizeBytes
}

/**
 * Validate required field
 */
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

/**
 * Validate minimum length
 */
export const hasMinLength = (
  value: string | null | undefined,
  minLength: number
): boolean => {
  if (!value) return false
  return value.trim().length >= minLength
}

/**
 * Validate maximum length
 */
export const hasMaxLength = (
  value: string | null | undefined,
  maxLength: number
): boolean => {
  if (!value) return true
  return value.trim().length <= maxLength
}

/**
 * Validate numeric value
 */
export const isNumeric = (value: string | number | null | undefined): boolean => {
  if (value === null || value === undefined || value === '') return false
  return !isNaN(Number(value))
}

/**
 * Validate positive number
 */
export const isPositiveNumber = (value: string | number | null | undefined): boolean => {
  return isNumeric(value) && Number(value) > 0
}

/**
 * Validate integer
 */
export const isInteger = (value: string | number | null | undefined): boolean => {
  return isNumeric(value) && Number.isInteger(Number(value))
}

/**
 * Validate value is within range
 */
export const isInRange = (
  value: number | null | undefined,
  min: number,
  max: number
): boolean => {
  if (value === null || value === undefined) return false
  return value >= min && value <= max
}

/**
 * Validate date format (YYYY-MM-DD)
 */
export const isValidDate = (date: string | null | undefined): boolean => {
  if (!date) return false
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date)) return false
  
  const parsedDate = new Date(date)
  return !isNaN(parsedDate.getTime())
}

/**
 * Validate that date is in the future
 */
export const isFutureDate = (date: string | Date | null | undefined): boolean => {
  if (!date) return false
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj > new Date()
}

/**
 * Validate that date is in the past
 */
export const isPastDate = (date: string | Date | null | undefined): boolean => {
  if (!date) return false
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj < new Date()
}