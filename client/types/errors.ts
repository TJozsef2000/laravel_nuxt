export interface ApiError {
  status?: number
  data?: {
    success?: false
    message?: string
    errors?: Record<string, string[]>
    data?: null
    debug?: {
      exception: string
      file: string
      line: number
      trace: string
    }
  }
  message?: string
}

export type ToastColor =
  | 'success'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'warning'
  | 'error'
  | 'neutral'

export interface ToastAction {
  label: string
  click?: () => void
}

export interface ToastOptions {
  color?: ToastColor
  icon?: string
  timeout?: number
  actions?: ToastAction[]
}
