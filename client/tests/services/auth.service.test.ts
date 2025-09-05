import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthService } from '~/services/auth.service'

// Mock useSanctumClient
const mockClient = vi.fn()
vi.mock('~/services/api', () => ({
  BaseApiService: class {
    protected client = mockClient
    protected async post(endpoint: string, body?: unknown) {
      return mockClient(endpoint, { method: 'POST', body })
    }
    protected async get(endpoint: string) {
      return mockClient(endpoint, { method: 'GET' })
    }
    protected async put(endpoint: string, body?: unknown) {
      return mockClient(endpoint, { method: 'PUT', body })
    }
  }
}))

describe('AuthService', () => {
  let authService: AuthService

  beforeEach(() => {
    authService = new AuthService()
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should call login endpoint with credentials', async () => {
      const credentials = { email: 'test@example.com', password: 'password' }
      const mockResponse = { success: true, user: { id: 1, email: 'test@example.com' } }
      
      mockClient.mockResolvedValueOnce(mockResponse)

      const result = await authService.login(credentials)

      expect(mockClient).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        body: credentials
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('register', () => {
    it('should call register endpoint with user data', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        password_confirmation: 'password',
        terms: true
      }
      const mockResponse = { success: true, message: 'Registration successful' }
      
      mockClient.mockResolvedValueOnce(mockResponse)

      const result = await authService.register(userData)

      expect(mockClient).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        body: userData
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('logout', () => {
    it('should call logout endpoint', async () => {
      const mockResponse = { success: true, message: 'Logged out successfully' }
      
      mockClient.mockResolvedValueOnce(mockResponse)

      const result = await authService.logout()

      expect(mockClient).toHaveBeenCalledWith('/api/auth/logout', {
        method: 'POST'
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getProfile', () => {
    it('should call user profile endpoint', async () => {
      const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' }
      
      mockClient.mockResolvedValueOnce(mockUser)

      const result = await authService.getProfile()

      expect(mockClient).toHaveBeenCalledWith('/api/auth/user', { method: 'GET' })
      expect(result).toEqual(mockUser)
    })
  })

  describe('forgotPassword', () => {
    it('should call forgot password endpoint', async () => {
      const email = { email: 'test@example.com' }
      const mockResponse = { success: true, message: 'Reset link sent' }
      
      mockClient.mockResolvedValueOnce(mockResponse)

      const result = await authService.forgotPassword(email)

      expect(mockClient).toHaveBeenCalledWith('/api/auth/forgot-password', {
        method: 'POST',
        body: email
      })
      expect(result).toEqual(mockResponse)
    })
  })
})