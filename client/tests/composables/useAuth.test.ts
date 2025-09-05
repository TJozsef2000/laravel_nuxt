import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuth } from '~/composables/useAuth'

// Mock the auth service
const mockAuthService = {
  register: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
  updateProfile: vi.fn(),
  resendEmailVerification: vi.fn(),
}

vi.mock('~/services', () => ({
  authService: mockAuthService
}))

// Mock Sanctum composables
const mockLogin = vi.fn()
const mockLogout = vi.fn()
const mockRefreshIdentity = vi.fn()
const mockUser = { value: null as any }

vi.mock('#app', () => ({
  useSanctumUser: () => mockUser,
  useSanctumAuth: () => ({
    login: mockLogin,
    logout: mockLogout,
    refreshIdentity: mockRefreshIdentity,
  }),
  navigateTo: vi.fn(),
}))

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUser.value = null
  })

  it('should return user state and auth methods', () => {
    const auth = useAuth()

    expect(auth).toHaveProperty('user')
    expect(auth).toHaveProperty('isLoggedIn')
    expect(auth).toHaveProperty('isGuest')
    expect(auth).toHaveProperty('signIn')
    expect(auth).toHaveProperty('signUp')
    expect(auth).toHaveProperty('signOut')
  })

  it('should indicate user is guest when no user', () => {
    const auth = useAuth()
    
    expect(auth.isLoggedIn.value).toBe(false)
    expect(auth.isGuest.value).toBe(true)
  })

  it('should indicate user is logged in when user exists', () => {
    mockUser.value = { id: 1, name: 'Test User' }
    const auth = useAuth()
    
    expect(auth.isLoggedIn.value).toBe(true)
    expect(auth.isGuest.value).toBe(false)
  })

  describe('signIn', () => {
    it('should call login and return success', async () => {
      const credentials = { email: 'test@example.com', password: 'password' }
      mockLogin.mockResolvedValueOnce(undefined)
      
      const auth = useAuth()
      const result = await auth.signIn(credentials)

      expect(mockLogin).toHaveBeenCalledWith(credentials)
      expect(result).toEqual({ success: true, error: null })
    })

    it('should return error on login failure', async () => {
      const credentials = { email: 'test@example.com', password: 'wrong' }
      const error = new Error('Invalid credentials')
      mockLogin.mockRejectedValueOnce(error)
      
      const auth = useAuth()
      const result = await auth.signIn(credentials)

      expect(result).toEqual({
        success: false,
        error: 'Invalid credentials'
      })
    })
  })

  describe('signUp', () => {
    it('should call auth service register and refresh identity', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        password_confirmation: 'password',
        terms: true
      }
      const mockResponse = { success: true, data: { user: { id: 1 } } }
      
      mockAuthService.register.mockResolvedValueOnce(mockResponse)
      mockRefreshIdentity.mockResolvedValueOnce(undefined)
      
      const auth = useAuth()
      const result = await auth.signUp(userData)

      expect(mockAuthService.register).toHaveBeenCalledWith(userData)
      expect(mockRefreshIdentity).toHaveBeenCalled()
      expect(result).toEqual({
        success: true,
        error: null,
        user: { id: 1 }
      })
    })
  })

  describe('signOut', () => {
    it('should call logout and navigate to login', async () => {
      mockLogout.mockResolvedValueOnce(undefined)
      
      const auth = useAuth()
      const result = await auth.signOut()

      expect(mockLogout).toHaveBeenCalled()
      expect(result).toEqual({ success: true, error: null })
    })
  })

  describe('forgotPassword', () => {
    it('should call auth service forgot password', async () => {
      const email = { email: 'test@example.com' }
      mockAuthService.forgotPassword.mockResolvedValueOnce({ success: true })
      
      const auth = useAuth()
      const result = await auth.forgotPassword(email)

      expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(email)
      expect(result).toEqual({ success: true, error: null })
    })
  })
})