// Formatting utilities

/**
 * Format a date string or Date object to a readable format
 */
export const formatDate = (
  date: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = {}
): string => {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return ''
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj)
}

/**
 * Format a date to show relative time (e.g., "2 days ago")
 */
export const formatRelativeTime = (date: string | Date | null | undefined): string => {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) return ''
  
  const now = new Date()
  const diffMs = now.getTime() - dateObj.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  
  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) !== 1 ? 's' : ''} ago`
  
  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) !== 1 ? 's' : ''} ago`
}

/**
 * Format currency values
 */
export const formatCurrency = (
  amount: number | null | undefined,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  if (amount === null || amount === undefined) return ''
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format numbers with thousand separators
 */
export const formatNumber = (
  num: number | null | undefined,
  locale: string = 'en-US',
  options: Intl.NumberFormatOptions = {}
): string => {
  if (num === null || num === undefined) return ''
  
  return new Intl.NumberFormat(locale, options).format(num)
}

/**
 * Format file size in bytes to human readable format
 */
export const formatFileSize = (bytes: number | null | undefined): string => {
  if (!bytes || bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Format percentage values
 */
export const formatPercentage = (
  value: number | null | undefined,
  decimals: number = 1
): string => {
  if (value === null || value === undefined) return ''
  
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Truncate text to a specified length
 */
export const truncateText = (
  text: string | null | undefined,
  maxLength: number = 100,
  suffix: string = '...'
): string => {
  if (!text) return ''
  
  if (text.length <= maxLength) return text
  
  return text.slice(0, maxLength - suffix.length) + suffix
}

/**
 * Format phone numbers
 */
export const formatPhoneNumber = (
  phone: string | null | undefined,
  country: string = 'US'
): string => {
  if (!phone) return ''
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '')
  
  if (country === 'US' && cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  
  // Return original if we can't format it
  return phone
}

/**
 * Capitalize first letter of each word
 */
export const toTitleCase = (text: string | null | undefined): string => {
  if (!text) return ''
  
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

/**
 * Convert camelCase to readable text
 */
export const camelCaseToWords = (text: string | null | undefined): string => {
  if (!text) return ''
  
  return text
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

/**
 * Format initials from name
 */
export const formatInitials = (
  name: string | null | undefined,
  maxInitials: number = 2
): string => {
  if (!name) return ''
  
  const names = name.trim().split(' ')
  const initials = names.map(n => n.charAt(0).toUpperCase()).slice(0, maxInitials)
  
  return initials.join('')
}