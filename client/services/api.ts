// Base API service with useSanctumClient integration
import type { 
  ApiRequestConfig, 
  BaseApiResponse, 
  ApiSuccessResponse, 
  ApiErrorResponse,
  HttpMethod
} from '~/types/api/base'

export class BaseApiService {
  protected get client() {
    return useSanctumClient()
  }

  /**
   * Make a generic API request
   */
  protected async request<T = unknown>(
    endpoint: string, 
    config: ApiRequestConfig = {}
  ): Promise<T> {
    const { method = 'GET', body, params, headers = {} } = config

    try {
      const options: any = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...headers,
        },
      }

      // Add query parameters for GET requests
      if (params && Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            searchParams.append(key, String(value))
          }
        })
        endpoint = `${endpoint}?${searchParams.toString()}`
      }

      // Add body for non-GET requests
      if (body && method !== 'GET') {
        options.body = JSON.stringify(body)
      }

      const response = await this.client(endpoint, options)
      return response as T
    } catch (error) {
      console.error(`API request failed: ${method} ${endpoint}`, error)
      throw this.handleError(error)
    }
  }

  /**
   * GET request
   */
  protected async get<T = unknown>(
    endpoint: string, 
    params?: Record<string, unknown>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params })
  }

  /**
   * POST request
   */
  protected async post<T = unknown>(
    endpoint: string, 
    body?: unknown,
    config?: Omit<ApiRequestConfig, 'method' | 'body'>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, ...config })
  }

  /**
   * PUT request
   */
  protected async put<T = unknown>(
    endpoint: string, 
    body?: unknown,
    config?: Omit<ApiRequestConfig, 'method' | 'body'>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body, ...config })
  }

  /**
   * PATCH request
   */
  protected async patch<T = unknown>(
    endpoint: string, 
    body?: unknown,
    config?: Omit<ApiRequestConfig, 'method' | 'body'>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body, ...config })
  }

  /**
   * DELETE request
   */
  protected async delete<T = unknown>(
    endpoint: string,
    config?: Omit<ApiRequestConfig, 'method'>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', ...config })
  }

  /**
   * Handle API errors consistently
   * Preserve original error structure for proper field-specific error handling
   */
  protected handleError(error: unknown): Error {
    // Don't convert to generic Error - preserve the original error structure
    // This allows useFormErrors to extract field-specific validation errors
    if (error instanceof Error) {
      return error
    }

    // For FetchError objects, preserve them as-is so field extraction works
    if (error && typeof error === 'object') {
      // Create an error that preserves the original error data
      const preservedError = new Error('API request failed')
      // Attach the original error data to the error object
      Object.assign(preservedError, error)
      return preservedError
    }

    return new Error('An unexpected error occurred')
  }

  /**
   * Check if response is successful
   */
  protected isSuccessResponse(response: BaseApiResponse): response is ApiSuccessResponse {
    return response.success === true
  }

  /**
   * Extract data from API response
   */
  protected extractData<T>(response: ApiSuccessResponse<T>): T {
    return response.data
  }
}