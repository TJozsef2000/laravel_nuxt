import { describe, it, expect } from 'vitest'
import {
  formatDate,
  formatRelativeTime,
  formatCurrency,
  formatNumber,
  formatFileSize,
  formatPercentage,
  truncateText,
  toTitleCase,
  camelCaseToWords,
  formatInitials
} from '~/utils/formatters'

describe('formatters', () => {
  describe('formatDate', () => {
    it('should format date string', () => {
      const date = '2023-12-25T10:30:00.000Z'
      const result = formatDate(date)
      expect(result).toMatch(/Dec 25, 2023/)
    })

    it('should return empty string for null/undefined', () => {
      expect(formatDate(null)).toBe('')
      expect(formatDate(undefined)).toBe('')
    })

    it('should return empty string for invalid date', () => {
      expect(formatDate('invalid-date')).toBe('')
    })
  })

  describe('formatRelativeTime', () => {
    it('should return "Just now" for very recent time', () => {
      const now = new Date()
      const result = formatRelativeTime(now)
      expect(result).toBe('Just now')
    })

    it('should return minutes ago for recent time', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      const result = formatRelativeTime(fiveMinutesAgo)
      expect(result).toBe('5 minutes ago')
    })

    it('should return empty string for null/undefined', () => {
      expect(formatRelativeTime(null)).toBe('')
      expect(formatRelativeTime(undefined)).toBe('')
    })
  })

  describe('formatCurrency', () => {
    it('should format currency with default USD', () => {
      const result = formatCurrency(123.45)
      expect(result).toMatch(/\$123\.45/)
    })

    it('should format currency with different currency', () => {
      const result = formatCurrency(100, 'EUR')
      expect(result).toMatch(/€100\.00/)
    })

    it('should return empty string for null/undefined', () => {
      expect(formatCurrency(null)).toBe('')
      expect(formatCurrency(undefined)).toBe('')
    })
  })

  describe('formatNumber', () => {
    it('should format number with thousand separator', () => {
      const result = formatNumber(1234567)
      expect(result).toBe('1,234,567')
    })

    it('should return empty string for null/undefined', () => {
      expect(formatNumber(null)).toBe('')
      expect(formatNumber(undefined)).toBe('')
    })
  })

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1024 * 1024)).toBe('1 MB')
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
    })

    it('should return "0 Bytes" for zero or null', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(null)).toBe('0 Bytes')
    })
  })

  describe('formatPercentage', () => {
    it('should format decimal as percentage', () => {
      expect(formatPercentage(0.75)).toBe('75.0%')
      expect(formatPercentage(0.5)).toBe('50.0%')
    })

    it('should format with custom decimals', () => {
      expect(formatPercentage(0.12345, 2)).toBe('12.35%')
    })

    it('should return empty string for null/undefined', () => {
      expect(formatPercentage(null)).toBe('')
      expect(formatPercentage(undefined)).toBe('')
    })
  })

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const longText = 'This is a very long text that should be truncated'
      const result = truncateText(longText, 20)
      expect(result).toBe('This is a very lo...')
    })

    it('should return original text if shorter than limit', () => {
      const shortText = 'Short text'
      expect(truncateText(shortText, 20)).toBe('Short text')
    })

    it('should return empty string for null/undefined', () => {
      expect(truncateText(null)).toBe('')
      expect(truncateText(undefined)).toBe('')
    })
  })

  describe('toTitleCase', () => {
    it('should convert to title case', () => {
      expect(toTitleCase('hello world')).toBe('Hello World')
      expect(toTitleCase('HELLO WORLD')).toBe('Hello World')
    })

    it('should return empty string for null/undefined', () => {
      expect(toTitleCase(null)).toBe('')
      expect(toTitleCase(undefined)).toBe('')
    })
  })

  describe('camelCaseToWords', () => {
    it('should convert camelCase to words', () => {
      expect(camelCaseToWords('firstName')).toBe('First Name')
      expect(camelCaseToWords('userAccountSettings')).toBe('User Account Settings')
    })

    it('should return empty string for null/undefined', () => {
      expect(camelCaseToWords(null)).toBe('')
      expect(camelCaseToWords(undefined)).toBe('')
    })
  })

  describe('formatInitials', () => {
    it('should format initials from name', () => {
      expect(formatInitials('John Doe')).toBe('JD')
      expect(formatInitials('John Michael Doe')).toBe('JM')
    })

    it('should limit initials by maxInitials parameter', () => {
      expect(formatInitials('John Michael Doe Smith', 3)).toBe('JMD')
    })

    it('should return empty string for null/undefined', () => {
      expect(formatInitials(null)).toBe('')
      expect(formatInitials(undefined)).toBe('')
    })
  })
})