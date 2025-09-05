// UI component types
import type { BaseComponentProps, StyledComponentProps, ColorVariant, SizeVariant, ButtonVariant, AlertVariant, LoadableProps } from './base'

// Button component props
export interface ButtonProps extends StyledComponentProps, LoadableProps {
  variant?: ButtonVariant
  block?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
  to?: string
  href?: string
  target?: string
  type?: 'button' | 'submit' | 'reset'
}

// Card component props
export interface CardProps extends BaseComponentProps {
  padding?: boolean
  shadow?: boolean
  border?: boolean
  rounded?: boolean
}

// Modal component props
export interface ModalProps extends BaseComponentProps {
  modelValue?: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  closable?: boolean
  persistent?: boolean
}

// Alert component props
export interface AlertProps extends BaseComponentProps {
  variant?: AlertVariant
  color?: ColorVariant
  title?: string
  description?: string
  icon?: string
  closable?: boolean
}

// Badge component props
export interface BadgeProps extends StyledComponentProps {
  variant?: 'solid' | 'outline' | 'soft' | 'subtle'
  dot?: boolean
  ping?: boolean
}

// Toast notification types
export interface ToastProps {
  id?: string
  title?: string
  description?: string
  color?: ColorVariant
  variant?: 'solid' | 'outline' | 'soft'
  duration?: number
  closable?: boolean
  actions?: UIToastAction[]
}

export interface UIToastAction {
  label: string
  action: () => void
  style?: 'primary' | 'secondary'
}

// Table component props
export interface TableProps extends BaseComponentProps {
  data?: any[]
  columns?: TableColumn[]
  loading?: boolean
  selectable?: boolean
  sortable?: boolean
  pagination?: boolean
}

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: any) => string
}

// Navigation types
export interface NavigationItem {
  label: string
  to?: string
  href?: string
  icon?: string
  badge?: string | number
  children?: NavigationItem[]
  active?: boolean
  disabled?: boolean
}

// Dropdown component props
export interface DropdownProps extends BaseComponentProps {
  items?: DropdownItem[]
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
  trigger?: 'click' | 'hover'
}

export interface DropdownItem {
  label: string
  value?: any
  icon?: string
  disabled?: boolean
  divider?: boolean
  action?: () => void
}