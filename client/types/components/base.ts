// Base component types and shared UI interfaces

export type ColorVariant = 'primary' | 'neutral' | 'success' | 'error' | 'warning' | 'info'
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'soft' | 'subtle'
export type AlertVariant = 'solid' | 'outline' | 'soft' | 'subtle'

// Base component props that many components share
export interface BaseComponentProps {
  class?: string
  disabled?: boolean
}

// Props with common size and color variants
export interface StyledComponentProps extends BaseComponentProps {
  size?: SizeVariant
  color?: ColorVariant
}

// Loading states
export interface LoadableProps {
  loading?: boolean
}