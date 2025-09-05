export interface BaseApiResponse {
  success: boolean
  message: string
  data?: unknown
}

export interface ApiSuccessResponse<T = unknown> extends BaseApiResponse {
  success: true
  data: T
}

export interface ApiErrorResponse extends BaseApiResponse {
  success: false
  data: null
  errors?: Record<string, string[]>
  debug?: {
    exception: string
    file: string
    line: number
    trace: string
  }
}

export interface AuthSuccessResponse<T = unknown> extends BaseApiResponse {
  success: true
  user: T
}

export interface ApiResponse<T = unknown> extends BaseApiResponse {
  success: boolean
  data?: T
}

export interface ApiCollectionResponse<T = unknown> extends BaseApiResponse {
  success: true
  data: {
    items: T[]
    pagination?: {
      current_page: number
      last_page: number
      per_page: number
      total: number
    }
  }
}
