import type { ColorVariant, SizeVariant } from '~/types/ui'

// Global UI state and utilities
export const useUI = () => {
  // Focus management for accessibility
  const focusableElements =
    'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'

  const trapFocus = (element: HTMLElement) => {
    const focusable = element.querySelectorAll(focusableElements) as NodeListOf<HTMLElement>
    const firstFocusable = focusable[0]
    const lastFocusable = focusable[focusable.length - 1]

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault()
          lastFocusable?.focus()
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault()
          firstFocusable?.focus()
        }
      }
    }

    element.addEventListener('keydown', handleTabKey)
    firstFocusable?.focus()

    return () => element.removeEventListener('keydown', handleTabKey)
  }

  const restoreFocus = (previousElement?: HTMLElement | null) => {
    if (previousElement && typeof previousElement.focus === 'function') {
      previousElement.focus()
    }
  }

  // Color and size utilities
  const getVariantClasses = (
    color: ColorVariant = 'primary',
    variant: string = 'solid',
    size: SizeVariant = 'md'
  ) => {
    const colorClasses = getColorClasses(color, variant)
    const sizeClasses = getSizeClasses(size)
    return `${colorClasses} ${sizeClasses}`
  }

  // Animation utilities
  const withTransition = (show: boolean, enterClass: string, leaveClass: string) => {
    return show ? enterClass : leaveClass
  }

  // Generate unique IDs for accessibility
  const generateId = (prefix: string = 'ui') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Keyboard event helpers
  const isEscKey = (event: KeyboardEvent) => event.key === 'Escape' || event.keyCode === 27
  const isEnterKey = (event: KeyboardEvent) => event.key === 'Enter' || event.keyCode === 13
  const isSpaceKey = (event: KeyboardEvent) => event.key === ' ' || event.keyCode === 32
  const isTabKey = (event: KeyboardEvent) => event.key === 'Tab' || event.keyCode === 9
  const isArrowKey = (event: KeyboardEvent) =>
    ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)

  // Debounce utility
  const debounce = <T extends (...args: any[]) => any>(func: T, wait: number) => {
    let timeout: ReturnType<typeof setTimeout>
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  // Throttle utility
  const throttle = <T extends (...args: any[]) => any>(func: T, limit: number) => {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  }

  // Click outside directive helper
  const onClickOutside = (element: HTMLElement, callback: () => void) => {
    const handleClick = (event: MouseEvent) => {
      if (!element.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }

  // Portal/teleport utilities
  const createPortal = (selector: string = 'body') => {
    const target = document.querySelector(selector)
    if (!target) {
      console.warn(`Portal target "${selector}" not found`)
      return document.body
    }
    return target
  }

  return {
    // Focus management
    trapFocus,
    restoreFocus,

    // Styling utilities
    getVariantClasses,
    withTransition,

    // ID generation
    generateId,

    // Keyboard helpers
    isEscKey,
    isEnterKey,
    isSpaceKey,
    isTabKey,
    isArrowKey,

    // Performance utilities
    debounce,
    throttle,

    // Event utilities
    onClickOutside,

    // Portal utilities
    createPortal,
  }
}

// Color utility functions (imported from types/ui.ts)
function getColorClasses(color: ColorVariant, variant: string = 'solid'): string {
  const colorMap = {
    primary: {
      solid:
        'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 disabled:bg-primary-300',
      outline:
        'border border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500 disabled:border-primary-300 disabled:text-primary-300',
      ghost:
        'text-primary-500 hover:bg-primary-50 focus:ring-primary-500 disabled:text-primary-300',
      soft: 'bg-primary-50 text-primary-600 hover:bg-primary-100 focus:ring-primary-500 disabled:bg-primary-25 disabled:text-primary-300',
      subtle:
        'text-primary-600 hover:text-primary-700 hover:bg-primary-50 disabled:text-primary-300',
    },
    neutral: {
      solid:
        'bg-neutral-500 text-white hover:bg-neutral-600 focus:ring-neutral-500 disabled:bg-neutral-300',
      outline:
        'border border-neutral-300 text-neutral-700 hover:bg-neutral-50 focus:ring-neutral-500 disabled:border-neutral-200 disabled:text-neutral-400',
      ghost:
        'text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-500 disabled:text-neutral-400',
      soft: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 focus:ring-neutral-500 disabled:bg-neutral-50 disabled:text-neutral-400',
      subtle:
        'text-neutral-600 hover:text-neutral-700 hover:bg-neutral-50 disabled:text-neutral-400',
    },
    success: {
      solid:
        'bg-success-500 text-white hover:bg-success-600 focus:ring-success-500 disabled:bg-success-300',
      outline:
        'border border-success-500 text-success-500 hover:bg-success-50 focus:ring-success-500 disabled:border-success-300 disabled:text-success-300',
      ghost:
        'text-success-500 hover:bg-success-50 focus:ring-success-500 disabled:text-success-300',
      soft: 'bg-success-50 text-success-600 hover:bg-success-100 focus:ring-success-500 disabled:bg-success-25 disabled:text-success-300',
      subtle:
        'text-success-600 hover:text-success-700 hover:bg-success-50 disabled:text-success-300',
    },
    error: {
      solid:
        'bg-error-500 text-white hover:bg-error-600 focus:ring-error-500 disabled:bg-error-300',
      outline:
        'border border-error-500 text-error-500 hover:bg-error-50 focus:ring-error-500 disabled:border-error-300 disabled:text-error-300',
      ghost: 'text-error-500 hover:bg-error-50 focus:ring-error-500 disabled:text-error-300',
      soft: 'bg-error-50 text-error-600 hover:bg-error-100 focus:ring-error-500 disabled:bg-error-25 disabled:text-error-300',
      subtle: 'text-error-600 hover:text-error-700 hover:bg-error-50 disabled:text-error-300',
    },
    warning: {
      solid:
        'bg-warning-500 text-white hover:bg-warning-600 focus:ring-warning-500 disabled:bg-warning-300',
      outline:
        'border border-warning-500 text-warning-500 hover:bg-warning-50 focus:ring-warning-500 disabled:border-warning-300 disabled:text-warning-300',
      ghost:
        'text-warning-500 hover:bg-warning-50 focus:ring-warning-500 disabled:text-warning-300',
      soft: 'bg-warning-50 text-warning-600 hover:bg-warning-100 focus:ring-warning-500 disabled:bg-warning-25 disabled:text-warning-300',
      subtle:
        'text-warning-600 hover:text-warning-700 hover:bg-warning-50 disabled:text-warning-300',
    },
    info: {
      solid: 'bg-info-500 text-white hover:bg-info-600 focus:ring-info-500 disabled:bg-info-300',
      outline:
        'border border-info-500 text-info-500 hover:bg-info-50 focus:ring-info-500 disabled:border-info-300 disabled:text-info-300',
      ghost: 'text-info-500 hover:bg-info-50 focus:ring-info-500 disabled:text-info-300',
      soft: 'bg-info-50 text-info-600 hover:bg-info-100 focus:ring-info-500 disabled:bg-info-25 disabled:text-info-300',
      subtle: 'text-info-600 hover:text-info-700 hover:bg-info-50 disabled:text-info-300',
    },
  }

  return (
    colorMap[color]?.[variant as keyof (typeof colorMap)[typeof color]] || colorMap.primary.solid
  )
}

function getSizeClasses(size: SizeVariant, type: 'button' | 'input' | 'text' = 'button'): string {
  const sizeMap = {
    button: {
      xs: 'px-2 py-1 text-xs rounded',
      sm: 'px-2.5 py-1.5 text-sm rounded-md',
      md: 'px-3 py-2 text-sm rounded-md',
      lg: 'px-4 py-2.5 text-base rounded-lg',
      xl: 'px-6 py-3 text-lg rounded-lg',
    },
    input: {
      xs: 'px-2 py-1 text-xs rounded',
      sm: 'px-2.5 py-1.5 text-sm rounded-md',
      md: 'px-3 py-2 text-sm rounded-md',
      lg: 'px-4 py-2.5 text-base rounded-lg',
      xl: 'px-6 py-3 text-lg rounded-lg',
    },
    text: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
  }

  return sizeMap[type]?.[size] || sizeMap[type].md
}
