// Base UI component types and interfaces

export type ColorVariant = 'primary' | 'neutral' | 'success' | 'error' | 'warning' | 'info'
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'soft' | 'subtle'
export type AlertVariant = 'solid' | 'outline' | 'soft' | 'subtle'

// Button component props
export interface ButtonProps {
  variant?: ButtonVariant
  color?: ColorVariant
  size?: SizeVariant
  loading?: boolean
  disabled?: boolean
  block?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
  to?: string
  href?: string
  target?: string
  type?: 'button' | 'submit' | 'reset'
  class?: string
}

// Input component props
export interface InputProps {
  modelValue?: string | number
  type?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  error?: boolean
  size?: SizeVariant
  icon?: string
  iconPosition?: 'left' | 'right'
  class?: string
}

// Card component props
export interface CardProps {
  class?: string
  bodyClass?: string
  headerClass?: string
  footerClass?: string
}

// Modal component props
export interface ModalProps {
  modelValue?: boolean
  fullscreen?: boolean
  preventClose?: boolean
  overlayClass?: string
  class?: string
}

// Alert component props
export interface AlertProps {
  variant?: AlertVariant
  color?: ColorVariant
  title?: string
  description?: string
  icon?: string
  closable?: boolean
  class?: string
}

// Icon component props
export interface IconProps {
  name: string
  size?: SizeVariant | string
  class?: string
}

// Form component props
export interface FormProps {
  schema?: any
  state?: any
  class?: string
}

// FormField component props
export interface FormFieldProps {
  label?: string
  name?: string
  description?: string
  hint?: string
  error?: string
  required?: boolean
  class?: string
}

// Dropdown component props
export interface DropdownProps {
  items?: DropdownItem[]
  placement?: string
  disabled?: boolean
  class?: string
}

export interface DropdownItem {
  label: string
  icon?: string
  iconClass?: string
  shortcuts?: string[]
  disabled?: boolean
  click?: () => void
  to?: string
  href?: string
  target?: string
  separator?: boolean
}

// Checkbox component props
export interface CheckboxProps {
  modelValue?: boolean | any[]
  name?: string
  value?: any
  disabled?: boolean
  required?: boolean
  color?: ColorVariant
  size?: SizeVariant
  class?: string
}

// Badge component props
export interface BadgeProps {
  variant?: 'solid' | 'outline' | 'soft' | 'subtle'
  color?: ColorVariant
  size?: SizeVariant
  class?: string
}

// Avatar component props
export interface AvatarProps {
  src?: string
  alt?: string
  size?: SizeVariant
  class?: string
}

// Table component props
export interface TableProps {
  data?: any[]
  columns?: TableColumn[]
  loading?: boolean
  emptyState?: {
    icon?: string
    label?: string
    description?: string
  }
  class?: string
}

export interface TableColumn {
  key: string
  label?: string
  sortable?: boolean
  class?: string
  headerClass?: string
}

// Pagination component props
export interface PaginationProps {
  currentPage?: number
  totalPages?: number
  perPage?: number
  total?: number
  showEdges?: boolean
  showFirst?: boolean
  showLast?: boolean
  class?: string
}

// Select component props
export interface SelectProps {
  modelValue?: any
  options?: SelectOption[]
  placeholder?: string
  disabled?: boolean
  multiple?: boolean
  searchable?: boolean
  clearable?: boolean
  size?: SizeVariant
  class?: string
}

export interface SelectOption {
  label: string
  value: any
  disabled?: boolean
  icon?: string
}

// Color utility types
export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950

// Component slot types
export interface ComponentSlots {
  default?: () => any
  header?: () => any
  footer?: () => any
  actions?: () => any
  icon?: () => any
  leading?: () => any
  trailing?: () => any
}

// Base component emit types
export interface BaseEmits {
  'update:modelValue'?: [value: any]
  click?: [event: MouseEvent]
  focus?: [event: FocusEvent]
  blur?: [event: FocusEvent]
  input?: [event: Event]
  change?: [event: Event]
}

// Animation classes
export const ANIMATION_CLASSES = {
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  slideIn: 'animate-slide-in',
  slideOut: 'animate-slide-out',
} as const

// Common utility functions
export function getColorClasses(color: ColorVariant, variant: string = 'solid'): string {
  const colorMap = {
    primary: {
      solid: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
      outline: 'border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500',
      ghost: 'text-primary-500 hover:bg-primary-50 focus:ring-primary-500',
      soft: 'bg-primary-50 text-primary-600 hover:bg-primary-100 focus:ring-primary-500',
      subtle: 'text-primary-600 hover:text-primary-700 hover:bg-primary-50',
    },
    neutral: {
      solid: 'bg-neutral-500 text-white hover:bg-neutral-600 focus:ring-neutral-500',
      outline: 'border-neutral-300 text-neutral-700 hover:bg-neutral-50 focus:ring-neutral-500',
      ghost: 'text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-500',
      soft: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 focus:ring-neutral-500',
      subtle: 'text-neutral-600 hover:text-neutral-700 hover:bg-neutral-50',
    },
    success: {
      solid: 'bg-success-500 text-white hover:bg-success-600 focus:ring-success-500',
      outline: 'border-success-500 text-success-500 hover:bg-success-50 focus:ring-success-500',
      ghost: 'text-success-500 hover:bg-success-50 focus:ring-success-500',
      soft: 'bg-success-50 text-success-600 hover:bg-success-100 focus:ring-success-500',
      subtle: 'text-success-600 hover:text-success-700 hover:bg-success-50',
    },
    error: {
      solid: 'bg-error-500 text-white hover:bg-error-600 focus:ring-error-500',
      outline: 'border-error-500 text-error-500 hover:bg-error-50 focus:ring-error-500',
      ghost: 'text-error-500 hover:bg-error-50 focus:ring-error-500',
      soft: 'bg-error-50 text-error-600 hover:bg-error-100 focus:ring-error-500',
      subtle: 'text-error-600 hover:text-error-700 hover:bg-error-50',
    },
    warning: {
      solid: 'bg-warning-500 text-white hover:bg-warning-600 focus:ring-warning-500',
      outline: 'border-warning-500 text-warning-500 hover:bg-warning-50 focus:ring-warning-500',
      ghost: 'text-warning-500 hover:bg-warning-50 focus:ring-warning-500',
      soft: 'bg-warning-50 text-warning-600 hover:bg-warning-100 focus:ring-warning-500',
      subtle: 'text-warning-600 hover:text-warning-700 hover:bg-warning-50',
    },
    info: {
      solid: 'bg-info-500 text-white hover:bg-info-600 focus:ring-info-500',
      outline: 'border-info-500 text-info-500 hover:bg-info-50 focus:ring-info-500',
      ghost: 'text-info-500 hover:bg-info-50 focus:ring-info-500',
      soft: 'bg-info-50 text-info-600 hover:bg-info-100 focus:ring-info-500',
      subtle: 'text-info-600 hover:text-info-700 hover:bg-info-50',
    },
  }

  return (
    colorMap[color]?.[variant as keyof (typeof colorMap)[typeof color]] || colorMap.primary.solid
  )
}

export function getSizeClasses(
  size: SizeVariant,
  type: 'button' | 'input' | 'text' = 'button'
): string {
  const sizeMap = {
    button: {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-2.5 py-1.5 text-sm',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-2.5 text-base',
      xl: 'px-6 py-3 text-lg',
    },
    input: {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-2.5 py-1.5 text-sm',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-2.5 text-base',
      xl: 'px-6 py-3 text-lg',
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
