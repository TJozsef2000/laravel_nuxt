// Form component types
import type { BaseComponentProps, SizeVariant } from './base'

// Input component props
export interface InputProps extends BaseComponentProps {
  modelValue?: string | number
  type?: string
  placeholder?: string
  readonly?: boolean
  required?: boolean
  error?: boolean
  size?: SizeVariant
  icon?: string
  iconPosition?: 'left' | 'right'
}

// Checkbox component props  
export interface CheckboxProps extends BaseComponentProps {
  modelValue?: boolean | any[]
  value?: any
  name?: string
  required?: boolean
  color?: string
  size?: SizeVariant
}

// Select component props
export interface SelectProps extends BaseComponentProps {
  modelValue?: string | number | null
  options?: SelectOption[]
  placeholder?: string
  required?: boolean
  size?: SizeVariant
  searchable?: boolean
  multiple?: boolean
}

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

// Textarea component props
export interface TextareaProps extends BaseComponentProps {
  modelValue?: string
  placeholder?: string
  readonly?: boolean
  required?: boolean
  rows?: number
  resize?: boolean
  size?: SizeVariant
}

// Form validation types
export interface FormErrors {
  [key: string]: string[]
}

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}